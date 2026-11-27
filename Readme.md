<p align="center" class="logo-section">
<img src="/icon.svg" height="80" width="80" alt="Dotfiles icon"/>
</br>
<img src="https://halitsever-api.vercel.app/api/repo-title?title=Dotfiles">

<p align="center">
Personal macOS dotfiles: an Oh My Zsh .zshrc with Homebrew, pnpm, Android SDK, Java, pyenv and gvm setup plus git aliases.<br>
<br/>
<br/>
<img src="https://img.shields.io/github/sponsors/halitsever" alt="GitHub Sponsors"/>
</p>
<p align="center">
<a align="center" href="https://halitsever.github.io/dotfiles/">Documentation</a>
  </p>
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/details"/>
</p>

### What the .zshrc sets up

- **Oh My Zsh** with the `agnoster` theme and the `git` plugin
- PATH setup for Homebrew (`/opt/homebrew`), Cargo, `~/.local/bin`, pnpm, Android SDK platform tools and Homebrew OpenJDK (`JAVA_HOME`)
- pyenv, gvm and neofetch load only when they are installed
- Git aliases (`gs`, `ga`, `gc`, `gp`) and shell shortcuts (`cls`, `zshconfig`, `reload`)
- Shared zsh history (5000 entries, consecutive duplicates skipped) and `compinit` completion
- CI checks `.zshrc` syntax with `zsh -n` on every push and pull request

<p align="center" >
<img src="https://halitsever-api.vercel.app/api/installation"/>
</p>

### Install the zshrc on macOS

Install zsh and [Oh My Zsh](https://ohmyz.sh/) first. The paths in `.zshrc` assume macOS (Homebrew in `/opt/homebrew`, SDKs under `~/Library`).

```sh
git clone https://github.com/halitsever/dotfiles.git ~/dotfiles
cp ~/.zshrc ~/.zshrc.backup
ln -sf ~/dotfiles/.zshrc ~/.zshrc
source ~/.zshrc
```

<p align="center" href="https://github.com/halitsever/dotfiles/issues">
<img src="https://halitsever-api.vercel.app/api/issue"/>
</p>

<p align="center">
Found a bug or have an idea? Open an <a href="https://github.com/halitsever/dotfiles/issues">issue</a>.<br/>
Read the <a href=".github/CONTRIBUTING.md">contributing guide</a> before sending a pull request.
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/sponsor"/>
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/license"/>
</p>

<p align="center">
  MIT LICENSE
</p>
