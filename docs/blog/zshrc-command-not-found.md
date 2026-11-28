---
title: "Fix Command Not Found After Editing .zshrc"
titleTemplate: false
description: "Fix zsh command not found errors after editing .zshrc: read the error line, check PATH order for Homebrew and pnpm, rehash, and test the file with zsh -n."
headline: "zsh: command not found after a .zshrc change"
date: "2026-11-28"
keyword: ".zshrc command not found"
faq: [{"q": "Why does zsh say command not found for brew?", "a": "The Homebrew folder is not in PATH. On Apple Silicon Macs Homebrew lives in /opt/homebrew/bin. Add it to PATH in .zprofile or .zshrc, or run the brew shellenv line Homebrew prints after install."}, {"q": "What does .zshrc:12: command not found mean?", "a": "zsh hit an unknown command while running line 12 of .zshrc itself. Open the file at that line: it is usually a typo, a tool that is not installed, or curly quotes pasted from a web page."}, {"q": "How do I check .zshrc for errors?", "a": "Run zsh -n ~/.zshrc to check syntax without running it. Run zsh -i -c exit to start a full interactive shell once and see any runtime errors."}]
---

# zsh: command not found after a .zshrc change

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">You edit .zshrc, open a new tab, and a command that worked an hour ago is gone. Or the new tab prints an error before the prompt even appears. Both come down to a short list of causes. This post goes through them in the order worth checking, with examples from this repository's file.</p>

## Two different errors

Read the message closely, because the two look alike:

```txt
zsh: command not found: brew
```

This comes from the prompt. You typed `brew` and zsh could not find it in any folder listed in `PATH`.

```txt
/Users/you/.zshrc:27: command not found: pyenv
```

This one names a file and a line. zsh was running `.zshrc` itself and line 27 called something that does not exist. Fix that line first; it often causes the first error too, because the rest of the file may not have run.

## 1. Find the line

For the second kind, open the file at the line number. Common causes:

- **A tool that is not installed.** Lines such as `eval "$(pyenv init -)"` fail on a machine without pyenv. Guard them, as this repository does:

```sh
if command -v pyenv >/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi
```

- **Curly quotes.** Copying from a web page can turn `"` into `“`. zsh then treats the quote as part of a command name.
- **Windows line endings.** A file saved with CRLF makes zsh look for commands with a trailing carriage return. `file ~/.zshrc` says "with CRLF line terminators" when that is the case.
- **A missing `then`, `fi` or quote.** `zsh -n ~/.zshrc` reports syntax errors without running anything. The repository's CI runs that exact check on every push.

## 2. Check PATH

For a command that should exist, see where zsh is looking:

```sh
print -l $path        # one folder per line
whence -a brew        # every place brew is found, in order
```

If the folder that holds the program is missing, the problem is the `export PATH=` lines. On macOS the usual folders are:

| Tool | Folder |
| --- | --- |
| Homebrew on Apple Silicon | `/opt/homebrew/bin` |
| Homebrew on Intel | `/usr/local/bin` |
| pnpm (default) | `~/Library/pnpm` |
| pipx and many installers | `~/.local/bin` |
| Rust's cargo | `~/.cargo/bin` |
| Android platform-tools | `~/Library/Android/sdk/platform-tools` |

This repository's [.zshrc](/) adds all of them. Note the order: each `export PATH="X:$PATH"` puts X in front, so the last line wins when two folders hold the same command name.

### A real example: JAVA_HOME

The file has:

```sh
export PATH="/usr/local/opt/openjdk/bin:$PATH"
export JAVA_HOME=$(/usr/libexec/java_home)
```

`/usr/local/opt` is where Homebrew put packages on Intel Macs. On Apple Silicon, Homebrew's OpenJDK is under `/opt/homebrew/opt/openjdk/bin`, so the first line adds a folder that does not exist. `java` may still work if another JDK is installed, which makes this kind of problem easy to miss. And `/usr/libexec/java_home` only finds JDKs registered under `/Library/Java/JavaVirtualMachines`, which Homebrew's openjdk is not until you create the symlink its install notes describe. When `java` goes missing, check both lines.

## 3. Refresh the command cache

zsh remembers where it found each command. If you install a program while a shell is open, or move it, that memory can be stale:

```sh
rehash
```

Then try the command again. New terminal tabs start with an empty cache.

## 4. Look at the alias

An alias can hide a command or point at something that no longer exists:

```sh
type gs
# gs is an alias for git status
```

`type` and `whence -v` tell you whether a name is an alias, a function, a built-in or a file, and which one zsh will run. This repository's `gs` alias, for example, shadows Ghostscript's `gs` program.

## 5. Check which file sets it

If a command works in Terminal but not in VS Code's terminal, or the other way round, the setting is probably in `.zprofile` rather than `.zshrc`. Login shells read both, other interactive shells read only `.zshrc`. Homebrew's installer suggests putting its `brew shellenv` line in `~/.zprofile`. The [startup files post](/blog/zshrc-vs-zprofile) has the full order.

## 6. Test the whole file once

```sh
zsh -n ~/.zshrc        # syntax only
zsh -i -c exit         # start a real interactive shell, print any errors, exit
```

The second command runs everything, including Oh My Zsh and any plugins, and shows errors a syntax check cannot catch. Then apply the fix in your open terminal with `exec zsh`; [How to reload .zshrc](/blog/reload-zshrc) explains why `source` can leave stale state behind.

## FAQ

### Why does zsh say command not found for brew?

The Homebrew folder is not in PATH. On Apple Silicon Macs Homebrew lives in /opt/homebrew/bin. Add it to PATH in .zprofile or .zshrc, or run the brew shellenv line Homebrew prints after install.

### What does .zshrc:12: command not found mean?

zsh hit an unknown command while running line 12 of .zshrc itself. Open the file at that line: it is usually a typo, a tool that is not installed, or curly quotes pasted from a web page.

### How do I check .zshrc for errors?

Run zsh -n ~/.zshrc to check syntax without running it. Run zsh -i -c exit to start a full interactive shell once and see any runtime errors.

## Related posts

- [Zsh plugins: the git plugin and two common additions](/blog/zsh-plugins)
- [Reloading .zshrc: source, exec zsh and omz reload](/blog/reload-zshrc)
- [Which zsh startup file to use: .zshrc, .zprofile or .zshenv](/blog/zshrc-vs-zprofile)
- [adb is installed but zsh cannot find it: add platform-tools to PATH](/blog/zsh-command-not-found-adb)
- [JAVA_HOME on macOS: java_home, Homebrew and the right path](/blog/set-java-home-mac)
- [All posts](/blog/)
