# Testing

## Run tests

```bash
npm test
```

## What is covered

- Board creation/cloning and basic move application.
- Move parsing and status evaluation.
- Legal move generation basics for each piece type.
- Check detection and filtering out illegal self-check moves.
- AI move selection returns a legal move when available.

## Adding tests

- Add files under `test/` using Node's test runner:
  - `const test = require('node:test');`
  - `const assert = require('node:assert/strict');`
