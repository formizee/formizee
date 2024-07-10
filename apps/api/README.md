# Formizee API

## Project Structure
```
󰝰  @formizee/api 
   󰝰  drizzle       <-- Database Configurations
  │  󰉋  migrations  
  │ │  db.ts        
  │ ╰  schemas.ts
   󰝰  emails        <-- Email templates
   󰝰  src
  │  󰉋  data        <-- Implementation of domain
  │  󰉋  lib         
  │  󰉋  routes      
  │  󰉋  schemas     <-- OpenAPI schema definitions
  │  󰉋  useCases
  │ ╰  index.ts     <-- API entry point
   󰝰  tests
  │  󰉋  integration
  ╰  󰉋  unit
```

### drizzle
We use *Drizzle ORM* to handle our *PostgreSQL* database:

- The `db.ts` file contains all the definitions ready to use in the `data` layer
- The `schemas.ts` file contains how the database is modeled
- The `migrations` directory are contained all the queries in .sql files

> For more information about visit the [Drizzle Docs](https://orm.drizzle.team/docs/overview)

### emails
We use *React Email* to build the email templates:

> For more information about visit the [React Email Docs](https://react.email/docs/introduction)

### src/data
Here lives the actual implementations of all the repositories and services defined
in the `domain` package.

### src/routes
Where the api routes comes to live, each path has 3 diferent files:
- `index.ts` Contains the actual logic implementaion of the route, since we don't use controllers.
- `routes.ts` Defines the OpenAPI schema of each path in the route.
- `schemas.ts` Defines all the requests inputs with zod, used in the `routes.ts` file.

### src/schemas
OpenAPI object schemas definitions, if you need to update other OpenAPI document information,
go ahead to the `src/lib/openapi`.

### src/useCases
Just the useCases layer to use data implementations, if you don't totally understand this,
please check *Clean Architecture* guides.

### tests
Tests Suite with *Vitest*, by the moment only suporting `unit tests` and `integration tests`.

Also we are using *Testcontainers* to mock the database when running integration test,
please check the [Testcontainers Docs](https://node.testcontainers.org/)

---
© 2024 Formizee - All Rights Reserved
