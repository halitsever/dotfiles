---
title: What is .zshrc and where is it on a Mac
description: What the .zshrc file is, where it lives on a Mac, how to open and edit it, and how to reload it so your changes apply without a new terminal.
---

# What is .zshrc and where is it on a Mac

`.zshrc` is the file zsh reads every time it starts an interactive shell. Each time you open a terminal window or tab, zsh runs the commands in that file from top to bottom before it shows you a prompt. That makes it the place for anything you want in every terminal session: `PATH` entries, aliases, the prompt theme, history settings and the setup lines that tools such as pyenv ask you to add.

zsh has been the default shell on macOS since Catalina (10.15), so on a current Mac this is the file that matters. The older `.bash_profile` is only read by bash.

The "rc" stands for "run commands", a naming habit that goes back to early Unix. The leading dot hides the file from a plain `ls` and from Finder.

## Where is the .zshrc file

It sits in your home folder: `~/.zshrc`, which expands to `/Users/your-name/.zshrc`.

A new Mac does not come with one. If the file is missing, nothing is wrong. Create an empty one and zsh will pick it up:

```sh
touch ~/.zshrc
```

To check whether it exists, list the hidden files in your home folder:

```sh
ls -a ~
```

In Finder, open your home folder and press <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> to show or hide dotfiles.

If the `ZDOTDIR` variable is set, zsh looks for `.zshrc` in that directory instead of your home folder. Most setups never set it.

## How to open the .zshrc file on a Mac

Pick whichever editor you are comfortable with.

```sh
# TextEdit, the editor that ships with macOS
open -e ~/.zshrc

# nano, inside the terminal
nano ~/.zshrc

# VS Code, if its "code" command is installed
code ~/.zshrc
```

In nano, <kbd>Ctrl</kbd> + <kbd>O</kbd> saves and <kbd>Ctrl</kbd> + <kbd>X</kbd> exits.

The [annotated .zshrc](/#shortcuts) on this site defines an alias for this, so the file is one word away:

```sh
alias zshconfig="nano ~/.zshrc"
```

## How to reload .zshrc

Saving the file changes nothing in terminals that are already open. They read it once, at startup. Either open a new tab or run the file again in the current shell:

```sh
source ~/.zshrc
```

The same file aliases that command to `reload`.

`source` runs every line again in the shell you already have. A line such as `export PATH="$HOME/.local/bin:$PATH"` will add the same directory a second time on each reload. It is harmless, but `PATH` gets longer. The [pnpm block](/#pnpm) shows how to guard against that with a `case` check.

For a clean start, replace the running shell with a fresh one:

```sh
exec zsh
```

## .zshrc, .zprofile and .zshenv

zsh can read several startup files. In order:

| File | Read by | Typical use |
| --- | --- | --- |
| `~/.zshenv` | every zsh, including scripts | variables that scripts need |
| `~/.zprofile` | login shells | things to do once per login |
| `~/.zshrc` | interactive shells | aliases, prompt, completion, history |
| `~/.zlogin` | login shells, after `.zshrc` | rarely used |

Terminal on macOS opens each window as a login shell, so both `.zprofile` and `.zshrc` run there. If you only want one file to think about, `.zshrc` is the one to keep. It is what Oh My Zsh edits when you install it.

## Check the file before you trust it

A syntax error in `.zshrc` shows up as an error message in every new terminal. zsh can parse the file without running it:

```sh
zsh -n ~/.zshrc
```

No output means the syntax is fine. The [dotfiles repository](https://github.com/halitsever/dotfiles) runs this same check in CI on every push and pull request.

To see what a complete file looks like, read the [annotated example](/). The [aliases page](/aliases) covers the shortcuts in it.
