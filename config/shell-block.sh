# === Setupcraft managed block — do not edit manually ===
# Added by: https://github.com/AbhishekS04/setupcraft

# Useful aliases
alias ll='ls -lah'
alias la='ls -A'
alias ..='cd ..'
alias ...='cd ../..'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias glog='git log --oneline --graph --decorate'

# Handy functions
mkcd() { mkdir -p "$1" && cd "$1"; }
gclone() { git clone "$1" && cd "$(basename "$1" .git)"; }

# Better defaults
export EDITOR="${EDITOR:-nano}"
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoredups:erasedups

# PATH additions
export PATH="$HOME/.local/bin:$PATH"

# === End of Setupcraft managed block ===
