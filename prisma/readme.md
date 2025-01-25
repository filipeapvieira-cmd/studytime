# How to connect to Postgres DB

1. `npx prisma generate`
2. `npx prisma db push`
3. `npx prisma db seed` 

# Others

## Clear the existing data before running your seed (so you have a blank slate):
1. `npx prisma db push --force-reset`
2. `npx prisma db seed`