export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="agnoster"

plugins=(git)

source $ZSH/oh-my-zsh.sh

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# brew
export PATH="/opt/homebrew/bin:$PATH"
export PATH="$HOME/.cargo/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"

# pnpm — guard against double-adding to PATH on reload
export PNPM_HOME="$HOME/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# android
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/platform-tools:$PATH"

# java from brew openjdk
export PATH="/usr/local/opt/openjdk/bin:$PATH"
export JAVA_HOME=$(/usr/libexec/java_home)

# only init pyenv if it's actually installed (skips on fresh machines)
if command -v pyenv >/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi

# gvm
[ -s "$HOME/.gvm/scripts/gvm" ] && source "$HOME/.gvm/scripts/gvm"

# shortcuts
alias cls="clear"
alias zshconfig="nano ~/.zshrc"
alias reload="source ~/.zshrc"

alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"

# neofetch on startup if available
if command -v neofetch >/dev/null 2>&1; then
  neofetch
fi

HISTSIZE=5000
SAVEHIST=5000
HISTFILE=~/.zsh_history
setopt HIST_IGNORE_DUPS
setopt SHARE_HISTORY

autoload -Uz compinit
compinit