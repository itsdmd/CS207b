# ⚡ SchoolNexus Server

> Managing database and handle API requests for SchoolNexus.

This project was scaffolded using [Apollo GraphQL Server](https://www.apollographql.com/docs/apollo-server). **PostgreSQL** is used for the database and managed using [Prisma](https://www.prisma.io/).

## Getting Started

First, make a copy of `.env.example` and rename it to `.env`. Make changes to the environment variables as needed.

To get started, run the following commands _(make sure all commands below are run in the same directory as this README file)_:

```bash
# Install dependencies
npm install

# Start server
npm start
```

### Database

#### Initialize

Prequisites:

-   A working PostgreSQL server ([installation guide](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/)) with a database created.
-   Edit `DATABASE_URL` in `.env` file to match your database server configurations.

To initialize Prisma, run the following command:

```bash
# Migrating (read below for further details)
npm run dtb-migrate

# Seeding (read below for further details)
npm run dtb-seed

# (Optional) Start Prisma Studio
npx prisma studio
```

If you don't use PostgreSQL _(not recommended)_, please run the following command instead:

```bash
npx prisma init --datasource-provider <provider>
```

More details can be found in the [Prisma documentation](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch).

#### Migration

When you create a new database schema, make changes to an existing one or recently pulled new commits, a new migration file needs to be generated. To do so, run the following command:

```bash
npm run dtb-migrate
```

More details can be found in the [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate).

> **TL;DR**: Migrate helps to keep track of changes to the database schema and saved in the `prisma/migrations` directory. When new breaking changes are made, delete the `prisma/migrations` directory and run `dtb-migrate` & `dtb-seed` again.

#### Seeding

Populate the database with dummy data set for development and testing by running the following command:

```bash
npm run dtb-seed
```

> :warning: **WARNING**: By default, this command will delete all existing data in the database and populate it with dummy data. Modify the lines at the bottom of [`src/models/_seeder.js`](/SchoolNexus-Server/src/models/_seeder.js) file as needed.

##### Seeding order

1. `User`
1. `Relative`
1. `School`
1. `Room` (dependencies: School.id)
1. `UserSchoolAssignment` (d: User.id; School.id)
1. `Classs` (d: School.id)
1. `Subject`
1. `TeacherSubjectAssignment` (d: Teacher.id; Subject.id)
1. `UserClasssAssignment` (d: User.id; Classs.id)
1. `Semester`
1. `TimetableEntry` (d: Semester.id; School.id; Classs.id)
1. `TimetableEntryAttendence` (d: TimetableEntry.id; User.id)
1. `GradeType`
1. `StudentGrade` (d: Student.id; Teacher.id; Semester.id; Subject.id; GradeType.id)
1. `Meeting` (d: School.id; Room.id; User.id)
1. `MeetingAttendence` (d: Meeting.id; User.id)

> `Classs` is NOT a typo. It is the used to avoid conflict with the keyword `class` used in JS.

## FAQ

### Why PostgreSQL was chosen? Why not MySQL or MongoDB?

#### \+ Pros

-   It is **more SQL-compliant**, supports most standard SQL subqueries (eg. `LIMIT`, `ALL`, etc.) and clauses (`INTERSECT`, `OUTER JOIN`, etc.) that are not supported by MySQL. It's not a deal-breaker to not have them, but they can provide more flexibility and intuitiveness when writing more complex queries.
-   It is an **object-relational database**, which means it supports more complex data types natively (eg. arrays, JSON, etc.) and allow propety inheritance. This is suitable for this project since most of the data are represented as objects.
-   Data are **structured** and need integrity, therefore NoSQL databases like MongoDB are not suitable for this project.
-   PostgreSQL is fully open-source and released under [PostgreSQL License](https://www.postgresql.org/about/licence/), making it completely **free** (both in _"free beer"_ and _"freedom"_) to use.
-   Extensive support for all Prisma features related to relational database. See [Prisma documentation](https://www.prisma.io/docs/reference/database-reference/database-features) for more details.

#### \- Cons:

-   It is more **resource-intensive** than MySQL since it needs to generate a new system process via memory allocation for every client connection established.
-   It has **no commercial support** and rely fully on community or voluntary support, make it more difficult to maintain and find helps when needed.

### Database visualization

Rendered ERD file: [`prisma/diagram.png`](/SchoolNexus-Server/prisma/diagram.png).

For an interactive diagram, please visit this link: [dbdiagram.io](https://dbdiagram.io/d/CS207b-Final-65e9afacb1f3d4062c5d5f56)

### Why use Prisma?

[Prisma](https://www.prisma.io) is an open-source database toolkit that makes it **easier to work with databases**, including database migrations, schema management, and data access.

-   Easily connect to and operate on database with Prisma Client
-   Keep track of database schema changes and sync them with local database with Prisma Migrate
-   More abstract and formulated way to perform CRUD operations with the use of object-relational mapping (ORM)

### Why use GraphQL?

GraphQL is a query language for APIs and a runtime for fulfilling those queries with existing data. GraphQL gives **clients** the ability to **ask for exactly what they need**, makes it easier to evolve the API over time while maintaining speed, flexibility, and bandwidth usage.

Apollo helps to make the process of building GraphQL APIs easier and faster by providing a set of tools and best practices.

### Are seeded data fully randomized?

**No**. The data are generated using [Chance.js](https://chancejs.com/) with some constraints to ensure both data integrity _AND_ logicality.

For example, a student born in 2010 can only be a member of a 7th or 8th grade class as of 2023, and each class can only have a limited number of students with 1 form teacher.

To fine-tune the constraints and conditions, edit the [`src/models/_seeder.js`](/SchoolNexus-Server/src/models/_seeder.js) file as needed.

### How are the passwords stored?

Passwords are hashed using [bcrypt](https://www.npmjs.com/package/bcrypt) with a default salt of 10 rounds. The salt is automatically generated and stored in the hash itself, so there is no need to store it separately.
