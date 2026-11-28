---
title: ".zshrc vs .zprofile vs .zshenv on macOS"
titleTemplate: false
description: "zshrc vs zprofile vs zshenv: the order zsh reads its startup files, login and interactive shells on macOS, where PATH belongs, and how bash files compare."
headline: "Which zsh startup file to use: .zshrc, .zprofile or .zshenv"
date: "2026-11-28"
keyword: "zshrc vs zprofile"
faq: [{"q": "What is the difference between .zshrc and .zprofile?", "a": "zsh reads .zprofile for login shells and .zshrc for interactive shells. A login shell that is also interactive reads .zprofile first, then .zshrc."}, {"q": "Does macOS Terminal read .zprofile?", "a": "Yes. Terminal starts each new window or tab as a login shell, so it reads .zprofile and then .zshrc."}, {"q": "Where should I put PATH in zsh on a Mac?", "a": "Either works for interactive use. Put it in .zprofile if you want it set once per login, or in .zshrc if you want one file. Avoid .zshenv for PATH on macOS, because /etc/zprofile runs path_helper afterwards and reorders it."}]
---

# Which zsh startup file to use: .zshrc, .zprofile or .zshenv

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">zsh reads up to five startup files from your home folder, and which ones it reads depends on how the shell was started. Put a setting in the wrong one and it works in Terminal but not in your editor, or the other way round. This post lays out the order from the zsh manual and the reasons this repository keeps everything in .zshrc.</p>

## The order zsh reads them

From the [zsh manual](https://zsh.sourceforge.io/Doc/Release/Files.html), for a user whose `ZDOTDIR` is not set (so the files are in `$HOME`):

| Order | File | Read by |
| --- | --- | --- |
| 1 | `/etc/zshenv`, then `~/.zshenv` | Every zsh, including scripts |
| 2 | `/etc/zprofile`, then `~/.zprofile` | Login shells |
| 3 | `/etc/zshrc`, then `~/.zshrc` | Interactive shells |
| 4 | `/etc/zlogin`, then `~/.zlogin` | Login shells |
| 5 | `~/.zlogout`, then `/etc/zlogout` | Login shells, when they exit |

So an interactive login shell reads `.zshenv`, `.zprofile`, `.zshrc` and `.zlogin`, in that order. A script run with `zsh script.sh` reads only `.zshenv`.

## Login, interactive, both

- **Interactive**: you type commands into it. Any terminal window.
- **Login**: the first shell of a session. Started by `login`, by SSH, or with `zsh -l`.

On macOS, Terminal starts every new window and tab as a login shell. That is different from most Linux desktops, where a terminal tab is interactive but not a login shell and skips `.zprofile`. Other terminals and editors each make their own choice, which is why "works in Terminal, not in VS Code" problems usually trace back to `.zprofile`.

## What goes where

| File | Good for | Avoid |
| --- | --- | --- |
| `.zshenv` | Variables every zsh process needs, even scripts: `ZDOTDIR`, `EDITOR` | Anything that prints output or is slow, since it runs for every script |
| `.zprofile` | Things to do once per login: `PATH` additions, `brew shellenv` | Aliases and prompt settings, which non-login shells would miss |
| `.zshrc` | Aliases, functions, prompt, completion, key bindings, history, Oh My Zsh | Long-running commands; they slow down every new tab |
| `.zlogin` | Rarely needed; runs after `.zshrc` in login shells | |

## The macOS PATH catch

macOS ships an `/etc/zprofile` that runs `path_helper`, a tool that builds `PATH` from `/etc/paths` and `/etc/paths.d`. Because `/etc/zprofile` runs after `~/.zshenv`, any `PATH` you set in `.zshenv` gets reordered for login shells: the system folders move to the front. That is why the usual advice on a Mac is to set `PATH` in `.zprofile` or `.zshrc`, not `.zshenv`.

Homebrew follows that advice. Its installer finishes by suggesting a line for `~/.zprofile`:

```sh
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## Why this repository uses only .zshrc

The [.zshrc here](/) sets everything, `PATH` included, in one file:

```sh
export PATH="/opt/homebrew/bin:$PATH"
export PATH="$HOME/.cargo/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
```

Reasons it works:

- Terminal runs login shells, which read `.zshrc` as well, so nothing is missed.
- Editors that start interactive non-login shells also read `.zshrc`.
- One file is one symlink and one thing to back up. The install is `ln -sf ~/dotfiles/.zshrc ~/.zshrc` and nothing else.

The cost is that `PATH` lines run in every interactive shell, including nested ones, and can repeat. The pnpm block guards against that with a `case` check; [How to reload .zshrc](/blog/reload-zshrc) shows `typeset -U path` as a shorter guard. Scripts that need these folders will not see them, because scripts read only `.zshenv`. For a personal shell setup that is rarely a problem.

## Coming from bash

| bash | zsh equivalent |
| --- | --- |
| `.bash_profile` / `.profile` | `.zprofile` |
| `.bashrc` | `.zshrc` |
| `BASH_ENV` (scripts) | `.zshenv` |
| `.bash_logout` | `.zlogout` |

zsh does not read any bash file. Moving to zsh on a Mac means copying the parts you still want from `.bash_profile` into `.zprofile` or `.zshrc`. The [what is .zshrc](/what-is-zshrc) page covers the basics of the main file.

## Check which files ran

```sh
[[ -o login ]] && echo login || echo "not login"
[[ -o interactive ]] && echo interactive
```

Put a temporary `echo "zprofile ran"` at the top of a file to see whether a given terminal reads it, then remove it.

## FAQ

### What is the difference between .zshrc and .zprofile?

zsh reads .zprofile for login shells and .zshrc for interactive shells. A login shell that is also interactive reads .zprofile first, then .zshrc.

### Does macOS Terminal read .zprofile?

Yes. Terminal starts each new window or tab as a login shell, so it reads .zprofile and then .zshrc.

### Where should I put PATH in zsh on a Mac?

Either works for interactive use. Put it in .zprofile if you want it set once per login, or in .zshrc if you want one file. Avoid .zshenv for PATH on macOS, because /etc/zprofile runs path_helper afterwards and reorders it.

## Related posts

- [zsh is the shell, Oh My Zsh is a framework on top](/blog/zsh-vs-oh-my-zsh)
- [Reloading .zshrc: source, exec zsh and omz reload](/blog/reload-zshrc)
- [zsh: command not found after a .zshrc change](/blog/zshrc-command-not-found)
- [JAVA_HOME on macOS: java_home, Homebrew and the right path](/blog/set-java-home-mac)
- [All posts](/blog/)
