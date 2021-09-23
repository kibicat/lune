# 🐈🌑&#xA0;lune

## Formatting

Lune uses `deno fmt` to ensure a consistent coding style across the
codebase. The configuration used by this repository is stored in
`deno.json`, which must be passed to `deno fmt` using the `--config`
option.

You are welcome to create a separate configuration for local use (for
example, one which uses tabs instead of spaces). Just be sure to
reformat using `deno fmt --config deno.json` before you commit!

## Before You Commit

1. Add your name/alias to the copyright statement at the beginning of
   any files you edited.

2. Lint with `deno lint --config deno.json` and fix any errors.

3. Reformat with `deno fmt --config deno.json` to ensure consistent
   coding style.

4. Ensure tests pass with `deno test --config deno.json`.
