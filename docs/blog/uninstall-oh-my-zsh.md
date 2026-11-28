---
title: "How to Uninstall Oh My Zsh Cleanly"
titleTemplate: false
description: "Uninstall Oh My Zsh with uninstall_oh_my_zsh: what the script deletes, how it restores .zshrc.pre-oh-my-zsh, symlinked dotfiles, and what to use instead."
headline: "Removing Oh My Zsh and getting your old .zshrc back"
date: "2026-11-28"
keyword: "uninstall oh my zsh"
faq: [{"q": "How do I uninstall Oh My Zsh?", "a": "Run uninstall_oh_my_zsh in a zsh session where Oh My Zsh is loaded. It asks for confirmation, deletes ~/.oh-my-zsh, renames your .zshrc and restores .zshrc.pre-oh-my-zsh if one exists."}, {"q": "Does uninstalling Oh My Zsh remove zsh?", "a": "No. zsh is the shell and stays installed. On macOS it is part of the system. Only the ~/.oh-my-zsh folder is removed."}, {"q": "What if uninstall_oh_my_zsh is not found?", "a": "Run the script directly: sh ~/.oh-my-zsh/tools/uninstall.sh. If that folder is already gone, delete the Oh My Zsh lines from .zshrc by hand."}]
---

# Removing Oh My Zsh and getting your old .zshrc back

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Oh My Zsh ships its own uninstaller. It is a short shell script, and knowing what it does first saves surprises, especially if your .zshrc is a symlink into a dotfiles repository like this one. This post reads through the script and then covers what to put in place of the framework.</p>

## Run the uninstaller

In a terminal where Oh My Zsh is loaded:

```sh
uninstall_oh_my_zsh
```

That is a function Oh My Zsh defines. All it does is run `$ZSH/tools/uninstall.sh`. If the function is missing because your `.zshrc` no longer loads Oh My Zsh, run the script directly:

```sh
sh ~/.oh-my-zsh/tools/uninstall.sh
```

## What the script does

Reading [tools/uninstall.sh](https://github.com/ohmyzsh/ohmyzsh/blob/master/tools/uninstall.sh), in order:

1. **Switches your login shell back** if the installer saved the old one in `~/.shell.pre-oh-my-zsh`, using `chsh`. On a Mac where zsh was already the default, there is usually nothing to switch.
2. **Asks for confirmation**: `Are you sure you want to remove Oh My Zsh? [y/N]`. Anything other than `y` cancels.
3. **Deletes `~/.oh-my-zsh`**, including everything in `custom/`: your own themes, plugins and any plugins you cloned there.
4. **Renames `~/.zshrc`** to `~/.zshrc.omz-uninstalled-<date and time>`. It is moved, not deleted.
5. **Restores `~/.zshrc.pre-oh-my-zsh`** to `~/.zshrc` if that file exists. The installer created it when it replaced your original `.zshrc`.

Then it reminds you to restart the terminal.

## Before you run it

- **Save `custom/`.** If you wrote your own theme or cloned plugins into `~/.oh-my-zsh/custom`, copy that folder somewhere first. Step 3 deletes it.
- **Know where your `.zshrc` really lives.** With this repository's install steps, `~/.zshrc` is a symlink to `~/dotfiles/.zshrc`. Step 4 renames the symlink, not the file it points to, so the repository copy is untouched. Your home folder simply no longer has a `.zshrc` link until you make one.
- **Know which backup you have.** The repository's README makes its own copy before linking (`cp ~/.zshrc ~/.zshrc.backup`). That is a different file from the installer's `.zshrc.pre-oh-my-zsh`. After uninstalling, compare them and keep the one you want:

```sh
ls -la ~/.zshrc*
```

## Keep the dotfiles, drop the framework

If you want to keep using this repository's `.zshrc` without Oh My Zsh, the file needs a small edit, because its first block loads the framework:

```sh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="agnoster"
plugins=(git)
source $ZSH/oh-my-zsh.sh
```

Remove those four lines. Everything below them is plain zsh: `PATH`, aliases, history and `compinit` all keep working. You lose the agnoster prompt and the git plugin's aliases (the four git aliases the file defines itself stay). The [zsh vs Oh My Zsh post](/blog/zsh-vs-oh-my-zsh) shows a `vcs_info` prompt that puts the branch name back with a few lines.

Then re-link and start a fresh shell:

```sh
ln -sf ~/dotfiles/.zshrc ~/.zshrc
exec zsh
```

## What to use instead

A common next question is what to use instead. Options, by how much they replace:

| Replace | With |
| --- | --- |
| Only the prompt | [Starship](https://starship.rs/), a cross-shell prompt: `brew install starship`, then `eval "$(starship init zsh)"` at the end of `.zshrc` |
| The prompt, with more control | Powerlevel10k loaded without Oh My Zsh, see [Powerlevel10k vs agnoster](/blog/powerlevel10k-vs-agnoster) for its support status |
| Plugins | Source [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) and [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) directly, installed with Homebrew |
| Nothing | zsh's own `compinit`, `vcs_info` and `promptinit` |

Starship and Oh My Zsh are not exclusive: Starship only draws the prompt, so some people keep Oh My Zsh for plugins and set `ZSH_THEME=""` with Starship on top.

## Installing it again later

The installer puts the current `.zshrc` aside as `.zshrc.pre-oh-my-zsh` and writes a fresh template, so reinstalling is safe. [Install Oh My Zsh on a Mac](/install-oh-my-zsh-mac/) has the steps, including how to keep your own file with `--keep-zshrc`.

## FAQ

### How do I uninstall Oh My Zsh?

Run uninstall_oh_my_zsh in a zsh session where Oh My Zsh is loaded. It asks for confirmation, deletes ~/.oh-my-zsh, renames your .zshrc and restores .zshrc.pre-oh-my-zsh if one exists.

### Does uninstalling Oh My Zsh remove zsh?

No. zsh is the shell and stays installed. On macOS it is part of the system. Only the ~/.oh-my-zsh folder is removed.

### What if uninstall_oh_my_zsh is not found?

Run the script directly: sh ~/.oh-my-zsh/tools/uninstall.sh. If that folder is already gone, delete the Oh My Zsh lines from .zshrc by hand.

## Related posts

- [Choosing and switching a zsh theme with Oh My Zsh](/blog/zsh-themes)
- [zsh is the shell, Oh My Zsh is a framework on top](/blog/zsh-vs-oh-my-zsh)
- [Powerlevel10k or agnoster: two powerline prompts compared](/blog/powerlevel10k-vs-agnoster)
- [All posts](/blog/)
