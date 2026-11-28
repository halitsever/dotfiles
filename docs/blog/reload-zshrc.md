---
title: "How to Reload .zshrc with source ~/.zshrc"
titleTemplate: false
description: "How to reload .zshrc after an edit: source ~/.zshrc, exec zsh or omz reload, what each one does to PATH and aliases, and a reload alias that does not pile up."
headline: "Reloading .zshrc: source, exec zsh and omz reload"
date: "2026-11-28"
keyword: "source zshrc"
faq: [{"q": "How do I reload .zshrc?", "a": "Run source ~/.zshrc to re-run the file in the current shell, or exec zsh to replace the shell with a fresh one that reads it from scratch."}, {"q": "What is the difference between source ~/.zshrc and exec zsh?", "a": "source runs the file again on top of the current state, so old aliases, functions and PATH entries stay. exec zsh starts a new shell process in the same window, so only what the startup files define is there."}, {"q": "Why is my PATH getting longer every time I reload?", "a": "Each source run executes the export PATH lines again and prepends the same folders. Guard them with a case check, or use typeset -U path, or reload with exec zsh."}]
---

# Reloading .zshrc: source, exec zsh and omz reload

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Editing .zshrc changes nothing in the terminals you already have open. Each shell read the file once, when it started. There are three common ways to apply the change without closing the window, and they behave differently in ways that matter once your file sets PATH.</p>

## Option 1: source ~/.zshrc

```sh
source ~/.zshrc
# or the short form
. ~/.zshrc
```

`source` reads the file and runs every line in the shell you are typing in. New aliases, functions and variables appear right away. This repository's [.zshrc](/#shortcuts) wraps it in an alias:

```sh
alias reload="source ~/.zshrc"
```

What `source` does not do is undo anything. An alias you deleted from the file is still defined in the running shell. A function you renamed exists under both names. And every line that adds to `PATH` adds again.

### The PATH problem

A typical line:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

Run it twice and `~/.local/bin` is in `PATH` twice. Run `reload` ten times and it is there ten times. Lookups still work, but `echo $PATH` becomes unreadable. This `.zshrc` guards its pnpm entry against exactly that:

```sh
export PNPM_HOME="$HOME/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
```

zsh also has a shorter fix. `path` is an array tied to `PATH`, and `typeset -U` keeps only the first copy of each entry:

```sh
typeset -U path PATH
```

Put it near the top of `.zshrc` and repeated `source` runs stop growing `PATH`.

## Option 2: exec zsh

```sh
exec zsh
```

`exec` replaces the current shell process with a new `zsh`. The new shell starts the normal way and reads `.zshrc` from the top, with nothing left over from the old one except exported environment variables. Deleted aliases are gone, renamed functions exist once, a theme change applies cleanly.

Two things to know:

- Exported variables, `PATH` included, are inherited by the new process. Entries added by the old shell are still there, then the file adds its own. For a completely clean `PATH`, open a new terminal tab.
- Anything not exported is lost: shell variables you set by hand, the directory stack, background jobs attached to that shell.

For theme and plugin changes, `exec zsh` is the better choice. Oh My Zsh sets up its prompt and completion once; re-sourcing on top of a loaded framework can leave parts of the old theme behind.

## Option 3: omz reload

Oh My Zsh has its own command for this:

```sh
omz reload
```

It deletes the completion cache file and then replaces the shell with a fresh one, the same as `exec zsh` (and as a login shell if the current one was a login shell). Use it after adding or removing plugins, when stale completions are likely.

## Which one when

| You changed | Use |
| --- | --- |
| An alias or a function you added | `source ~/.zshrc` |
| An alias or function you removed or renamed | `exec zsh` |
| `ZSH_THEME` or `plugins` | `exec zsh` or `omz reload` |
| `PATH` lines | a new terminal tab, or `exec zsh` if your entries are guarded |
| `.zprofile` or `.zshenv` | a new terminal tab (see [startup files](/blog/zshrc-vs-zprofile)) |

## When reload fails

If `source ~/.zshrc` prints an error with a line number, such as `/Users/you/.zshrc:12: command not found: ...`, the file has a problem at that line. Check the syntax without running anything:

```sh
zsh -n ~/.zshrc
```

No output means it parses. The repository runs the same `zsh -n` check in CI on every push. If the syntax is fine but a command is missing, [Fix command not found after editing .zshrc](/blog/zshrc-command-not-found) walks through PATH order.

## Where .zshrc lives

`~/.zshrc`, unless `ZDOTDIR` is set. If yours is a symlink into a dotfiles repository, as this one is, `source ~/.zshrc` reads the repository file through the link. The [what is .zshrc](/what-is-zshrc) page covers finding and opening it.

## FAQ

### How do I reload .zshrc?

Run source ~/.zshrc to re-run the file in the current shell, or exec zsh to replace the shell with a fresh one that reads it from scratch.

### What is the difference between source ~/.zshrc and exec zsh?

source runs the file again on top of the current state, so old aliases, functions and PATH entries stay. exec zsh starts a new shell process in the same window, so only what the startup files define is there.

### Why is my PATH getting longer every time I reload?

Each source run executes the export PATH lines again and prepends the same folders. Guard them with a case check, or use typeset -U path, or reload with exec zsh.

## Related posts

- [Choosing and switching a zsh theme with Oh My Zsh](/blog/zsh-themes)
- [zsh: command not found after a .zshrc change](/blog/zshrc-command-not-found)
- [Which zsh startup file to use: .zshrc, .zprofile or .zshenv](/blog/zshrc-vs-zprofile)
- [How zsh history works and how to tune it](/blog/zsh-history)
- [All posts](/blog/)
