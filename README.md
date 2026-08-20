# School Records

A learning project: a school-records backend built on [Rayfin](https://www.npmjs.com/package/@microsoft/rayfin-core),
Microsoft's backend-as-a-service for Fabric. Scaffolded from the Basic Todo App
template and rebuilt around a four-entity data model.

## Data model

| Entity | Fields |
|---|---|
| `Teacher` | `id`, `name`, `email` |
| `Subject` | `id`, `name`, `teacher` → Teacher |
| `Student` | `id`, `name`, `yearGroup` (int) |
| `Enrollment` | `id`, `student` → Student, `subject` → Subject, `grade` (int 0–100) |

### Why Enrollment exists

A student takes many subjects; a subject has many students. That's a many-to-many
relationship, which Rayfin does not support. `Enrollment` is a hand-built join
table: one `@one()` relation to each side.

`grade` lives on `Enrollment` rather than on Student or Subject because it belongs
to the *pair* — a grade is meaningless without knowing both who earned it and in
what subject.

Foreign keys sit on the "many" side. `Subject` holds the reference to its
`Teacher`, not the reverse, because a column can only hold one value.

## What Rayfin generates

Decorators are build-time labels read by a code generator. From the entity classes
in `rayfin/data/`, Rayfin produces:

- **SQL tables** (MSSQL dialect) — one per `@entity()` class, with columns derived
  from field decorators and foreign keys auto-generated from `@one()`/`@many()`
- **A GraphQL API** via Data API Builder, with typed CRUD operations
- **A typed client** — `client.data.<Entity>` with autocomplete over your fields

Entities must be registered in `rayfin/data/schema.ts`. An entity file that exists
but isn't in that array is silently ignored.

## Queries

`src/queries.ts` contains three:

- `getAllStudents()` — straightforward select
- `getStudentGrades(studentId)` — queries `Enrollment`, filters by nested relation,
  reads the subject name via a dotted path
- `getAverageGradePerSubject()` — paginates all enrollments, then groups and
  averages in JavaScript

## Limitations found

- **No `count()`** on the fluent client. Select minimal fields and use
  `results.length`.
- **No aggregate functions.** `AVG`, `SUM`, `GROUP BY` have no equivalent — a
  one-line SQL query becomes a fetch-and-reduce in application code.
- **`.execute()` returns one page** (100 records by default) and gives no signal
  that more exist. Longer lists are silently truncated. Use `.first(n)` with
  `.executePaginated()` and `.after(cursor)`.
- **UUID primary keys only.** No composite keys, no non-`id` primary keys.
- **`@text()` without `max`** produces `NVARCHAR(MAX)` on MSSQL, which can break
  GraphQL schema generation at deploy time. Always specify `max`.

## Running it

The CLI in this build is **deploy-only**. `npx rayfin up --dry-run` lists cloud
operations exclusively — create a Fabric item, POST runtime settings, deploy static
content. There is no local Docker path despite what the bundled docs describe.

This project has therefore never been executed. Entities and queries are validated
by the TypeScript compiler only:

```bash
npx tsc --build rayfin/tsconfig.json   # build the referenced project
npx tsc --noEmit                        # type-check everything
```

With a Fabric capacity, deployment would be:

```bash
npx rayfin up              # deploy backend
npx rayfin up db apply     # apply schema changes
npx vite                   # run frontend against it
```

## Notes

The template's `Todo` entity is still present and registered. It's unused by the
school-records model and can be removed.