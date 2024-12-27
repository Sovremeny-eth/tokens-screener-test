# Tokens screener 

## Prerequisites

- Node.js 20.12.2
- [pnpm] package manager 9.14.2

[pnpm]: https://pnpm.io/

## Build

1. Install pnpm. Choose one of:
- Utilize [corepack]. Run `corepack enable` within directory.
- [install pnpm] globally. E.g. run command `npm -g install pnpm`.
2. Install dependencies: `pnpm install`.
3. Build the project: `pnpm build` 

## Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [NestJS](https://nestjs.com/) for server-side development
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Jest](https://jestjs.io/) for testing

## Settings

Once started you will need to copy the `.env.example` file to `.env` in order for environment variables to access.

```bash
cp .env.example .env
```

## Commands:

- `pnpm dev` - performs start with development mode
- `pnpm lint` - performs linting
- `pnpm test` - executes tests using [SWC]. Fast and dirty
- `pnpm start` - start project after build

[corepack]: https://nodejs.org/dist/latest-v16.x/docs/api/corepack.html
[install pnpm]: https://pnpm.io/installation
[SWC]: https://swc.rs/
