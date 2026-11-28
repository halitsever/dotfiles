---
title: "Zsh History: Size, Sharing, Search and Cleanup"
titleTemplate: false
description: "How zsh history works: HISTFILE, HISTSIZE and SAVEHIST, SHARE_HISTORY across tabs, searching and clearing history, and fixing a corrupt zsh_history file."
headline: "How zsh history works and how to tune it"
date: "2026-11-28"
keyword: "zsh history"
faq: [{"q": "Where is zsh history stored?", "a": "In the file named by HISTFILE. Oh My Zsh and most setups use ~/.zsh_history. If HISTFILE is unset or SAVEHIST is zero, zsh keeps history only in memory and loses it when the shell exits."}, {"q": "How do I clear zsh history?", "a": "With Oh My Zsh, history -c asks for confirmation and empties the file. Without it, empty ~/.zsh_history and start a new shell. Open tabs still hold their own copy in memory until they exit."}, {"q": "How do I fix zsh: corrupt history file?", "a": "Move the file aside, write its readable lines back with strings or tr -d to drop the null bytes, then load it with fc -R or open a new shell."}]
---

# How zsh history works and how to tune it

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">zsh keeps every command you type in memory and, if you let it, in a file. Three variables and a handful of options decide how much is kept, when it is written and whether open tabs see each other's commands. This post walks through them using the history block of this repository's .zshrc, plus what Oh My Zsh sets before it.</p>

## The three variables

From the [zsh parameters manual](https://zsh.sourceforge.io/Doc/Release/Parameters.html):

- `HISTFILE`: the file history is saved to and read from.
- `HISTSIZE`: how many events the shell keeps in memory.
- `SAVEHIST`: how many events are written to the file.

This repository's [history block](/#history):

```sh
HISTSIZE=5000
SAVEHIST=5000
HISTFILE=~/.zsh_history
setopt HIST_IGNORE_DUPS
setopt SHARE_HISTORY
```

Keep `HISTSIZE` at least as large as `SAVEHIST`. A shell cannot save more events than it holds.

## What Oh My Zsh already set

Oh My Zsh loads `lib/history.zsh` before any of these lines run. On the version checked here (commit 44a5dec, 27 November 2026) it:

- sets `HISTFILE` to `~/.zsh_history` when empty,
- raises `HISTSIZE` to 50000 and `SAVEHIST` to 10000 when they are lower,
- turns on `extended_history`, `hist_expire_dups_first`, `hist_ignore_dups`, `hist_ignore_space`, `hist_verify` and `share_history`.

Since the repository's lines come later, they win: the final sizes are 5000 and 5000, smaller than Oh My Zsh's defaults. We confirmed this by loading the file with Oh My Zsh in a container: `HISTSIZE=5000 SAVEHIST=5000`, and all six options still on. If you want the larger history, delete the two size lines or set bigger numbers.

## The options that matter

Descriptions condensed from the [zsh options manual](https://zsh.sourceforge.io/Doc/Release/Options.html):

| Option | Effect |
| --- | --- |
| `HIST_IGNORE_DUPS` | skip a command identical to the one just before it |
| `HIST_IGNORE_ALL_DUPS` | drop older copies of a command when it is entered again |
| `HIST_IGNORE_SPACE` | do not keep commands that start with a space |
| `HIST_EXPIRE_DUPS_FIRST` | when trimming, lose duplicates before unique commands |
| `EXTENDED_HISTORY` | save start time and duration with each command |
| `INC_APPEND_HISTORY` | write each command to the file as soon as it is entered |
| `SHARE_HISTORY` | write as you go and read new lines other shells wrote |

The manual calls `SHARE_HISTORY`, `INC_APPEND_HISTORY` and `INC_APPEND_HISTORY_TIME` mutually exclusive, so pick one. `SHARE_HISTORY` is the one that makes a command typed in one tab show up with the up arrow in another.

`HIST_IGNORE_SPACE` is handy for one-off commands with a token in them: type a space first and the line is not kept. The manual notes it lingers until the next command is entered.

## What the file looks like

With `EXTENDED_HISTORY` on, each line carries a timestamp and duration:

```text
: 1795866527:0;echo hello
```

The format is `: <start time>:<elapsed seconds>;<command>`, with the time in seconds since the epoch. That is why `cat ~/.zsh_history` looks noisy. Read it through the shell instead.

## Search it

- **Ctrl+R** searches backwards as you type. Press it again for the next older match.
- `history` lists events. With Oh My Zsh, `history` is an alias for its `omz_history` function, and `HIST_STAMPS="yyyy-mm-dd"` set before Oh My Zsh loads adds dates to the list.
- `fc -l 1 | grep docker` lists every kept event and filters it.
- The `history-substring-search` plugin bundled with Oh My Zsh lets the up arrow match text anywhere in a command.

## Clear it

With Oh My Zsh:

```sh
history -c
```

It asks `Are you sure? [y/N]`, empties `$HISTFILE` and reloads it. Without Oh My Zsh, empty the file and start a fresh shell:

```sh
: > ~/.zsh_history
exec zsh
```

Other open tabs still have their history in memory and can write it back when they exit, so close them first. To remove one sensitive line, edit the file with all other shells closed, then start a new one.

## Fix a corrupt history file

When the file contains bytes zsh cannot read, shells start with `zsh: corrupt history file /Users/you/.zsh_history`. We reproduced the message in a container by putting null bytes in the middle of a history file. This recovered it:

```sh
mv ~/.zsh_history ~/.zsh_history_bad
strings ~/.zsh_history_bad > ~/.zsh_history
fc -R ~/.zsh_history
```

`strings` keeps runs of readable characters four or more long, which drops very short lines too. `tr -d '\000' < ~/.zsh_history_bad > ~/.zsh_history` removes only the null bytes. Keep the `_bad` copy until the new file looks right, then delete it. On a Mac, `strings` comes with the Xcode command line tools.

## Apply changes

History settings are read when the shell starts. After editing them, open a new terminal or use `exec zsh`, as described in [How to reload .zshrc](/blog/reload-zshrc). Plugins such as [zsh-autosuggestions](/blog/zsh-autosuggestions) build their guesses from this history, so a larger one makes them more useful.

## FAQ

### Where is zsh history stored?

In the file named by HISTFILE. Oh My Zsh and most setups use ~/.zsh_history. If HISTFILE is unset or SAVEHIST is zero, zsh keeps history only in memory and loses it when the shell exits.

### How do I clear zsh history?

With Oh My Zsh, history -c asks for confirmation and empties the file. Without it, empty ~/.zsh_history and start a new shell. Open tabs still hold their own copy in memory until they exit.

### How do I fix zsh: corrupt history file?

Move the file aside, write its readable lines back with strings or tr -d to drop the null bytes, then load it with fc -R or open a new shell.

## Related posts

- [Grey history suggestions in zsh with zsh-autosuggestions](/blog/zsh-autosuggestions)
- [Reloading .zshrc: source, exec zsh and omz reload](/blog/reload-zshrc)
- [Which zsh startup file to use: .zshrc, .zprofile or .zshenv](/blog/zshrc-vs-zprofile)
- [All posts](/blog/)
