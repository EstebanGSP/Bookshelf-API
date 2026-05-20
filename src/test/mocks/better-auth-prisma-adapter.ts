export const prismaAdapter = (...args: unknown[]) => ({
  adapter: 'prisma',
  args,
});
