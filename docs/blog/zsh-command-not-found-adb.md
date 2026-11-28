---
title: "Fix zsh: command not found: adb on a Mac"
titleTemplate: false
description: "Fix zsh: command not found: adb on macOS. Find platform-tools, set ANDROID_HOME and PATH in .zshrc, or install adb with Homebrew, then check with which adb."
headline: "adb is installed but zsh cannot find it: add platform-tools to PATH"
date: "2026-11-28"
keyword: "zsh: command not found: adb"
faq: [{"q": "Where is adb on a Mac?", "a": "With Android Studio's default SDK location it is ~/Library/Android/sdk/platform-tools/adb. With the Homebrew cask android-platform-tools it is linked as /opt/homebrew/bin/adb on Apple Silicon."}, {"q": "Should I use ANDROID_HOME or ANDROID_SDK_ROOT?", "a": "ANDROID_HOME. Android's documentation lists ANDROID_SDK_ROOT as deprecated. If you set both, they must point to the same folder."}, {"q": "Why does adb work in Android Studio but not in Terminal?", "a": "Android Studio uses the full path to its SDK. Terminal only searches the folders in PATH, and platform-tools is not one of them until you add it."}]
---

# adb is installed but zsh cannot find it: add platform-tools to PATH

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Android Studio installs adb, but it does not put it on your PATH. So the first time you type adb devices in Terminal, zsh answers command not found. The fix is two lines in .zshrc, the same two this repository uses, or a Homebrew package that links adb for you.</p>

## Why zsh cannot find it

`zsh: command not found: adb` means none of the folders in `PATH` has a file called `adb`. It does not mean adb is missing. Android Studio puts its SDK under `~/Library/Android/sdk` on a Mac, and adb lives in the `platform-tools` folder inside it. That folder is not on `PATH` by default.

Check that the file exists:

```sh
ls ~/Library/Android/sdk/platform-tools/adb
```

If it is there, the fix is `PATH`. If it is not, install platform-tools first (next section). If you moved the SDK, Android Studio shows its location under Settings, Languages and Frameworks, Android SDK.

## Option 1: add platform-tools to PATH

This repository's [Android block](/#android) does it like this:

```sh
# android
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

`ANDROID_HOME` names the SDK folder, which Gradle and other tools also read. The `PATH` line puts `platform-tools` first, so `adb` and `fastboot` resolve to the SDK's copies.

[Android's environment variables page](https://developer.android.com/tools/variables) says `ANDROID_SDK_ROOT` is deprecated and that Android Studio and the Android Gradle plugin check that the old and new variables agree. Setting it to `$ANDROID_HOME`, as the file does, keeps them in agreement. You can drop that line if nothing you use still reads it.

The same page shows a longer `PATH` line that also adds `tools` and `tools/bin`. Those folders hold the old SDK tools. If you only need adb, `platform-tools` is enough.

Apply the change and test:

```sh
exec zsh
which adb
adb version
```

`which adb` should print the full path inside your SDK.

## Option 2: Homebrew

If you do not use Android Studio, Homebrew has a cask with only the platform tools:

```sh
brew install --cask android-platform-tools
```

The cask (37.0.1 on 28 November 2026; Google's own release notes list 37.0.3 as the latest) links `adb`, `fastboot` and a few other binaries into `$HOMEBREW_PREFIX/bin`. On Apple Silicon that is `/opt/homebrew/bin`, which is already on `PATH` when Homebrew is set up, so no `.zshrc` edit is needed. If zsh cannot find `brew` either, fix that first: see [command not found after a .zshrc change](/blog/zshrc-command-not-found).

## Two copies of adb

Install both and you have two adb binaries. Whichever folder comes first in `PATH` wins. The repository's line prepends `platform-tools`, so the SDK copy wins over Homebrew's. Different adb versions on the same machine can fight over the adb server, which shows up as `adb server version doesn't match this client` and the server restarting. Pick one source and remove the other, or at least know which one `which adb` returns.

## Still not found

- **Typo in the path.** `echo $PATH | tr ':' '\n'` lists each folder on its own line. Look for the platform-tools entry and `ls` it.
- **Edited the wrong file.** zsh reads `~/.zshrc` for interactive shells. A line in `~/.bash_profile` does nothing in zsh. See [.zshrc vs .zprofile](/blog/zshrc-vs-zprofile).
- **Old terminal tab.** Tabs opened before the edit still have the old `PATH`. Run `exec zsh` or open a new tab.
- **Command cache.** zsh caches where commands are. `rehash` refreshes it.

## Not only adb

`fastboot`, `sqlite3` from the SDK, `emulator` (in `$ANDROID_HOME/emulator`) and Java all follow the same rule: the binary exists, but its folder is not on `PATH`. For Java the extra step is `JAVA_HOME`, covered in [How to set JAVA_HOME on a Mac](/blog/set-java-home-mac).

## FAQ

### Where is adb on a Mac?

With Android Studio's default SDK location it is ~/Library/Android/sdk/platform-tools/adb. With the Homebrew cask android-platform-tools it is linked as /opt/homebrew/bin/adb on Apple Silicon.

### Should I use ANDROID_HOME or ANDROID_SDK_ROOT?

ANDROID_HOME. Android's documentation lists ANDROID_SDK_ROOT as deprecated. If you set both, they must point to the same folder.

### Why does adb work in Android Studio but not in Terminal?

Android Studio uses the full path to its SDK. Terminal only searches the folders in PATH, and platform-tools is not one of them until you add it.

## Related posts

- [zsh: command not found after a .zshrc change](/blog/zshrc-command-not-found)
- [JAVA_HOME on macOS: java_home, Homebrew and the right path](/blog/set-java-home-mac)
- [Reloading .zshrc: source, exec zsh and omz reload](/blog/reload-zshrc)
- [All posts](/blog/)
