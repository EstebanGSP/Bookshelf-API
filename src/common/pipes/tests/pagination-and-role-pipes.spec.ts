import { BadRequestException } from '@nestjs/common';
import { CursorPaginationPipe } from '../cursor-pagination.pipe';
import { OffsetPaginationPipe } from '../offset-pagination.pipe';
import { UserRolePipe } from '../user-role.pipe';

describe('Common pipes', () => {
  it('normalizes offset pagination with defaults and caps the limit', () => {
    const pipe = new OffsetPaginationPipe();

    expect(pipe.transform({})).toEqual({ page: 1, limit: 20, skip: 0 });
    expect(pipe.transform({ page: '3', limit: '500' })).toEqual({
      page: 3,
      limit: 100,
      skip: 200,
    });
  });

  it('rejects invalid offset pagination values', () => {
    const pipe = new OffsetPaginationPipe();

    expect(() => pipe.transform({ page: '0' })).toThrow(BadRequestException);
    expect(() => pipe.transform({ limit: 'abc' })).toThrow(BadRequestException);
  });

  it('normalizes cursor pagination and validates UUID cursors', () => {
    const pipe = new CursorPaginationPipe();
    const cursor = '7d1f7e8c-579f-43e2-9745-2385ec9475dd';

    expect(pipe.transform({ cursor, limit: '5' })).toEqual({
      cursor,
      limit: 5,
    });
    expect(() => pipe.transform({ cursor: 'bad-cursor' })).toThrow(
      BadRequestException,
    );
  });

  it('normalizes optional global user roles', () => {
    const pipe = new UserRolePipe();

    expect(pipe.transform(undefined)).toBeUndefined();
    expect(pipe.transform('admin')).toBe('ADMIN');
    expect(() => pipe.transform('teacher')).toThrow(BadRequestException);
  });
});
