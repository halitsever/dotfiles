/**
 * Margin notes for the annotated .zshrc. Each note finds its block by a string
 * the block contains, so line numbers can move freely. The build fails when a
 * key no longer matches anything in the file.
 */
export interface Note {
  id: string
  /** Text found in the first block the note covers. */
  from: string
  /** Text found in the last block, when the note spans several. */
  to?: string
  title: string
  /** Trusted HTML. */
  body: string
}

export const notes: Note[] = [
  {
    id: 'oh-my-zsh',
    from: 'ZSH_THEME=',
    to: 'oh-my-zsh.sh',
    title: 'Oh My Zsh, the agnoster theme and one plugin',
    body: `<p><code>ZSH</code> tells Oh My Zsh where it is installed. Everything above the <code>source</code> line is configuration that the framework reads when it loads, so the theme and plugin list have to come first.</p>
<p><code>agnoster</code> draws the prompt as coloured segments with the current git branch. It needs a Powerline-patched font in the terminal, otherwise the segment separators show up as boxes.</p>
<p>The plugin list has a single entry, <code>git</code>. It ships with Oh My Zsh and adds git aliases and completion. There are no third-party plugins here, so nothing extra has to be cloned.</p>`,
  },
  {
    id: 'locale',
    from: 'LC_ALL=',
    title: 'Locale',
    body: `<p>Pins the shell to US English with UTF-8. <code>LC_ALL</code> overrides every other <code>LC_*</code> setting, so command output, sorting and date formats stay the same whatever the system language is. UTF-8 also keeps the prompt glyphs intact.</p>`,
  },
  {
    id: 'path',
    from: '/opt/homebrew/bin',
    title: 'PATH for Homebrew, Cargo and local binaries',
    body: `<p>Each line puts a directory at the front of <code>PATH</code>, so the last line wins when two directories hold a command with the same name.</p>
<p><code>/opt/homebrew/bin</code> is where Homebrew installs on Apple Silicon Macs. <code>~/.cargo/bin</code> holds binaries installed with Rust's <code>cargo install</code>. <code>~/.local/bin</code> is a common home for tools installed for one user.</p>`,
  },
  {
    id: 'pnpm',
    from: 'PNPM_HOME',
    title: 'pnpm, added once',
    body: `<p><code>PNPM_HOME</code> is the directory pnpm uses for its own binary and for globally installed packages.</p>
<p>The <code>case</code> statement checks whether that directory is already in <code>PATH</code> and only prepends it when it is missing. Without the check, every <code>reload</code> would add the same entry again.</p>`,
  },
  {
    id: 'android',
    from: 'ANDROID_HOME',
    title: 'Android SDK',
    body: `<p>Points at the SDK that Android Studio installs under <code>~/Library</code> on a Mac. <code>ANDROID_HOME</code> is the current variable name. <code>ANDROID_SDK_ROOT</code> is the older one, kept because some build tools still read it.</p>
<p>Adding <code>platform-tools</code> to <code>PATH</code> makes <code>adb</code> and <code>fastboot</code> available in every shell.</p>`,
  },
  {
    id: 'java',
    from: 'JAVA_HOME',
    title: 'Java',
    body: `<p><code>/usr/libexec/java_home</code> is a macOS tool that prints the path of the default installed JDK. Build tools such as Gradle read <code>JAVA_HOME</code> to find Java.</p>
<p>That tool only exists on macOS, so on Linux this line prints an error at every shell start. The <code>PATH</code> line uses <code>/usr/local</code>, the Homebrew prefix on Intel Macs. On Apple Silicon, Homebrew keeps OpenJDK under <code>/opt/homebrew/opt/openjdk</code>.</p>`,
  },
  {
    id: 'pyenv',
    from: 'pyenv init',
    title: 'pyenv, only when installed',
    body: `<p><code>command -v pyenv</code> succeeds only when pyenv is on <code>PATH</code>. On a machine without it the block is skipped and the shell starts with no error.</p>
<p><code>pyenv init -</code> prints shell code that puts pyenv's shims first in <code>PATH</code>, so <code>python</code> resolves to the version pyenv selected. <code>eval</code> runs that code in the current shell.</p>`,
  },
  {
    id: 'gvm',
    from: '.gvm/scripts/gvm',
    title: 'gvm for Go versions',
    body: `<p>gvm is the Go Version Manager. <code>[ -s file ]</code> is true when the file exists and is not empty, so the script is sourced only on machines where gvm is installed. It is the same guard as the pyenv block, written on one line.</p>`,
  },
  {
    id: 'shortcuts',
    from: 'alias zshconfig',
    title: 'Shell shortcuts',
    body: `<p><code>cls</code> clears the screen, a habit carried over from Windows. <code>zshconfig</code> opens this file in nano. <code>reload</code> sources it again, so an edit takes effect without opening a new terminal tab.</p>`,
  },
  {
    id: 'git-aliases',
    from: 'alias gs=',
    title: 'Git aliases',
    body: `<p>Four short names for the commands typed most often. <code>gc</code> ends with <code>-m</code>, so the message follows directly: <code>gc "fix typo"</code>.</p>
<p>These lines come after Oh My Zsh has loaded, so they replace the git plugin's own <code>ga</code>, <code>gc</code> and <code>gp</code>. The <a href="aliases">aliases page</a> lists what each one expands to.</p>`,
  },
  {
    id: 'neofetch',
    from: 'neofetch',
    title: 'neofetch on startup',
    body: `<p>Prints a system summary with the OS logo each time a terminal opens. It uses the same <code>command -v</code> guard as pyenv, so a Mac without neofetch stays quiet.</p>`,
  },
  {
    id: 'history',
    from: 'HISTFILE=',
    title: 'Shared history',
    body: `<p>zsh keeps 5000 commands in memory and writes 5000 to <code>~/.zsh_history</code>.</p>
<p><code>HIST_IGNORE_DUPS</code> skips a command when it repeats the one just before it. <code>SHARE_HISTORY</code> makes every open terminal read and write the same history file as commands run, so a command typed in one tab can be recalled in another.</p>`,
  },
  {
    id: 'completion',
    from: 'compinit',
    title: 'Completion',
    body: `<p><code>compinit</code> starts zsh's completion system, the thing that fills in commands, flags and file names when you press Tab. <code>autoload -Uz</code> loads the function without applying any aliases to it.</p>`,
  },
]

/** One-line descriptions for the alias table, keyed by alias name. */
export const aliasNotes: Record<string, string> = {
  cls: 'Clears the terminal screen.',
  zshconfig: 'Opens the config file in nano.',
  reload: 'Applies changes to the config in the current shell.',
  gs: 'Shows changed, staged and untracked files.',
  ga: 'Stages every change under the current directory.',
  gc: 'Commits with the message that follows, as in gc "fix typo".',
  gp: 'Pushes the current branch to its upstream.',
}
