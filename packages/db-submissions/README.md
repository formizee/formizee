# Submissions DB

We are using `sqlite (turso)` with `drizzle-orm` as database to store the submissions data.

## Usage

### Setup

Start the migration script inside of `/packages/db` to have the database schema
up to date:

```bash
$ pnpm migrate
```

You should be ready to go! Check out the Drizzle Studio to see if your tables
have been created:

```$
$ pnpm studio
```
### Example

```typescript
import {db, eq, submission} from '@formizee/db'

await db.query.submissions.findFirst({
  where: eq(submission.id, "sub_example")
})

```
> For more info see the [Drizzle Docs](https://orm.drizzle.team/docs/overview)
