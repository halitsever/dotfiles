<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { data } from './zshrc.data'

const repo = 'https://github.com/halitsever/dotfiles'
const copied = ref(false)

async function copyInstall() {
  await navigator.clipboard.writeText(data.install.join('\n'))
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const steps = [
  'Clones the repository to ~/dotfiles.',
  'Copies your current ~/.zshrc to ~/.zshrc.backup.',
  'Replaces ~/.zshrc with a symlink to the file in the clone, so a git pull updates your shell config.',
  'Loads the new config into the shell you already have open.',
]

const guides = [
  { href: '/what-is-zshrc', title: 'What is .zshrc and where is it on a Mac', text: 'What zsh reads at startup, where the file lives, how to open, edit and reload it.' },
  { href: '/aliases', title: 'Git and zsh aliases', text: 'Every alias in this file with what it expands to, and how to add your own.' },
  { href: '/what-are-dotfiles', title: 'What are dotfiles', text: 'Why people keep config files in git, how this repository is laid out, how to start yours.' },
  { href: '/install-oh-my-zsh-mac/', title: 'Install Oh My Zsh on a Mac', text: 'The official installer, the font agnoster needs, then this .zshrc with a backup and a symlink.' },
  { href: '/blog/', title: 'Blog', text: 'Zsh themes and plugins, reloading .zshrc, startup files and command not found errors.' },
]
</script>

<template>
  <div class="zl">
    <header class="zl-hero">
      <p class="zl-prompt" aria-hidden="true"><span>%</span> cat ~/.zshrc</p>
      <h1>A macOS .zshrc example, annotated line by line</h1>
      <p class="zl-lede">
        This is the .zshrc I use on my Mac, all {{ data.lineCount }} lines of it: Oh My Zsh, paths for Homebrew and the SDKs I build with, a few git aliases and shared
        history. The file below is read from the repository when this site builds, so it is always the current version. The notes beside it say what each block does
        and why you might want it.
      </p>
      <p class="zl-actions">
        <a class="zl-button" href="#use-it">Use this file</a>
        <a class="zl-link" :href="repo">Source on GitHub</a>
      </p>
    </header>

    <section class="zl-file" aria-labelledby="file-title">
      <div class="zl-row zl-row-head">
        <div class="zl-gutter"></div>
        <div class="zl-sheet zl-sheet-head">
          <h2 id="file-title">~/.zshrc</h2>
          <span>{{ data.lineCount }} lines, zsh</span>
          <a :href="`${repo}/blob/main/.zshrc`">Open on GitHub</a>
        </div>
      </div>

      <div v-for="(seg, i) in data.segments" :key="i" class="zl-row" :class="{ 'has-note': seg.note }">
        <div class="zl-gutter">
          <article v-if="seg.note" :id="seg.note.id" class="zl-note">
            <h3>
              <a :href="`#${seg.note.id}`">{{ seg.note.title }}</a>
            </h3>
            <div class="zl-note-body" v-html="seg.note.body"></div>
          </article>
        </div>
        <div class="zl-sheet zl-code">
          <div v-for="line in seg.lines" :key="line.n" class="zl-line">
            <span class="zl-n" aria-hidden="true">{{ line.n }}</span>
            <code v-html="line.html"></code>
          </div>
        </div>
      </div>

      <div class="zl-row zl-row-foot">
        <div class="zl-gutter"></div>
        <div class="zl-sheet zl-sheet-foot"></div>
      </div>
    </section>

    <section id="use-it" class="zl-use">
      <div class="zl-use-text">
        <h2>Use it on your Mac</h2>
        <p>
          Install zsh and <a href="https://ohmyz.sh/">Oh My Zsh</a> first. The paths in the file assume macOS, with Homebrew in <code>/opt/homebrew</code> and SDKs under
          <code>~/Library</code>. pyenv, gvm and neofetch are skipped when they are not installed.
        </p>
        <div class="zl-warn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3 2.5 20h19L12 3Z" />
            <path d="M12 10v4.5M12 17.5v.01" />
          </svg>
          <p>
            <strong>Back up your own file first.</strong> <code>ln -sf</code> replaces <code>~/.zshrc</code> without asking. The second command saves a copy as
            <code>~/.zshrc.backup</code>. Check that the copy exists before you run the third. If you have no <code>~/.zshrc</code> yet, <code>cp</code> reports that
            there is nothing to copy and you can carry on.
          </p>
        </div>
        <p>To go back, remove the symlink and restore the copy: <code>rm ~/.zshrc &amp;&amp; mv ~/.zshrc.backup ~/.zshrc</code>.</p>
      </div>

      <div class="zl-install">
        <div class="zl-install-head">
          <span>Terminal</span>
          <button type="button" @click="copyInstall">
            <svg v-if="!copied" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
            <span aria-live="polite">{{ copied ? 'Copied' : 'Copy' }}</span>
          </button>
        </div>
        <ol>
          <li v-for="(cmd, i) in data.install" :key="cmd">
            <code>{{ cmd }}</code>
            <p v-if="data.install.length === steps.length">{{ steps[i] }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="zl-next" aria-labelledby="next-title">
      <h2 id="next-title">Background reading</h2>
      <ul>
        <li v-for="g in guides" :key="g.href">
          <a :href="withBase(g.href)">{{ g.title }}</a>
          <span>{{ g.text }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
