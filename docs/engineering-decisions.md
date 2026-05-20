# Engineering Decisions

## 001 - Node.js baseline

Decision:

- Use Node.js 24 LTS as the project baseline.
- Set `package.json` engines to `>=24`.
- Provide `.nvmrc` as `24`.

Rationale:

- Node 24 is the conservative LTS baseline for production stability in 2026.
- Node 26 is Current and is expected to enter LTS in October 2026.

Sources:

- https://nodejs.org/en/about/previous-releases

## 002 - Modules (CommonJS vs ESM)

Decision:

- Keep the codebase in CommonJS in this wave.

Rationale:

- The current repo already uses `require` and `module.exports` consistently.
- Avoid a noisy migration while focusing on tests, scripts, and consistency.

## 003 - Test runner

Decision:

- Use Node's built-in test runner (`node --test` / `node:test`).

Rationale:

- Avoids adding Jest/Vitest for a small project.

Sources:

- https://nodejs.org/api/test.html

## 004 - Lint and formatting

Decision:

- Use ESLint with flat config (`eslint.config.js`).
- Use Prettier installed locally with repo config.

Sources:

- https://eslint.org/docs/latest/use/configure/configuration-files-new
- https://prettier.io/docs/en/install

## 005 - Browser auto-open

Decision:

- Do not auto-open a browser from the server.

Rationale:

- The previous `open` invocation is macOS-specific and can fail on other OSes.
- Printing the URL is predictable and cross-platform.

## 006 - Queen and en passant support

Decision:

- Remove unused code paths related to queens and en passant.

Rationale:

- Rules and initial position have no queens.
- The engine does not generate en passant moves.
