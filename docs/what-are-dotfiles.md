---
title: What are dotfiles and how to keep them in git
description: What dotfiles are, why developers keep them in a git repository, how this macOS dotfiles repo is laid out and how to start one of your own.
---

# What are dotfiles

Dotfiles are the configuration files in your home folder whose names start with a dot: `.zshrc`, `.gitconfig`, `.vimrc` and many more. On Unix systems, including macOS, a leading dot hides a file from normal directory listings. Programs took to storing their per-user settings that way, and the name stuck.

They are plain text. That is what makes them worth looking after. A shell that behaves the way you expect is the result of small edits made over years, and all of it lives in a handful of text files that are easy to lose with a laptop.

## Why people keep dotfiles in git

A new machine is quick to set up when the files are in a git repository. You clone it, link the files and open a terminal.

Every change also gets a history. When the shell starts misbehaving, `git log` and `git diff` show what changed and when.

Public dotfiles are how most developers learn what a config file can do, which is a good reason to publish yours. It also means anyone can read every line. Keep API tokens, passwords and private hostnames out of it. A common pattern is to put secrets in a separate file that is listed in `.gitignore` and sourced only when it exists.

## How this repository is laid out

[halitsever/dotfiles](https://github.com/halitsever/dotfiles) is about as small as a dotfiles repository gets. It manages one config file.

| Path | What it is |
| --- | --- |
| `.zshrc` | The zsh configuration. It is the only file that ends up in your home folder. |
| `Readme.md` | What the file sets up and how to install it. |
| `.github/workflows/ci.yml` | Runs `zsh -n .zshrc` on every push and pull request. |
| `AGENTS.md`, `llms.txt` | Notes for coding agents and language models that work on the repository. |
| `docs/` | This website. |
| `LICENSE` | MIT. |

There is no install script and no dotfile manager. The repository is cloned to `~/dotfiles` and the config is linked into place by hand:

```sh
ln -sf ~/dotfiles/.zshrc ~/.zshrc
```

The symlink is the important part. `~/.zshrc` is where zsh looks, but the real file stays inside the clone. Edit it in either place and `git status` in `~/dotfiles` sees the change. The [home page](/#use-it) has the full install steps, including the backup to make first.

The paths in the file assume macOS, with Homebrew in `/opt/homebrew` and SDKs under `~/Library`, so it needs edits before it works on Linux.

## Start your own dotfiles repository

You do not need a framework. Move one file, link it back, commit.

```sh
mkdir ~/dotfiles
mv ~/.zshrc ~/dotfiles/.zshrc
ln -s ~/dotfiles/.zshrc ~/.zshrc

cd ~/dotfiles
git init
git add .zshrc
git commit -m "add zshrc"
```

Open a new terminal to confirm the shell still starts the way it did. Then create an empty repository on GitHub and push to it. Read the file once more for secrets before you make it public.

Add more files the same way when you care about them. `.gitconfig` is the usual second one.

## Habits that keep dotfiles portable

Two patterns from the [annotated .zshrc](/) are worth copying into any setup.

**Guard optional tools.** The file only initialises pyenv when the command exists:

```sh
if command -v pyenv >/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi
```

A fresh machine without pyenv then starts cleanly, with no "command not found" at every prompt.

**Check the syntax automatically.** A broken `.zshrc` prints an error in every new terminal. `zsh -n .zshrc` parses the file without running it, and a short CI workflow can run that on every push. ShellCheck does not support zsh, so this parse is the automated check this repository relies on.

If you are new to the file itself, start with [What is .zshrc and where is it on a Mac](/what-is-zshrc).
