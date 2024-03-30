# SchoolNexus

> An all-in-one school management system for principals, teachers, and students.

### Setup

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
