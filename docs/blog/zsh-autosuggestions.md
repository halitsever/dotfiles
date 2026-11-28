---
title: "zsh-autosuggestions: Install, Accept and Configure"
titleTemplate: false
description: "Set up zsh-autosuggestions with Oh My Zsh, which now bundles it, or with Homebrew. Accept keys, strategies, colors and the plugin not found error."
headline: "Grey history suggestions in zsh with zsh-autosuggestions"
date: "2026-11-28"
keyword: "zsh-autosuggestions"
faq: [{"q": "Is zsh-autosuggestions included in Oh My Zsh?", "a": "Yes, since Oh My Zsh pull request 14088, merged on 10 September 2026. Run omz update, then add zsh-autosuggestions to the plugins list. Older installs still need the git clone into the custom plugins folder."}, {"q": "How do I accept a zsh-autosuggestions suggestion?", "a": "Press the right arrow key or End with the cursor at the end of the line to take the whole suggestion. A forward-word key such as Option+Right in many terminals takes it one word at a time."}, {"q": "Why does Oh My Zsh say plugin zsh-autosuggestions not found?", "a": "Oh My Zsh looks for the plugin in the custom plugins folder and then in its own plugins folder. The message means it is in neither: update Oh My Zsh with omz update or clone the plugin into ~/.oh-my-zsh/custom/plugins."}]
---

# Grey history suggestions in zsh with zsh-autosuggestions

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">zsh-autosuggestions shows a grey guess after the cursor while you type, built from your history. Press the right arrow and the guess becomes the command. It is one of the most installed zsh add-ons, and since September 2026 Oh My Zsh ships it in its own plugins folder, which changes the install steps most guides still show.</p>

## What it does

The plugin, from the [zsh-users project](https://github.com/zsh-users/zsh-autosuggestions), watches the command line as you type. When the start of what you typed matches an older command, it draws the rest of that command after the cursor in a muted colour. Nothing runs until you press Enter, so a wrong guess costs nothing. Keep typing and the suggestion updates or disappears.

## Install with Oh My Zsh

Oh My Zsh added `zsh-autosuggestions` and `zsh-syntax-highlighting` as built-in plugins in [pull request 14088](https://github.com/ohmyzsh/ohmyzsh/pull/14088), merged on 10 September 2026. The vendored copy reports version 0.7.1 in its header. On an install from before that date, update first:

```sh
omz update
```

Then add the name to the plugins array in `~/.zshrc`, before the line that sources Oh My Zsh. This repository's [.zshrc](/) has one plugin, so the line would become:

```sh
plugins=(git zsh-autosuggestions)

source $ZSH/oh-my-zsh.sh
```

Open a new terminal or run `exec zsh`. Names are separated by spaces, never commas.

### If you cloned it before

Older guides clone the plugin into the custom folder:

```sh
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

That still works. Oh My Zsh checks `$ZSH_CUSTOM/plugins` before its own `plugins` folder, so a cloned copy wins over the bundled one. If you would rather let `omz update` keep it current, delete the clone and the bundled copy takes over.

## Install with Homebrew, without Oh My Zsh

```sh
brew install zsh-autosuggestions
```

Then add this line at the end of `~/.zshrc`, as the plugin's install guide says:

```sh
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh
```

Do not load it twice. If Oh My Zsh already lists it in `plugins`, skip the Homebrew line.

## Accepting a suggestion

From the plugin's documentation:

| Key | Effect |
| --- | --- |
| Right arrow (`forward-char`) at the end of the line | accepts the whole suggestion |
| End (`end-of-line`) | accepts the whole suggestion |
| A key bound to `forward-word` | accepts up to the end of the next word |

You can bind a key of your own to the plugin's `autosuggest-accept` widget. The documentation's example binds Ctrl+Space:

```sh
bindkey '^ ' autosuggest-accept
```

Other widgets are `autosuggest-execute` (accept and run), `autosuggest-clear`, `autosuggest-fetch`, `autosuggest-disable`, `autosuggest-enable` and `autosuggest-toggle`.

## Where suggestions come from

`ZSH_AUTOSUGGEST_STRATEGY` is an array of strategies, tried in order until one returns a match:

- `history`: the most recent matching command. This is the default.
- `completion`: what Tab completion would offer.
- `match_prev_cmd`: like `history`, but prefers a match that followed the command you just ran.

```sh
ZSH_AUTOSUGGEST_STRATEGY=(history completion)
```

One catch is worth knowing. The plugin's documentation says `match_prev_cmd` does not work as expected with options that reorder history, naming `HIST_IGNORE_ALL_DUPS` and `HIST_EXPIRE_DUPS_FIRST`. Oh My Zsh turns on `HIST_EXPIRE_DUPS_FIRST` in its `lib/history.zsh`, so with Oh My Zsh the first two strategies are the safer choice.

Because the default strategy reads history, the size of your history decides how good the guesses are. This `.zshrc` keeps 5000 entries shared across tabs. The [zsh history post](/blog/zsh-history) explains those settings.

## Colour and limits

The suggestion colour is `ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE`, `fg=8` by default (colour 8 of the 256-colour palette). On a dark theme such as agnoster's, grey can be hard to see, so a brighter value helps:

```sh
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=#8a8a8a"
```

Two more settings from the documentation:

- `ZSH_AUTOSUGGEST_BUFFER_MAX_SIZE=20` stops suggestions once the line is longer than 20 characters. The documentation recommends 20 when long pastes feel slow.
- `ZSH_AUTOSUGGEST_HISTORY_IGNORE="cd *"` never suggests history entries matching the pattern.

Set them before the plugin loads, so above the `source $ZSH/oh-my-zsh.sh` line with Oh My Zsh.

## Check that it loaded

```sh
print $ZSH_AUTOSUGGEST_STRATEGY
```

An empty line means the plugin did not load. With Oh My Zsh, a missing plugin prints `[oh-my-zsh] plugin 'zsh-autosuggestions' not found` when the shell starts. We checked both cases on 28 November 2026 with Oh My Zsh from that day and zsh 5.9 in a Linux container: without a clone the bundled copy loaded, and the variable printed `history`.

## Pairing it with syntax highlighting

`zsh-syntax-highlighting` is bundled in the same release. Its README in Oh My Zsh asks for it to stay last in the array, after plugins that wrap line-editor widgets:

```sh
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

The [zsh plugins post](/blog/zsh-plugins) covers the git plugin and the load order in more detail.

## FAQ

### Is zsh-autosuggestions included in Oh My Zsh?

Yes, since Oh My Zsh pull request 14088, merged on 10 September 2026. Run omz update, then add zsh-autosuggestions to the plugins list. Older installs still need the git clone into the custom plugins folder.

### How do I accept a zsh-autosuggestions suggestion?

Press the right arrow key or End with the cursor at the end of the line to take the whole suggestion. A forward-word key such as Option+Right in many terminals takes it one word at a time.

### Why does Oh My Zsh say plugin zsh-autosuggestions not found?

Oh My Zsh looks for the plugin in the custom plugins folder and then in its own plugins folder. The message means it is in neither: update Oh My Zsh with omz update or clone the plugin into ~/.oh-my-zsh/custom/plugins.

## Related posts

- [Zsh plugins: the git plugin and two common additions](/blog/zsh-plugins)
- [How zsh history works and how to tune it](/blog/zsh-history)
- [How Tab completion works in Oh My Zsh, and why not to call compinit twice](/blog/oh-my-zsh-autocomplete)
- [All posts](/blog/)
