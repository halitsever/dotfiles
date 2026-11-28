---
title: "How to Set JAVA_HOME on a Mac in zsh"
titleTemplate: false
description: "Set JAVA_HOME on a Mac in zsh with /usr/libexec/java_home, pick a Java version, link Homebrew OpenJDK, and avoid the Intel path mistake in many .zshrc files."
headline: "JAVA_HOME on macOS: java_home, Homebrew and the right path"
date: "2026-11-28"
keyword: "set java_home"
faq: [{"q": "How do I set JAVA_HOME on a Mac?", "a": "Add export JAVA_HOME=$(/usr/libexec/java_home) to ~/.zshrc and open a new terminal. Add -v 21 or another version to pin a specific JDK."}, {"q": "Why does /usr/libexec/java_home say unable to locate a Java runtime?", "a": "It only finds JDKs registered in /Library/Java/JavaVirtualMachines. Homebrew's openjdk formula is not linked there; run the symlink command Homebrew prints after installing it."}, {"q": "What is the Homebrew OpenJDK path on Apple Silicon?", "a": "/opt/homebrew/opt/openjdk. On Intel Macs Homebrew uses /usr/local, so the path is /usr/local/opt/openjdk."}]
---

# JAVA_HOME on macOS: java_home, Homebrew and the right path

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Gradle, Maven, Android Studio's command line tools and many other programs read JAVA_HOME to find Java. On a Mac the clean way to set it is one line that asks macOS where the JDK is. This post shows that line, how it interacts with Homebrew's OpenJDK, and a mistake this repository's own .zshrc makes.</p>

## The one-line version

```sh
export JAVA_HOME=$(/usr/libexec/java_home)
```

`/usr/libexec/java_home` is a macOS tool that prints the home folder of an installed JDK. Put the line in `~/.zshrc`, open a new terminal, and check:

```sh
echo $JAVA_HOME
java -version
```

To pin a version when several JDKs are installed, pass `-v`:

```sh
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
/usr/libexec/java_home -V   # lists every JDK it can find
```

## What java_home can see

The tool looks at JDKs registered with the system, which live in `/Library/Java/JavaVirtualMachines`. Installers from Oracle, Adoptium and similar vendors put their JDK there. If nothing is there, it prints an error instead of a path, and `JAVA_HOME` ends up wrong or empty.

## Homebrew's OpenJDK is not registered by default

The Homebrew `openjdk` formula (27.0.1.1 on 28 November 2026) is keg-only. Homebrew's reason is that macOS already provides similar software, here the `/usr/bin/java` launcher. Keg-only means Homebrew does not link it into `/opt/homebrew/bin`, and it does not register it with macOS either. The formula's caveat says how:

```sh
sudo ln -sfn $HOMEBREW_PREFIX/opt/openjdk/libexec/openjdk.jdk \
  /Library/Java/JavaVirtualMachines/openjdk.jdk
```

After that, `/usr/libexec/java_home` finds it and the one-line version works. Versioned formulas such as `openjdk@21` print the same caveat with their own path.

## Or skip java_home and point at Homebrew directly

If you would rather not use `sudo`, set both variables from Homebrew's own path:

```sh
export JAVA_HOME="$(brew --prefix openjdk)/libexec/openjdk.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
```

`brew --prefix openjdk` prints `/opt/homebrew/opt/openjdk` on Apple Silicon and `/usr/local/opt/openjdk` on Intel, so the same line works on both. It calls `brew` once per shell start, which costs a little time; hard-code the path if that matters to you.

## The mistake in this repository's .zshrc

The [Java block](/#java) of the annotated file reads:

```sh
# java from brew openjdk
export PATH="/usr/local/opt/openjdk/bin:$PATH"
export JAVA_HOME=$(/usr/libexec/java_home)
```

Two problems, both still in the file on 28 November 2026:

1. `/usr/local/opt/openjdk` is the Intel Homebrew prefix. The rest of the file assumes Apple Silicon (`/opt/homebrew/bin`), where that folder does not exist, so the `PATH` entry does nothing.
2. `java_home` only finds the Homebrew JDK after the `sudo ln` step above. Without it, the line prints an error at every shell start.

A fixed version for Apple Silicon:

```sh
# java from brew openjdk (keg-only, so add it by hand)
export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home"
```

We could not run these lines on a Mac for this post. The paths come from Homebrew's formula and its documented prefixes. Check them with `ls` before relying on them.

## Linux and shared dotfiles

`/usr/libexec/java_home` exists only on macOS. When we loaded this `.zshrc` in a Linux container, zsh printed `no such file or directory: /usr/libexec/java_home` before the prompt. If you share one file between a Mac and Linux, guard the line:

```sh
[ -x /usr/libexec/java_home ] && export JAVA_HOME=$(/usr/libexec/java_home)
```

## Which file

Programs started from Finder or the Dock do not read `.zshrc`, only shells do. That is fine for builds you start in a terminal. For the order zsh reads its files, see [.zshrc vs .zprofile](/blog/zshrc-vs-zprofile). If `java` itself is not found, the steps in [command not found after a .zshrc change](/blog/zshrc-command-not-found) apply.

## FAQ

### How do I set JAVA_HOME on a Mac?

Add export JAVA_HOME=$(/usr/libexec/java_home) to ~/.zshrc and open a new terminal. Add -v 21 or another version to pin a specific JDK.

### Why does /usr/libexec/java_home say unable to locate a Java runtime?

It only finds JDKs registered in /Library/Java/JavaVirtualMachines. Homebrew's openjdk formula is not linked there; run the symlink command Homebrew prints after installing it.

### What is the Homebrew OpenJDK path on Apple Silicon?

/opt/homebrew/opt/openjdk. On Intel Macs Homebrew uses /usr/local, so the path is /usr/local/opt/openjdk.

## Related posts

- [zsh: command not found after a .zshrc change](/blog/zshrc-command-not-found)
- [adb is installed but zsh cannot find it: add platform-tools to PATH](/blog/zsh-command-not-found-adb)
- [Which zsh startup file to use: .zshrc, .zprofile or .zshenv](/blog/zshrc-vs-zprofile)
- [All posts](/blog/)
