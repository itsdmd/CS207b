# SchoolNexus Server

> Code base for SchoolNexus's server.

This project was scaffolded using [Vite](https://vitejs.dev/)'s `react` template (JavaScript + SWC). **PostgreSQL** is used for the database and managed using [Prisma](https://www.prisma.io/).

## Getting Started

First, make a copy of `.env.example` and rename it to `.env`.

To get started, run the following commands:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The default port for the server is `20700`. Edit the `PORT` environment variable in `.env` as needed.

### Prisma

#### Initialize

Before initializing Prisma, make sure you have a PostgreSQL server running. Edit the `DATABASE_URL` environment variables to match your database configurations.

Populate the database: _WIP_

```bash
npm run dtb-populate
```

#### Migration

When you make changes to the database schema, a new migration file needs to be generated. To do so, run the following command:

```bash
npm run prisma-migrate
```

More details can be found in the [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate).

**TL;DR**: Migrate helps to keep track of changes to the database schema and saved in the `prisma/migrations` directory. When new breaking changes are made, delete the `prisma/migrations` directory and run `prisma-migrate` & `dtb-populate` again.
