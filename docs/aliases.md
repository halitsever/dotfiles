---
title: Git and zsh aliases from a real .zshrc
description: Every git and zsh alias in this .zshrc with what it expands to, how they interact with the Oh My Zsh git plugin, and how to add aliases of your own.
---

# Git and zsh aliases

An alias is a short name that zsh replaces with a longer command before it runs. The `.zshrc` in this repository defines seven: three for the shell and four git aliases. The table is built from the file itself, so it always matches what is in the repository.

<AliasTable />

Each one is a single line in [the file](/#git-aliases):

```sh
alias gs="git status"
```

The name goes on the left of the `=`, the command on the right, with no spaces around the `=`. Quotes are needed whenever the command contains a space.

## How an alias expands

zsh only replaces the first word of a command. Everything you type after it is passed along unchanged, so arguments work without extra setup:

```sh
gp origin main      # git push origin main
gc "fix typo"       # git commit -m "fix typo"
```

`gc` ends in `-m` on purpose. The next thing you type becomes the commit message.

`ga` stages everything under the directory you are in, new files included. Run `gs` first if you are not sure what that covers.

## These aliases and the Oh My Zsh git plugin

The file enables one Oh My Zsh plugin, `git`, which brings a long list of git aliases of its own. Three names overlap. Because the aliases in `.zshrc` are defined after Oh My Zsh loads, the later definition wins.

| Name | git plugin | This .zshrc |
| --- | --- | --- |
| `ga` | `git add` | `git add .` |
| `gc` | `git commit --verbose` | `git commit -m` |
| `gp` | `git push` | `git push` |
| `gs` | not defined, the plugin uses `gst` | `git status` |

The rest of the plugin's aliases still work. `gst`, `gco` for `git checkout` and `gl` for `git pull` are all available alongside the four above.

One side effect to know about: `gs` is also the name of the Ghostscript program. With this alias in place, typing `gs` runs `git status`. If you have Ghostscript installed and need it, call it as `command gs` or put a backslash in front, `\gs`. Both skip alias lookup.

## See what an alias does

```sh
alias          # list every alias in the current shell
alias gc       # show one
type gs        # tells you whether a name is an alias, function or program
```

## Add your own zsh aliases

Open `~/.zshrc`, add a line, save, then reload:

```sh
alias gd="git diff"
alias ll="ls -lah"
```

```sh
source ~/.zshrc
```

Two things keep aliases from causing trouble. Put them after the `source $ZSH/oh-my-zsh.sh` line if you want them to override a plugin. And check that a name is free with `type name` before you take it.

Quoting matters when the command contains a variable. With double quotes the variable is expanded once, when the alias is defined. With single quotes it is expanded each time the alias runs.

An alias cannot place an argument in the middle of a command. When you need that, write a function instead:

```sh
# make a directory and move into it
mkcd() { mkdir -p "$1" && cd "$1"; }
```

To drop an alias for the current session, run `unalias name`. To remove it for good, delete its line from `.zshrc`.

## Git aliases without zsh

Git has its own alias system, stored in `~/.gitconfig`. Those work in any shell and are typed after `git`:

```sh
git config --global alias.st status
git st
```

Shell aliases save more typing because they drop the `git` prefix too. Git aliases travel with your git config to machines where you do not use zsh. Using both is common.

For where the config file lives and how to reload it, see [What is .zshrc](/what-is-zshrc).
