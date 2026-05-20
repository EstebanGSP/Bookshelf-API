import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthUser } from '../common/types/auth-user';
import { ClubRole } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ImportCsvDto } from './dto/import-csv.dto';
import { ImportReportDto, ImportRowErrorDto } from './dto/import-report.dto';

interface CsvRow {
  line: number;
  values: Record<string, string>;
}

interface CatalogBookImportRow {
  row: number;
  isbn: string | null;
  title: string;
  author: string;
  genre: string | null;
  pageCount: number | null;
  description: string | null;
  publishedAt: Date | null;
}

interface ClubMemberImportRow {
  row: number;
  email: string;
  role: ClubRole;
}

@Injectable()
export class ImportsService {
  constructor(private readonly prisma: PrismaService) {}

  async importCatalogBooks(dto: ImportCsvDto): Promise<ImportReportDto> {
    const parsed = this.parseCsv(dto.csv);
    const errors = [...parsed.errors];
    const rows: CatalogBookImportRow[] = [];
    const seenIsbn = new Set<string>();

    parsed.rows.forEach((row) => {
      const item = this.parseCatalogBookRow(row);
      errors.push(...item.errors);
      if (!item.value) {
        return;
      }

      if (item.value.isbn) {
        if (seenIsbn.has(item.value.isbn)) {
          errors.push({
            row: item.value.row,
            message: `Duplicate ISBN ${item.value.isbn} in CSV`,
          });
        }
        seenIsbn.add(item.value.isbn);
      }
      rows.push(item.value);
    });

    if (rows.length) {
      const existing = await this.prisma.catalogBook.findMany({
        where: {
          isbn: { in: rows.map((row) => row.isbn).filter(Boolean) as string[] },
        },
        select: { isbn: true },
      });
      existing.forEach((book) => {
        const row = rows.find((item) => item.isbn === book.isbn);
        errors.push({
          row: row?.row ?? 0,
          message: `ISBN ${book.isbn} already exists in catalog`,
        });
      });
    }

    if (errors.length) {
      return { imported: 0, errors };
    }

    await this.prisma.$transaction(
      rows.map((row) =>
        this.prisma.catalogBook.create({
          data: {
            isbn: row.isbn,
            title: row.title,
            author: row.author,
            genre: row.genre,
            pageCount: row.pageCount,
            description: row.description,
            publishedAt: row.publishedAt,
          },
        }),
      ),
    );

    return { imported: rows.length, errors: [] };
  }

  async importClubMembers(
    clubId: string,
    dto: ImportCsvDto,
    actor: AuthUser,
  ): Promise<ImportReportDto> {
    await this.ensureCanImportMembers(clubId, actor);

    const parsed = this.parseCsv(dto.csv);
    const errors = [...parsed.errors];
    const rows: ClubMemberImportRow[] = [];
    const seenEmails = new Set<string>();

    parsed.rows.forEach((row) => {
      const item = this.parseClubMemberRow(row);
      errors.push(...item.errors);
      if (!item.value) {
        return;
      }

      if (seenEmails.has(item.value.email)) {
        errors.push({
          row: item.value.row,
          message: `Duplicate email ${item.value.email} in CSV`,
        });
      }
      seenEmails.add(item.value.email);
      rows.push(item.value);
    });

    const users = rows.length
      ? await this.prisma.user.findMany({
          where: { email: { in: rows.map((row) => row.email) } },
          select: { id: true, email: true },
        })
      : [];
    const userByEmail = new Map(users.map((user) => [user.email, user]));

    const existingMembers = rows.length
      ? await this.prisma.clubMember.findMany({
          where: {
            clubId,
            user: { email: { in: rows.map((row) => row.email) } },
          },
          select: { user: { select: { email: true } } },
        })
      : [];
    existingMembers.forEach((member) => {
      const row = rows.find((item) => item.email === member.user.email);
      errors.push({
        row: row?.row ?? 0,
        message: `${member.user.email} is already a club member`,
      });
    });

    const existingInvites = rows.length
      ? await this.prisma.clubInvitation.findMany({
          where: { clubId, email: { in: rows.map((row) => row.email) } },
          select: { email: true },
        })
      : [];
    existingInvites.forEach((invite) => {
      const row = rows.find((item) => item.email === invite.email);
      errors.push({
        row: row?.row ?? 0,
        message: `${invite.email} already has an invitation`,
      });
    });

    if (errors.length) {
      return { imported: 0, errors };
    }

    await this.prisma.$transaction(async (tx) => {
      for (const row of rows) {
        const user = userByEmail.get(row.email);
        if (user) {
          await tx.clubMember.create({
            data: { clubId, userId: user.id, role: row.role },
          });
          await tx.clubInvitation.create({
            data: {
              clubId,
              email: row.email,
              role: row.role,
              invitedById: actor.id,
              invitedUserId: user.id,
              accepted: true,
            },
          });
          continue;
        }

        await tx.clubInvitation.create({
          data: {
            clubId,
            email: row.email,
            role: row.role,
            invitedById: actor.id,
            accepted: false,
          },
        });
      }
    });

    return { imported: rows.length, errors: [] };
  }

  private async ensureCanImportMembers(clubId: string, actor: AuthUser) {
    const club = await this.prisma.club.findUnique({ where: { id: clubId } });
    if (!club) {
      throw new NotFoundException(`Club ${clubId} not found`);
    }
    if (actor.role === 'ADMIN') {
      return;
    }

    const membership = await this.prisma.clubMember.findUnique({
      where: { userId_clubId: { userId: actor.id, clubId } },
    });
    if (membership?.role !== ClubRole.OWNER) {
      throw new ForbiddenException('Only club owners can import members');
    }
  }

  private parseCatalogBookRow(row: CsvRow): {
    value?: CatalogBookImportRow;
    errors: ImportRowErrorDto[];
  } {
    const errors: ImportRowErrorDto[] = [];
    const title = this.required(row, 'title', errors);
    const author = this.required(row, 'author', errors);
    const isbn = this.optional(row, 'isbn');
    const genre = this.optional(row, 'genre');
    const description = this.optional(row, 'description');
    const pageCount = this.optionalInt(row, 'pageCount', errors);
    const publishedAt = this.optionalDate(row, 'publishedAt', errors);

    if (errors.length || !title || !author) {
      return { errors };
    }

    return {
      value: {
        row: row.line,
        isbn,
        title,
        author,
        genre,
        pageCount,
        description,
        publishedAt,
      },
      errors,
    };
  }

  private parseClubMemberRow(row: CsvRow): {
    value?: ClubMemberImportRow;
    errors: ImportRowErrorDto[];
  } {
    const errors: ImportRowErrorDto[] = [];
    const email = this.required(row, 'email', errors)?.toLowerCase();
    const roleInput = (this.optional(row, 'role') ?? 'READER').toUpperCase();

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ row: row.line, message: 'email must be valid' });
    }
    if (!Object.values(ClubRole).includes(roleInput as ClubRole)) {
      errors.push({
        row: row.line,
        message: 'role must be one of OWNER, EDITOR, READER',
      });
    }
    if (errors.length || !email) {
      return { errors };
    }

    return {
      value: { row: row.line, email, role: roleInput as ClubRole },
      errors,
    };
  }

  private parseCsv(csv: string): {
    rows: CsvRow[];
    errors: ImportRowErrorDto[];
  } {
    const errors: ImportRowErrorDto[] = [];
    const lines = csv
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
      return {
        rows: [],
        errors: [
          { row: 1, message: 'CSV must contain a header and at least one row' },
        ],
      };
    }

    const headers = this.parseCsvLine(lines[0]).map((header) => header.trim());
    const rows = lines.slice(1).map((line, index) => {
      const lineNumber = index + 2;
      const values = this.parseCsvLine(line);
      if (values.length !== headers.length) {
        errors.push({
          row: lineNumber,
          message: `Expected ${headers.length} columns but found ${values.length}`,
        });
      }

      return {
        line: lineNumber,
        values: Object.fromEntries(
          headers.map((header, valueIndex) => [
            header,
            (values[valueIndex] ?? '').trim(),
          ]),
        ),
      };
    });

    return { rows, errors };
  }

  private parseCsvLine(line: string) {
    const values: string[] = [];
    let value = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const next = line[index + 1];

      if (char === '"' && inQuotes && next === '"') {
        value += '"';
        index += 1;
        continue;
      }
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === ',' && !inQuotes) {
        values.push(value);
        value = '';
        continue;
      }

      value += char;
    }

    values.push(value);
    return values;
  }

  private required(row: CsvRow, field: string, errors: ImportRowErrorDto[]) {
    const value = this.optional(row, field);
    if (!value) {
      errors.push({ row: row.line, message: `${field} is required` });
    }
    return value;
  }

  private optional(row: CsvRow, field: string) {
    const value = row.values[field]?.trim();
    return value ? value : null;
  }

  private optionalInt(row: CsvRow, field: string, errors: ImportRowErrorDto[]) {
    const value = this.optional(row, field);
    if (!value) {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      errors.push({
        row: row.line,
        message: `${field} must be a positive integer`,
      });
      return null;
    }
    return parsed;
  }

  private optionalDate(
    row: CsvRow,
    field: string,
    errors: ImportRowErrorDto[],
  ) {
    const value = this.optional(row, field);
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      errors.push({ row: row.line, message: `${field} must be a valid date` });
      return null;
    }
    return parsed;
  }
}
