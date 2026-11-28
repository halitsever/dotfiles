---
title: Install Oh My Zsh on a Mac in Five Steps
titleTemplate: false
description: Install Oh My Zsh on a Mac with the official one-line installer, set up the font agnoster needs, then add a ready .zshrc with a backup and a symlink.
---

# Set up Oh My Zsh on macOS, from install to a working prompt

<p class="lead">Five steps from a fresh Mac to an Oh My Zsh prompt you can use: check zsh, run the official installer, fix the font, optionally swap in this repository's .zshrc, and test it. Every command has a copy button. The install command is the one in the Oh My Zsh README, unchanged.</p>

## Before you start

You need three things, all of which a current Mac already has or can get in a minute:

- **zsh.** The default shell on macOS since Catalina (10.15). The [Oh My Zsh README](https://github.com/ohmyzsh/ohmyzsh) prefers zsh 5.0.8 or newer.
- **curl**, which ships with macOS.
- **git.** The README recommends 2.4.11 or newer. Running `git --version` on a new Mac offers to install Apple's Command Line Tools, which include it.

Check what you have:

```sh
echo $SHELL
zsh --version
git --version
```

If `echo $SHELL` prints `/bin/bash`, switch with `chsh -s /bin/zsh` and open a new terminal window.

## Step 1: run the installer

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

That is the command from the Oh My Zsh README. `wget` and `fetch` variants exist for systems without curl. The README also lists `https://install.ohmyz.sh/` as a mirror for networks that block `raw.githubusercontent.com`.

What the installer does, from reading `tools/install.sh`:

1. Clones Oh My Zsh into `~/.oh-my-zsh`.
2. If you already have a `~/.zshrc`, renames it to `~/.zshrc.pre-oh-my-zsh`.
3. Writes a new `~/.zshrc` from its template, with `ZSH_THEME="robbyrussell"` and `plugins=(git)`.
4. Offers to make zsh your login shell if it is not already.
5. Starts a new zsh with the result.

Options worth knowing, passed after an empty `""` argument:

```sh
# keep your current .zshrc instead of replacing it
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc

# no questions, no shell change, no new zsh at the end (for scripts)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
```

## Step 2: pick a theme and install its font

The template uses `robbyrussell`, which works with any font. If you want the `agnoster` theme this repository uses, it needs a font with Powerline symbols:

```sh
brew install --cask font-meslo-lg-nerd-font
```

Then choose the font in your terminal: Terminal → **Settings** → **Profiles** → **Text** → **Font**, or iTerm2 → **Settings** → **Profiles** → **Text**. Without it, agnoster's arrows show up as boxes. [Zsh themes: how to pick and switch one](/blog/zsh-themes) covers the other themes.

## Step 3 (optional): use this repository's .zshrc

The [annotated .zshrc](/) on this site adds Homebrew, pnpm, Android SDK and Java paths, optional pyenv, gvm and neofetch, git aliases and a 5000-entry shared history. The install steps from the [README](https://github.com/halitsever/dotfiles#install-the-zshrc-on-macos):

```sh
git clone https://github.com/halitsever/dotfiles.git ~/dotfiles
cp ~/.zshrc ~/.zshrc.backup
ln -sf ~/dotfiles/.zshrc ~/.zshrc
source ~/.zshrc
```

- `cp` saves the `.zshrc` the installer just wrote, so you can go back.
- `ln -sf` makes `~/.zshrc` a link to the file in the repository. A `git pull` in `~/dotfiles` updates your shell config.
- `source` applies it to the current terminal.

The paths assume an Apple Silicon Mac with Homebrew in `/opt/homebrew`. Read the [annotated file](/) before you link it and remove the blocks for tools you do not use.

## Step 4: check the file

```sh
zsh -n ~/.zshrc
zsh -i -c exit
```

The first command checks syntax without running anything; no output means it parses. The repository's CI runs the same check on every push. The second starts a full interactive shell once and prints any error a syntax check cannot see, such as a missing tool.

## Step 5: open a new terminal

Open a new window or run `exec zsh`. You should see the theme's prompt, and the git plugin's aliases such as `gst` and `gco` should work inside a git repository. If a command is suddenly missing, [Fix command not found after editing .zshrc](/blog/zshrc-command-not-found) goes through the usual causes.

## What you get

| Piece | From |
| --- | --- |
| Theme engine, `omz` command, auto-update every two weeks | Oh My Zsh |
| `git` plugin aliases (`gst`, `gco`, `gl`, `gp`) | Oh My Zsh |
| `agnoster` prompt with git branch | Oh My Zsh theme, set in this `.zshrc` |
| `PATH` for Homebrew, Cargo, pnpm, Android SDK, OpenJDK | this `.zshrc` |
| `gs`, `ga`, `gc`, `gp`, `reload`, `zshconfig`, `cls` | this `.zshrc`, see [aliases](/aliases) |
| Shared history, 5000 entries | this `.zshrc` |

## Questions

### Can I install Oh My Zsh with Homebrew?

Not as a formula. There is no `oh-my-zsh` formula in Homebrew; the README installs with curl, wget or fetch. Homebrew is still useful around it: `brew install zsh` gets a newer zsh than the one in macOS, and Homebrew has formulas for `zsh-autosuggestions`, `zsh-syntax-highlighting`, `powerlevel10k` and `starship`.

### Is it safe to pipe a script from the internet into sh?

It runs the script with your user's rights, so read it first if you want to know what it does: download `install.sh`, open it, then run `sh install.sh`. The steps above summarise what it does.

### How do I update Oh My Zsh?

It checks for updates every two weeks by default and asks. Run `omz update` to update now.

### How do I undo all of this?

Run `uninstall_oh_my_zsh`. It removes `~/.oh-my-zsh`, renames your `.zshrc` and restores `.zshrc.pre-oh-my-zsh`. [How to uninstall Oh My Zsh](/blog/uninstall-oh-my-zsh) explains what happens to a symlinked `.zshrc`.
