---
title: "Zsh vs Oh My Zsh: What Is the Difference?"
titleTemplate: false
description: "Zsh vs Oh My Zsh explained: one is the shell, the other a framework of themes, plugins and defaults. See what a real .zshrc takes from each and what to drop."
headline: "zsh is the shell, Oh My Zsh is a framework on top"
date: "2026-11-28"
keyword: "zsh and oh my zsh"
faq: [{"q": "Is Oh My Zsh the same as zsh?", "a": "No. zsh is a shell, a program like bash. Oh My Zsh is an open source framework of zsh scripts that adds themes, plugins, aliases and default settings."}, {"q": "Do I need Oh My Zsh to use zsh?", "a": "No. zsh works on its own and has been the default shell on macOS since Catalina. Oh My Zsh is optional configuration on top."}, {"q": "Does Oh My Zsh slow down zsh?", "a": "It adds work at start-up, mostly from plugins and completion. How much depends on your plugins and machine; measure it with time zsh -i -c exit before and after."}]
---

# zsh is the shell, Oh My Zsh is a framework on top

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">People say they installed zsh when they mean Oh My Zsh, and the other way round. They are different things that ship together on most Macs. zsh is the program that runs your commands. Oh My Zsh is a collection of zsh scripts that sets it up for you. This post separates the two, line by line, in a real .zshrc.</p>

## Two layers

| | zsh | Oh My Zsh |
| --- | --- | --- |
| What it is | A shell, like bash or fish | A framework of zsh scripts |
| Comes with macOS | Yes, the default shell since Catalina (10.15) | No, installed with a curl one-liner |
| Lives in | `/bin/zsh` | `~/.oh-my-zsh` |
| Configured by | `~/.zshrc` and the other startup files | Variables in `~/.zshrc` such as `ZSH_THEME` and `plugins` |
| Gives you | The language, the prompt engine, completion, history | Themes, plugins, aliases and default options |

Every Oh My Zsh feature is built from zsh features. Oh My Zsh does not replace anything. It runs a lot of zsh code when your shell starts.

## Who does what in this .zshrc

The [.zshrc in this repository](/) is a good example because it uses both. The first block is Oh My Zsh:

```sh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="agnoster"
plugins=(git)
source $ZSH/oh-my-zsh.sh
```

- `ZSH` tells Oh My Zsh where it is installed.
- `ZSH_THEME` and `plugins` are Oh My Zsh settings. zsh itself does not know these names.
- `source $ZSH/oh-my-zsh.sh` runs the framework: it loads its `lib/` files, the git plugin and the agnoster theme, and starts completion.

Everything after that is plain zsh and would work without Oh My Zsh:

```sh
export PATH="/opt/homebrew/bin:$PATH"
alias reload="source ~/.zshrc"

HISTSIZE=5000
SAVEHIST=5000
HISTFILE=~/.zsh_history
setopt HIST_IGNORE_DUPS
setopt SHARE_HISTORY

autoload -Uz compinit
compinit
```

`export`, `alias`, `setopt` and `autoload` are zsh built-ins. The history variables are zsh's own.

## What Oh My Zsh sets for you

Reading Oh My Zsh's source shows a few defaults that matter here:

- **History.** Its `lib/history.zsh` raises `HISTSIZE` to 50000 and `SAVEHIST` to 10000 if they are lower, and turns on `share_history`, `hist_ignore_dups` and a few other options. This `.zshrc` sets both sizes back to 5000 afterwards, so its own values win.
- **Completion.** `oh-my-zsh.sh` already runs `compinit`. The last two lines of this `.zshrc` run it a second time. That is harmless but repeats work at every start; with Oh My Zsh loaded, they can go.
- **Aliases.** The `git` plugin defines dozens of aliases. This file defines `ga`, `gc` and `gp` after Oh My Zsh loads, so its own versions replace the plugin's. The [aliases page](/aliases) has the table.

## What zsh gives you without the framework

If you drop Oh My Zsh, these still work with a few lines each:

```sh
# completion
autoload -Uz compinit && compinit

# a prompt with the current folder and a git branch
autoload -Uz vcs_info
precmd() { vcs_info }
zstyle ':vcs_info:git:*' formats ' (%b)'
setopt PROMPT_SUBST
PROMPT='%~${vcs_info_msg_0_} %# '

# history
HISTSIZE=5000 SAVEHIST=5000 HISTFILE=~/.zsh_history
setopt SHARE_HISTORY HIST_IGNORE_DUPS
```

`vcs_info` and `compinit` ship with zsh. That covers what many people install Oh My Zsh for.

## When the framework is worth it

- You want a theme or plugin from its large catalog with one line of config.
- You like the git plugin's aliases and do not want to write your own.
- You set up new machines often and want the same defaults everywhere.

When it is not:

- Start-up time matters to you. Measure with `time zsh -i -c exit` with and without the `source` line.
- You only use the prompt. A prompt tool such as [Starship](https://starship.rs/) or a few lines of `vcs_info` do that alone.

## Moving between them

Installing Oh My Zsh renames your existing `.zshrc` to `.zshrc.pre-oh-my-zsh` and writes a template. Uninstalling it puts the old file back. [How to uninstall Oh My Zsh](/blog/uninstall-oh-my-zsh) covers that, and [Install Oh My Zsh on a Mac](/install-oh-my-zsh-mac/) covers the way in. The [plugins post](/blog/zsh-plugins) shows how to add more of the framework once you have it.

## FAQ

### Is Oh My Zsh the same as zsh?

No. zsh is a shell, a program like bash. Oh My Zsh is an open source framework of zsh scripts that adds themes, plugins, aliases and default settings.

### Do I need Oh My Zsh to use zsh?

No. zsh works on its own and has been the default shell on macOS since Catalina. Oh My Zsh is optional configuration on top.

### Does Oh My Zsh slow down zsh?

It adds work at start-up, mostly from plugins and completion. How much depends on your plugins and machine; measure it with time zsh -i -c exit before and after.

## Related posts

- [Choosing and switching a zsh theme with Oh My Zsh](/blog/zsh-themes)
- [Zsh plugins: the git plugin and two common additions](/blog/zsh-plugins)
- [Removing Oh My Zsh and getting your old .zshrc back](/blog/uninstall-oh-my-zsh)
- [How Tab completion works in Oh My Zsh, and why not to call compinit twice](/blog/oh-my-zsh-autocomplete)
- [All posts](/blog/)
