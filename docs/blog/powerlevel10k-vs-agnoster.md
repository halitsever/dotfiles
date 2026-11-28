---
title: "Powerlevel10k vs Agnoster for Oh My Zsh"
titleTemplate: false
description: "Powerlevel10k vs agnoster on Oh My Zsh: install steps, fonts, the p10k configure wizard, instant prompt, and the limited support notice in the p10k README."
headline: "Powerlevel10k or agnoster: two powerline prompts compared"
date: "2026-11-28"
keyword: "oh my zsh powerlevel10k"
faq: [{"q": "How do I install Powerlevel10k with Oh My Zsh?", "a": "Clone romkatv/powerlevel10k into ~/.oh-my-zsh/custom/themes/powerlevel10k, set ZSH_THEME to powerlevel10k/powerlevel10k in ~/.zshrc, and open a new terminal. The configuration wizard starts on first launch."}, {"q": "Is Powerlevel10k still maintained?", "a": "Its README states that the project has very limited support, that no new features are in the works and that most bugs will go unfixed. It still installs and runs."}, {"q": "Do I need a special font for Powerlevel10k?", "a": "It works without one but uses extra glyphs when available. The README recommends the Meslo Nerd Font patched for Powerlevel10k."}]
---

# Powerlevel10k or agnoster: two powerline prompts compared

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Both themes draw the same kind of prompt: colored segments joined by arrow symbols. agnoster ships with Oh My Zsh and is the theme in this repository. Powerlevel10k is a separate project with a setup wizard and many more options. Here is how they differ, with the Powerlevel10k facts taken from its own README.</p>

## At a glance

| | agnoster | Powerlevel10k |
| --- | --- | --- |
| Ships with Oh My Zsh | Yes | No, cloned separately |
| Setup | One line in `.zshrc` | A wizard, `p10k configure`, writes `~/.p10k.zsh` |
| Font | Needs a Powerline or Nerd Font | Works without; recommends Meslo Nerd Font |
| Options | A handful of variables | Hundreds of `POWERLEVEL9K_*` settings |
| Start-up trick | None | Instant prompt |
| Status | Part of Oh My Zsh | README says "very limited support" |

## agnoster, as used here

This repository's [.zshrc](/) sets:

```sh
ZSH_THEME="agnoster"
```

That is the whole setup. agnoster shows a `user@host` segment, the current folder, and the git branch with a marker when the tree is dirty. The `user@host` part disappears on your own machine if you set `DEFAULT_USER="$USER"`. Its arrow separators are Powerline glyphs, so the terminal needs a Powerline or Nerd Font; the [zsh themes post](/blog/zsh-themes#why-agnoster-needs-a-font) has the font steps for a Mac.

Reasons to stay on it: nothing to install beyond Oh My Zsh, nothing to configure, and it is maintained as part of the framework.

## Powerlevel10k

[Powerlevel10k](https://github.com/romkatv/powerlevel10k) installs into Oh My Zsh's custom themes folder:

```sh
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
```

Then in `~/.zshrc`:

```sh
ZSH_THEME="powerlevel10k/powerlevel10k"
```

Open a new terminal and the configuration wizard starts. It asks what your font can display and which style you want, then writes `~/.p10k.zsh` and a line to load it. Run `p10k configure` to start the wizard again later.

Two features stand out in its README:

- **Instant prompt.** The prompt appears right away while plugins are still loading. The wizard offers to turn it on and adds a snippet to the top of `.zshrc`. The README notes it can hide start-up lag even when the theme is not the cause.
- **Font handling.** It does not require custom fonts, but it can use extra glyphs. The recommended font is Meslo Nerd Font patched for Powerlevel10k, which the wizard can install in some terminals.

## The support notice

The top of the Powerlevel10k README now carries a notice: the project has very limited support, help requests will be ignored, no new features are in the works and most bugs will go unfixed. It still works, and many people use it, but you are adopting a finished project rather than an active one. agnoster gets whatever maintenance Oh My Zsh gives its bundled themes.

## Why this repository stays on agnoster

The `.zshrc` here keeps to things that are either part of macOS, part of Oh My Zsh or guarded so a missing tool does not break start-up. agnoster fits that: no clone step, no generated config file, nothing that has to exist before the shell starts. The trade-off is fewer options and no instant prompt.

## Switching back and forth

Both are one `ZSH_THEME` line, so trying Powerlevel10k is cheap:

1. Clone it as above.
2. Change `ZSH_THEME`, run `exec zsh`, go through the wizard.
3. To go back, restore `ZSH_THEME="agnoster"` and remove the lines the wizard added at the top and bottom of `.zshrc` (the instant prompt block and the `source ~/.p10k.zsh` line).

If your `.zshrc` is a symlink into a dotfiles repository, as in this one, the wizard edits the file in the repository. Check `git diff` before you commit, so the instant prompt block only lands there if you want it on every machine. [How to reload .zshrc](/blog/reload-zshrc) explains why `exec zsh` is the right way to apply a theme change.

## Other options

- [Starship](https://starship.rs/) is a prompt written in Rust that works across shells. It replaces the theme, not Oh My Zsh's plugins.
- Plenty of bundled themes avoid Powerline glyphs entirely, such as `robbyrussell` and `bira`. See [Zsh themes](/blog/zsh-themes).

## FAQ

### How do I install Powerlevel10k with Oh My Zsh?

Clone romkatv/powerlevel10k into ~/.oh-my-zsh/custom/themes/powerlevel10k, set ZSH_THEME to powerlevel10k/powerlevel10k in ~/.zshrc, and open a new terminal. The configuration wizard starts on first launch.

### Is Powerlevel10k still maintained?

Its README states that the project has very limited support, that no new features are in the works and that most bugs will go unfixed. It still installs and runs.

### Do I need a special font for Powerlevel10k?

It works without one but uses extra glyphs when available. The README recommends the Meslo Nerd Font patched for Powerlevel10k.

## Related posts

- [Choosing and switching a zsh theme with Oh My Zsh](/blog/zsh-themes)
- [Zsh plugins: the git plugin and two common additions](/blog/zsh-plugins)
- [Reloading .zshrc: source, exec zsh and omz reload](/blog/reload-zshrc)
- [All posts](/blog/)
