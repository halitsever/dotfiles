---
title: "Oh My Zsh Autocomplete: compinit, Menus and Fixes"
titleTemplate: false
description: "How Oh My Zsh autocomplete works: compinit and .zcompdump, case-insensitive matching, the insecure directories warning, and a duplicate compinit to remove."
headline: "How Tab completion works in Oh My Zsh, and why not to call compinit twice"
date: "2026-11-28"
keyword: "oh my zsh autocomplete"
faq: [{"q": "Do I need compinit in .zshrc with Oh My Zsh?", "a": "No. Oh My Zsh runs compinit while it loads. A second autoload and compinit after the source line repeats the work and writes a second dump file."}, {"q": "How do I make Oh My Zsh completion case-insensitive?", "a": "It already is by default. Set CASE_SENSITIVE=true before Oh My Zsh loads to turn that off, or HYPHEN_INSENSITIVE=true to also treat hyphens and underscores as the same."}, {"q": "How do I fix zsh compinit: insecure directories?", "a": "Run compaudit to list them, then remove group and other write permission, for example compaudit | xargs chmod g-w,o-w, as Oh My Zsh suggests."}]
---

# How Tab completion works in Oh My Zsh, and why not to call compinit twice

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Tab completion in zsh comes from one function, compinit, which loads the completion system and caches it in a file. Oh My Zsh calls it for you and sets a few defaults on top. This post explains what runs, how to change the behaviour, how to fix the insecure directories warning, and a duplicate call that this repository's own .zshrc still makes.</p>

## What compinit does

The [zsh completion system manual](https://zsh.sourceforge.io/Doc/Release/Completion-System.html) describes it: `compinit` is autoloaded, then called once. It defines helper functions, arranges for the completion functions on `fpath` to be autoloaded, and rebinds the completion widgets. To make the next start faster it writes a dump file, `.zcompdump` in your home folder unless you pass `-d` with another name, and reads that file next time.

So the order in any `.zshrc` is: put completion folders on `fpath`, then run `compinit` once.

## What Oh My Zsh does for you

In `oh-my-zsh.sh` (commit 44a5dec, 27 November 2026), Oh My Zsh:

1. adds its own `functions` and `completions` folders and every enabled plugin's folder to `fpath`,
2. runs `compinit -i -d "$ZSH_COMPDUMP"`, where the dump is named like `~/.zcompdump-<host>-<zsh version>`,
3. loads `lib/completion.zsh`, which turns on menu selection and case-insensitive matching.

This is why adding a plugin such as `docker` to `plugins=(...)` gives you its completions without any extra line: the plugin folder is on `fpath` before `compinit` runs.

## Change the behaviour

Set these before the `source $ZSH/oh-my-zsh.sh` line. They are listed in Oh My Zsh's default `.zshrc` template:

| Setting | Effect |
| --- | --- |
| `CASE_SENSITIVE="true"` | turn off the default case-insensitive matching |
| `HYPHEN_INSENSITIVE="true"` | treat `-` and `_` as the same when matching |
| `COMPLETION_WAITING_DOTS="true"` | show dots while a slow completion runs |

Menu selection, where Tab twice lets you move through the candidates with the arrow keys, comes from this line in `lib/completion.zsh`:

```sh
zstyle ':completion:*:*:*:*:*' menu select
```

Override it with your own `zstyle` after Oh My Zsh loads.

Completion is not the grey text that appears while you type. That is [zsh-autosuggestions](/blog/zsh-autosuggestions), a plugin that reads history. The two work side by side: Tab completes, the right arrow accepts a suggestion.

## The duplicate compinit in this repository

The last two lines of [this repository's .zshrc](/#completion):

```sh
autoload -Uz compinit
compinit
```

They run after `source $ZSH/oh-my-zsh.sh`, which has already called `compinit`. Running it again rebuilds the completion setup a second time and, because it has no `-d`, writes a second dump at `~/.zcompdump` next to Oh My Zsh's file. We loaded the file with Oh My Zsh in a Linux container on 28 November 2026 and both dumps appeared:

```text
.zcompdump
.zcompdump-d8788bc27d39-5.9
```

The second call also skips the `-i` flag, so it handles insecure folders differently from Oh My Zsh (next section). The fix is to delete those two lines when Oh My Zsh is in use. Keep them only in a setup without Oh My Zsh, where nothing else calls `compinit`.

## Insecure directories

For safety, `compinit` checks that completion files and folders are owned by you or root and are not writable by group or others. Without flags it asks whether to use insecure files. `-u` uses them without asking, `-i` silently ignores them. Oh My Zsh uses `-i` and then prints its own warning:

```text
[oh-my-zsh] Insecure completion-dependent directories detected:
```

It suggests this command, which removes the extra write permission from every folder `compaudit` lists:

```sh
compaudit | xargs chmod g-w,o-w
```

Run `compaudit` alone first to see what it would change. On a Mac the folders it lists are often Homebrew's `share/zsh` folders. Setting `ZSH_DISABLE_COMPFIX=true` before Oh My Zsh loads skips the check, which Oh My Zsh offers as a last resort.

## Completions stopped working

- **Stale dump.** The manual notes that compinit rebuilds the dump when the number of completion files changes, but not always when a function's first line changes. Delete the dump and start a new shell: `rm ~/.zcompdump*` then `exec zsh`.
- **Plugin listed but not found.** Oh My Zsh prints `[oh-my-zsh] plugin 'name' not found` at start. Check the spelling in `plugins=(...)`.
- **fpath changed after compinit.** A Homebrew completion folder added to `fpath` after Oh My Zsh loaded is not picked up. Add it before the `source` line.

After any of these edits, reload as described in [How to reload .zshrc](/blog/reload-zshrc). The [zsh vs Oh My Zsh post](/blog/zsh-vs-oh-my-zsh) covers what else the framework sets for you.

## FAQ

### Do I need compinit in .zshrc with Oh My Zsh?

No. Oh My Zsh runs compinit while it loads. A second autoload and compinit after the source line repeats the work and writes a second dump file.

### How do I make Oh My Zsh completion case-insensitive?

It already is by default. Set CASE_SENSITIVE=true before Oh My Zsh loads to turn that off, or HYPHEN_INSENSITIVE=true to also treat hyphens and underscores as the same.

### How do I fix zsh compinit: insecure directories?

Run compaudit to list them, then remove group and other write permission, for example compaudit | xargs chmod g-w,o-w, as Oh My Zsh suggests.

## Related posts

- [Grey history suggestions in zsh with zsh-autosuggestions](/blog/zsh-autosuggestions)
- [Zsh plugins: the git plugin and two common additions](/blog/zsh-plugins)
- [zsh is the shell, Oh My Zsh is a framework on top](/blog/zsh-vs-oh-my-zsh)
- [All posts](/blog/)
