# SchoolNexus

> An all-in-one school management system for principals, teachers, and students.

## Overview

SchoolNexus is a web application that aims to simplify the management of schools. It provides a platform for principals, teachers, and students to interact with each other. The application is divided into two main parts: the API server (`SchoolNexus-Server`) and the web server (`SchoolNexus-Web`).

The API server is built with Node.js and Prisma, a modern database toolkit that makes it easier to work with databases. It provides a GraphQL API that allows clients to interact with the database. The database engine used is PostgreSQL, a powerful, open-source object-relational database system and is fully supported by Prisma.

The web server is built with ReactJS and Vite framework. It provides a user-friendly, easy to maintained interface using Bootstrap 5 for admins, principals, teachers, and students to access the allowed features provided by the server for each role.

## Setup

```bash
# Clone the repository
git clone https://github.com/itsdmd/CS207b.git
cd CS207b

# Install dependencies
cd SchoolNexus-Server
npm i
cd ../SchoolNexus-Web
npm i
cd ..
```

```bash
# Setup server
cd SchoolNexus-Server

# Make a copy of the .env.example file and rename it to .env
cp .env.example .env

# Edit the .env file to match your database configuration,
# especially the DATABASE_URL variable to match PostgreSQL's connection string
# DATABASE_URL=postgres://username:password@localhost:5432/schoolnexus

# Make sure you have PostgreSQL server installed and running before continue.
# Tutorial for Windows: https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/
# Tutorial for MacOS: https://www.postgresqltutorial.com/install-postgresql-macos/
# Tutorial for Linux: https://www.postgresqltutorial.com/install-postgresql-linux/
# Note: MySQL cannot be used since Prisma does not support array of enums for this provider.

# Generate database schema
npm run dtb-migrate

# (Optional) Seed the database with dummy data for testing
# npm run dtb-seed

# Start the API server
npm start
```

```bash
cd ..
# Start a new terminal window, and start the web client
cd SchoolNexus-Web

# Make a copy of the .env.example file and rename it to .env
cp .env.example .env

# Start the web server
npm run dev
```

# ⚡ SchoolNexus Server

> Managing database and handle API requests for SchoolNexus.

This project was scaffolded using [Apollo GraphQL Server](https://www.apollographql.com/docs/apollo-server). **PostgreSQL** is used for the database and managed using [Prisma](https://www.prisma.io/).

## Getting Started

First, make a copy of `.env.example` and rename it to `.env`. Make changes to the environment variables as needed.

To get started, run the following commands _(make sure all commands below are run in the same directory as this README file)_:

```bash
# Install dependencies
npm i

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

> :warning: **WARNING**: By default, this command will delete all existing data in the database and populate it with dummy data. Modify the lines at the bottom of [`SchoolNexus-Server/src/models/_seeder.js`](SchoolNexus-Server/src/models/_seeder.js) file as needed.

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
-   PostgreSQL is fully open-source and released under [PostgreSQL License](https://www.postgresql.org/about/licence/), making it completely free to use.
-   Extensive support for all Prisma features related to relational database. See [Prisma documentation](https://www.prisma.io/docs/reference/database-reference/database-features) for more details.

#### \- Cons:

-   It is more **resource-intensive** than MySQL since it needs to generate a new system process via memory allocation for every client connection established.
-   It has **no commercial support** and rely fully on community or voluntary support, make it more difficult to maintain and find helps when needed.

### Database visualization

Rendered ERD file

![database-erd](docs/database-erd.png)

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

**No**. The data are generated using with some constraints to ensure data integrity.

For example, a student born in 2010 can only be a member of a 7th or 8th grade class as of 2023, and each class can only have a limited number of students with 1 form teacher.

To fine-tune the constraints and conditions, edit the [`SchoolNexus-Server/src/models/_seeder.js`](SchoolNexus-Server/src/models/_seeder.js) file as needed.

### How are the passwords stored?

Passwords are hashed using [bcrypt](https://www.npmjs.com/package/bcrypt) with a default salt of 10 rounds. The salt is automatically generated and stored in the hash itself, so there is no need to store it separately.

# 🌐 SchoolNexus Web Interface

> Web interface for SchoolNexus.

This project was scaffolded using [Vite](https://vitejs.dev/). **ReactJS** is used for the frontend and **Bootstrap 5** for styling.

## Getting Started

First, make a copy of `.env.example` and rename it to `.env`. Make changes to the environment variables as needed.

To get started, run the following commands _(make sure all commands below are run in the same directory as this README file)_:

```bash
# Install dependencies
npm i

# Start server
npm run dev
```

## FAQ

### Why was React used? Why not Vue, Svelte, or plain HTML/CSS/JS?

React was chosen for its popularity, extensive community support, and the fact that it allows developers to create large web applications that can update data and content **without reloading** the page. It also allows for the creation of **reusable UI components**, which improves the extensibility and maintainability of the codebase. This will also make it easier to create a mobile app in the future using React Native.

Plain HTML/CSS/JS is a valid choice for simple websites or applications, but as the complexity of the project increases in the future, it can become challenging to manage and scale.

### Why was Vite used? Why not Create-React-App, Next.js, or Gatsby?

Vite was chosen for its **speed and simplicity**. It is a build tool that aims to provide a faster and leaner development experience for modern web projects. Next.js and Gatsby are great for server-side rendering and static site generation respectively, but are not necessary for this project. CRA was also considered, but ultimately rejected due to its slower performance compared to Vite.
