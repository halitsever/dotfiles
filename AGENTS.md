# AGENTS.md

Halit Sever's personal macOS shell setup: an Oh My Zsh `.zshrc`, symlinked into `~` by hand.

## Verify a change

- CI (`.github/workflows/ci.yml`) runs `zsh -n .zshrc` on push and PR to `main`. Run the same before pushing.
- shellcheck does not support zsh, so syntax check is the only automated gate. Source the file in a fresh shell (`zsh -i -c exit`) to catch runtime errors.
- Markdown uses Prettier with `printWidth: 180` from `.prettierrc`: `npx prettier --check Readme.md`.

## Gotchas

- `.zshrc` is macOS-only: `/opt/homebrew`, `~/Library/pnpm`, `~/Library/Android/sdk` and `/usr/libexec/java_home`. On Linux the `JAVA_HOME` line prints an error on every shell start.
- Optional tools (pyenv, gvm, neofetch) are guarded with `command -v` or `[ -s ... ]`. Guard any new tool the same way so fresh machines still start cleanly.
- `neofetch` runs at the end of `.zshrc` whenever it is installed, so `zsh -i -c exit` prints its banner.
- The pnpm block checks `$PATH` before prepending so `reload` does not duplicate entries. Follow that pattern for new PATH entries.
- There is no install script. The README documents the clone and `ln -sf` steps, so update it when files are added.
- `.vscode/settings.json` is an empty `{}`.
- `LICENSE` still has the `[fullname]` placeholder.

## Conventions

- Commit subjects in conventional-commit style, English, subject line only, no body or trailer.
- Work on a branch and open a PR. The owner merges.
- No emoji in new text. Comments in `.zshrc` are short, one line, and explain why.
- The README follows the owner's template. Every image from `halitsever-api.vercel.app` stays byte-for-byte, except the `title=` value of `api/repo-title` and the issue wrapper link.
