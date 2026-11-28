---
title: "Zsh Plugins Worth Installing (and the Git Plugin)"
titleTemplate: false
description: "Which zsh plugins to install and how: the Oh My Zsh git plugin and its aliases, zsh-autosuggestions and zsh-syntax-highlighting, and plugin load order."
headline: "Zsh plugins: the git plugin and two common additions"
date: "2026-11-28"
keyword: "zsh plugins"
faq: [{"q": "How do I add a plugin to Oh My Zsh?", "a": "Add its name to the plugins list in ~/.zshrc, separated by spaces, for example plugins=(git docker). Plugins that do not ship with Oh My Zsh must be cloned into ~/.oh-my-zsh/custom/plugins first. zsh-autosuggestions and zsh-syntax-highlighting ship with it since September 2026."}, {"q": "Why did my plugins stop working after I added commas?", "a": "The Oh My Zsh README says not to use commas between plugin names. The list is a zsh array, and commas become part of the names."}, {"q": "Where does zsh-syntax-highlighting go in the list?", "a": "Its documentation asks for it to be loaded last, after other plugins, so put it at the end of the plugins list."}]
---

# Zsh plugins: the git plugin and two common additions

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">This repository enables one plugin, git, and that is a fair place to start. This post shows what that plugin adds, how it interacts with your own aliases, and how to install the two outside plugins that most zsh setups add next.</p>

## How plugins are enabled

With Oh My Zsh, plugins are a zsh array in `~/.zshrc`, set before Oh My Zsh is sourced:

```sh
plugins=(git)

source $ZSH/oh-my-zsh.sh
```

More plugins go into the same parentheses, separated by spaces. The [Oh My Zsh README](https://github.com/ohmyzsh/ohmyzsh) is blunt about it: do not use commas between them, or it will break.

```sh
plugins=(git docker macos)
```

Bundled plugins live in `~/.oh-my-zsh/plugins/`. Each folder is one plugin, with a README. List them with:

```sh
ls ~/.oh-my-zsh/plugins
```

## The git plugin

`git` is enabled in the default template and in [this repository's .zshrc](/). It adds git aliases and a few helper functions. Some of the aliases, as defined in the [plugin source](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git):

| Alias | Runs |
| --- | --- |
| `g` | `git` |
| `gst` | `git status` |
| `ga` / `gaa` | `git add` / `git add --all` |
| `gc` | `git commit --verbose` |
| `gcmsg` | `git commit --message` |
| `gco` / `gcb` | `git checkout` / `git checkout -b` |
| `gsw` / `gswc` | `git switch` / `git switch --create` |
| `gd` | `git diff` |
| `gl` / `gp` | `git pull` / `git push` |
| `gpsup` | `git push --set-upstream origin` with the current branch |
| `glog` | `git log --oneline --decorate --graph` |

It also provides `git_current_branch`, a function themes and other aliases use.

### When your aliases and the plugin's collide

This `.zshrc` defines its own short git aliases after the `source` line:

```sh
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
```

In zsh the last definition wins, so `ga` and `gc` here replace the plugin's versions. `gc "fix typo"` commits with a message instead of opening an editor with the diff, which is what the plugin's `gc` does. Check what an alias currently means with `alias gc` or `type gc`. The [aliases page](/aliases) has the full comparison.

## zsh-autosuggestions

[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) shows a grey completion as you type, taken from your history. Press the right arrow key to accept it. Oh My Zsh has bundled it since [pull request 14088](https://github.com/ohmyzsh/ohmyzsh/pull/14088), merged on 10 September 2026, so on a current install `omz update` is the only step before adding it to the list. Installs older than that need a clone into the custom folder:

```sh
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

Either way, add it to the list:

```sh
plugins=(git zsh-autosuggestions)
```

Suggestions come from history, so the 5000-entry shared history this `.zshrc` keeps makes them useful from the first day on a machine. Accept keys, strategies and colours are in the [zsh-autosuggestions guide](/blog/zsh-autosuggestions).

## zsh-syntax-highlighting

[zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) colors the command line while you type: a command that exists turns green, a typo turns red before you press Enter. It arrived in Oh My Zsh in the same pull request. On older installs, clone it the same way:

```sh
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

Its documentation asks for it to be loaded after other plugins, so it goes last:

```sh
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

The red highlight is a cheap early warning for the "command not found" errors covered in [this post](/blog/zshrc-command-not-found).

## Without Oh My Zsh

Both plugins are plain zsh scripts. With Homebrew they install and load without any framework:

```sh
brew install zsh-autosuggestions zsh-syntax-highlighting
```

Homebrew prints the exact `source` lines to add to `.zshrc` after the install. Put the syntax highlighting line last.

## Keep the list short

Every plugin runs code when a shell starts. A few you never use make every new tab slower. Measure before and after:

```sh
time zsh -i -c exit
```

This repository loads one plugin and guards optional tools with `command -v` so a fresh machine starts cleanly. That is a reasonable default: add a plugin when you notice you need it, and remove it when you notice you do not. After editing the list, start a fresh shell with `exec zsh` as described in [How to reload .zshrc](/blog/reload-zshrc).

## FAQ

### How do I add a plugin to Oh My Zsh?

Add its name to the plugins list in ~/.zshrc, separated by spaces, for example plugins=(git docker). Plugins that do not ship with Oh My Zsh must be cloned into ~/.oh-my-zsh/custom/plugins first. zsh-autosuggestions and zsh-syntax-highlighting ship with it since September 2026.

### Why did my plugins stop working after I added commas?

The Oh My Zsh README says not to use commas between plugin names. The list is a zsh array, and commas become part of the names.

### Where does zsh-syntax-highlighting go in the list?

Its documentation asks for it to be loaded last, after other plugins, so put it at the end of the plugins list.

## Related posts

- [Choosing and switching a zsh theme with Oh My Zsh](/blog/zsh-themes)
- [zsh is the shell, Oh My Zsh is a framework on top](/blog/zsh-vs-oh-my-zsh)
- [zsh: command not found after a .zshrc change](/blog/zshrc-command-not-found)
- [Grey history suggestions in zsh with zsh-autosuggestions](/blog/zsh-autosuggestions)
- [All posts](/blog/)
