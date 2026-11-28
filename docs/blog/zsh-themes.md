---
title: "Zsh Themes: How to Pick and Switch One"
titleTemplate: false
description: "How zsh themes work with Oh My Zsh: set ZSH_THEME, try random themes, install the font agnoster needs on a Mac, and add a theme Oh My Zsh does not bundle."
headline: "Choosing and switching a zsh theme with Oh My Zsh"
date: "2026-11-28"
keyword: "zsh themes"
faq: [{"q": "How do I change my zsh theme?", "a": "Edit ~/.zshrc, set ZSH_THEME to the theme name before the line that sources oh-my-zsh.sh, save, and open a new terminal or run exec zsh."}, {"q": "Where are Oh My Zsh themes stored?", "a": "Bundled themes are in ~/.oh-my-zsh/themes as files ending in .zsh-theme. Themes you add yourself go in ~/.oh-my-zsh/custom/themes."}, {"q": "Why does my agnoster prompt show question marks or boxes?", "a": "agnoster draws Powerline arrow symbols. Your terminal font does not have them. Install a Powerline or Nerd Font and select it in the terminal settings."}]
---

# Choosing and switching a zsh theme with Oh My Zsh

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">A zsh theme is mostly a prompt: what shows to the left of your cursor, which colors, which symbols. Oh My Zsh bundles a long list of them and switches between them with one variable. This post covers how that variable works, how to try themes quickly, and why the theme in this repository needs a special font.</p>

## How Oh My Zsh picks a theme

With [Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh), the theme is one line near the top of `~/.zshrc`. In this repository's [.zshrc](https://github.com/halitsever/dotfiles/blob/main/.zshrc):

```sh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="agnoster"

plugins=(git)

source $ZSH/oh-my-zsh.sh
```

The order matters. The [themes wiki](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes) says to set `ZSH_THEME` before Oh My Zsh is sourced, because `oh-my-zsh.sh` reads the variable while it loads and then builds the prompt. Setting it after the `source` line does nothing until the next time the file is read from the top.

The value is a file name without its extension. Bundled themes live in `~/.oh-my-zsh/themes/`:

```sh
ls ~/.oh-my-zsh/themes | sed 's/\.zsh-theme$//' | column
```

The default is `robbyrussell`. An empty value, `ZSH_THEME=""`, turns theming off and leaves zsh's plain prompt.

## Try themes without editing the file

Two ways to look around before you commit to one:

```sh
# a different random theme in every new terminal
ZSH_THEME="random"

# only pick from a shortlist
ZSH_THEME="random"
ZSH_THEME_RANDOM_CANDIDATES=("robbyrussell" "agnoster" "bira" "clean")
```

With `random`, Oh My Zsh prints `[oh-my-zsh] Random theme '<name>' loaded` at start-up, so you can write the name down when you see one you like. You can also switch in the current shell only, without touching `.zshrc`:

```sh
omz theme list
omz theme set bira    # writes it to .zshrc
omz theme use bira    # this shell only
```

`omz theme use` is the quick way to compare a few in the same window.

## A few bundled themes

| Theme | What you see | Needs a special font |
| --- | --- | --- |
| `robbyrussell` | Arrow, folder name, git branch | No |
| `agnoster` | Colored segments for user, folder and git, joined by arrow symbols | Yes, Powerline or Nerd Font |
| `bira` | Two lines: user, host, folder, git, then the prompt | No |
| `clean` | One line, user and folder, git state on the right | No |

The wiki's screenshot page lists more than a hundred themes contributed over the years. It also says some are missing from that page, so `ls` on the themes folder is the full list for your install.

## Why agnoster needs a font

This repository uses `agnoster`. Its segments are joined by Powerline glyphs, characters that ordinary fonts do not contain. Without one of those fonts you see boxes or question marks where the arrows should be. On a Mac:

```sh
brew install --cask font-meslo-lg-nerd-font
```

Then pick the font in your terminal: in Terminal, **Settings** → **Profiles** → **Text** → **Font**; in iTerm2, **Settings** → **Profiles** → **Text**. VS Code's integrated terminal has its own `terminal.integrated.fontFamily` setting.

agnoster also prints `user@host` at the start of every prompt. Set `DEFAULT_USER` to your user name and it hides that segment on your own machine, while still showing it over SSH:

```sh
DEFAULT_USER="$USER"
```

## Themes Oh My Zsh does not bundle

External themes go into the custom folder, which Oh My Zsh checks before its own:

```sh
git clone https://github.com/<owner>/<theme>.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/<theme>"
```

Then set `ZSH_THEME="<theme>/<theme>"` (folder, slash, file name). Powerlevel10k installs this way; [Powerlevel10k vs agnoster](/blog/powerlevel10k-vs-agnoster) compares it with the theme used here.

## Apply the change

After editing `.zshrc`, open a new tab or run `exec zsh`. [How to reload .zshrc](/blog/reload-zshrc) explains why `exec zsh` is the cleaner choice after a theme change than `source ~/.zshrc`.

## Themes without Oh My Zsh

zsh has its own prompt system. `autoload -Uz promptinit && promptinit` followed by `prompt -l` lists the themes built into zsh itself, and `prompt <name>` switches to one. Oh My Zsh themes are a different, larger set. The [zsh vs Oh My Zsh](/blog/zsh-vs-oh-my-zsh) post explains where one ends and the other begins.

## FAQ

### How do I change my zsh theme?

Edit ~/.zshrc, set ZSH_THEME to the theme name before the line that sources oh-my-zsh.sh, save, and open a new terminal or run exec zsh.

### Where are Oh My Zsh themes stored?

Bundled themes are in ~/.oh-my-zsh/themes as files ending in .zsh-theme. Themes you add yourself go in ~/.oh-my-zsh/custom/themes.

### Why does my agnoster prompt show question marks or boxes?

agnoster draws Powerline arrow symbols. Your terminal font does not have them. Install a Powerline or Nerd Font and select it in the terminal settings.

## Related posts

- [zsh is the shell, Oh My Zsh is a framework on top](/blog/zsh-vs-oh-my-zsh)
- [Powerlevel10k or agnoster: two powerline prompts compared](/blog/powerlevel10k-vs-agnoster)
- [Reloading .zshrc: source, exec zsh and omz reload](/blog/reload-zshrc)
- [All posts](/blog/)
