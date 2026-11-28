---
title: "Zsh and Oh My Zsh Guides for macOS"
titleTemplate: false
description: "Zsh guides for macOS: themes, plugins, autosuggestions, history, completion, JAVA_HOME and adb PATH fixes, startup files and removing Oh My Zsh."
---

# Notes on zsh, Oh My Zsh and the .zshrc

<p class="lead">Short guides that start from one real file, the .zshrc in this repository, and from the documentation of zsh and Oh My Zsh. Each one answers a question that comes up when you set up or fix a shell on a Mac.</p>

## [Choosing and switching a zsh theme with Oh My Zsh](/blog/zsh-themes)

How zsh themes work with Oh My Zsh: set ZSH_THEME, try random themes, install the font agnoster needs on a Mac, and add a theme Oh My Zsh does not bundle.

## [zsh is the shell, Oh My Zsh is a framework on top](/blog/zsh-vs-oh-my-zsh)

Zsh vs Oh My Zsh explained: one is the shell, the other a framework of themes, plugins and defaults. See what a real .zshrc takes from each and what to drop.

## [Zsh plugins: the git plugin and two common additions](/blog/zsh-plugins)

Which zsh plugins to install and how: the Oh My Zsh git plugin and its aliases, zsh-autosuggestions and zsh-syntax-highlighting, and plugin load order.

## [Powerlevel10k or agnoster: two powerline prompts compared](/blog/powerlevel10k-vs-agnoster)

Powerlevel10k vs agnoster on Oh My Zsh: install steps, fonts, the p10k configure wizard, instant prompt, and the limited support notice in the p10k README.

## [Reloading .zshrc: source, exec zsh and omz reload](/blog/reload-zshrc)

How to reload .zshrc after an edit: source ~/.zshrc, exec zsh or omz reload, what each one does to PATH and aliases, and a reload alias that does not pile up.

## [zsh: command not found after a .zshrc change](/blog/zshrc-command-not-found)

Fix zsh command not found errors after editing .zshrc: read the error line, check PATH order for Homebrew and pnpm, rehash, and test the file with zsh -n.

## [Which zsh startup file to use: .zshrc, .zprofile or .zshenv](/blog/zshrc-vs-zprofile)

zshrc vs zprofile vs zshenv: the order zsh reads its startup files, login and interactive shells on macOS, where PATH belongs, and how bash files compare.

## [Removing Oh My Zsh and getting your old .zshrc back](/blog/uninstall-oh-my-zsh)

Uninstall Oh My Zsh with uninstall_oh_my_zsh: what the script deletes, how it restores .zshrc.pre-oh-my-zsh, symlinked dotfiles, and what to use instead.

## [Grey history suggestions in zsh with zsh-autosuggestions](/blog/zsh-autosuggestions)

Set up zsh-autosuggestions with Oh My Zsh, which now bundles it, or with Homebrew. Accept keys, strategies, colors and the plugin not found error.

## [Neofetch is archived: what to run in its place](/blog/neofetch-alternatives)

Neofetch is archived and Homebrew removed its formula in 2026. Compare fastfetch, hyfetch, macchina and screenfetch, and swap the startup line in .zshrc.

## [How zsh history works and how to tune it](/blog/zsh-history)

How zsh history works: HISTFILE, HISTSIZE and SAVEHIST, SHARE_HISTORY across tabs, searching and clearing history, and fixing a corrupt zsh_history file.

## [JAVA_HOME on macOS: java_home, Homebrew and the right path](/blog/set-java-home-mac)

Set JAVA_HOME on a Mac in zsh with /usr/libexec/java_home, pick a Java version, link Homebrew OpenJDK, and avoid the Intel path mistake in many .zshrc files.

## [adb is installed but zsh cannot find it: add platform-tools to PATH](/blog/zsh-command-not-found-adb)

Fix zsh: command not found: adb on macOS. Find platform-tools, set ANDROID_HOME and PATH in .zshrc, or install adb with Homebrew, then check with which adb.

## [How Tab completion works in Oh My Zsh, and why not to call compinit twice](/blog/oh-my-zsh-autocomplete)

How Oh My Zsh autocomplete works: compinit and .zcompdump, case-insensitive matching, the insecure directories warning, and a duplicate compinit to remove.
