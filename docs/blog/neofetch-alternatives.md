---
title: "Neofetch Alternatives: Fastfetch and Others"
titleTemplate: false
description: "Neofetch is archived and Homebrew removed its formula in 2026. Compare fastfetch, hyfetch, macchina and screenfetch, and swap the startup line in .zshrc."
headline: "Neofetch is archived: what to run in its place"
date: "2026-11-28"
keyword: "neofetch alternative"
faq: [{"q": "Is neofetch discontinued?", "a": "The neofetch repository on GitHub is archived, so it takes no new commits or issues. Its last release is 7.1.0 from 2 August 2020. Homebrew removed the neofetch formula on 6 May 2026."}, {"q": "What is the best neofetch alternative?", "a": "Fastfetch is the closest match. Its README calls it a neofetch-like tool written mainly in C, it is MIT licensed, actively released, and it ships a neofetch preset. hyfetch, macchina and screenfetch are other options in Homebrew."}, {"q": "How do I make fastfetch look like neofetch?", "a": "Run fastfetch -c neofetch.jsonc. The preset ships with fastfetch, and the same flag works in .zshrc."}]
---

# Neofetch is archived: what to run in its place

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">This repository's .zshrc runs neofetch every time a terminal opens, if neofetch is installed. On a new Mac in late 2026 it usually is not, because neofetch has stopped moving: the GitHub repository is archived and Homebrew has dropped it. Here is what changed and what the common replacements are.</p>

## What happened to neofetch

Three facts, checked on 28 November 2026:

- The [neofetch repository](https://github.com/dylanaraps/neofetch) is archived on GitHub. Its last release is 7.1.0, published on 2 August 2020.
- Homebrew removed the formula. The commit in homebrew-core is titled "neofetch: remove formula" and is dated 6 May 2026. `formulae.brew.sh/formula/neofetch` now answers 404, so `brew install neofetch` no longer works from the main tap.
- Copies installed earlier keep working until something breaks them. Nothing updates them.

## What the .zshrc does with it

The block at the [neofetch line](/#neofetch) of the annotated file:

```sh
# neofetch on startup if available
if command -v neofetch >/dev/null 2>&1; then
  neofetch
fi
```

`command -v` fails quietly when the program is missing, so a Mac without neofetch starts the shell with no error and no banner. The guard is what makes the switch painless: change the name, and machines without the new tool behave the same way.

## The alternatives

All four are in Homebrew today. The descriptions are Homebrew's own:

| Tool | Homebrew description | License | Version in Homebrew |
| --- | --- | --- | --- |
| [fastfetch](https://github.com/fastfetch-cli/fastfetch) | Like neofetch, but much faster because written mostly in C | MIT | 2.71.0 |
| hyfetch | Fast, highly customisable system info script with LGBTQ+ pride flags | MIT | 2.1.1 |
| macchina | System information fetcher, with an emphasis on performance and minimalism | MIT | 6.4.0 |
| screenfetch | Generate ASCII art with terminal, shell, and OS info | GPL-3.0-or-later | 3.9.9 |

`onefetch` shows up in the same searches, but it summarises a git repository, not the machine.

## Fastfetch vs neofetch

Fastfetch is the usual pick because it was built as a replacement. Its README gives these reasons, in its own words: it is actively maintained, faster, has more features (with few modules on by default), is more configurable, more polished in units such as `22.97 GiB` instead of `23 G`, and more accurate, with Wayland as the example neofetch never supported. The project's latest GitHub release on 28 November 2026 was 2.72.0, one ahead of Homebrew.

Two differences matter when you switch:

- **Configuration.** Neofetch used a shell script config. Fastfetch uses JSONC (JSON with comments) at `~/.config/fastfetch/config.jsonc`, and it does not write one until you ask: `fastfetch --gen-config`.
- **Presets.** Fastfetch ships ready-made layouts, loaded with `-c`. One of them copies neofetch's layout:

```sh
fastfetch -c neofetch.jsonc
```

We ran that preset with fastfetch from Alpine Linux's package repository in a container: it printed the familiar logo-and-details layout. `fastfetch -c all.jsonc` shows every module, which is the quickest way to see what to keep.

## Swapping the startup line

```sh
brew install fastfetch
```

Then change the block in `~/.zshrc`:

```sh
# system summary on startup if available
if command -v fastfetch >/dev/null 2>&1; then
  fastfetch
fi
```

Reload with `exec zsh` (see [How to reload .zshrc](/blog/reload-zshrc)). Keep the guard. The file is shared between machines, and a Mac without fastfetch should still open a clean prompt.

## Or drop the banner

The banner runs on every new tab and split. The repository's AGENTS.md notes another side effect: neofetch runs during `.zshrc` load, before history and completion are set up, so `zsh -i -c exit` prints the banner too. If you script against an interactive shell or measure startup time with `time zsh -i -c exit`, the banner is noise. Many people keep fastfetch as a command they run by hand and leave it out of `.zshrc` altogether.

## Where to put it if you keep it

Anything that prints text belongs in an interactive startup file, so `.zshrc` is right and `.zshenv` is wrong: `.zshenv` runs for scripts too. The [startup files post](/blog/zshrc-vs-zprofile) has the full order.

## FAQ

### Is neofetch discontinued?

The neofetch repository on GitHub is archived, so it takes no new commits or issues. Its last release is 7.1.0 from 2 August 2020. Homebrew removed the neofetch formula on 6 May 2026.

### What is the best neofetch alternative?

Fastfetch is the closest match. Its README calls it a neofetch-like tool written mainly in C, it is MIT licensed, actively released, and it ships a neofetch preset. hyfetch, macchina and screenfetch are other options in Homebrew.

### How do I make fastfetch look like neofetch?

Run fastfetch -c neofetch.jsonc. The preset ships with fastfetch, and the same flag works in .zshrc.

## Related posts

- [How zsh history works and how to tune it](/blog/zsh-history)
- [Reloading .zshrc: source, exec zsh and omz reload](/blog/reload-zshrc)
- [zsh is the shell, Oh My Zsh is a framework on top](/blog/zsh-vs-oh-my-zsh)
- [All posts](/blog/)
