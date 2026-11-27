import { defineConfig } from 'vitepress'

const site = 'https://halitsever.github.io/dotfiles/'
const name = 'dotfiles'
const description = 'A real macOS .zshrc example, annotated block by block: Oh My Zsh, Homebrew and SDK paths, pyenv, gvm, git aliases and shared zsh history.'

const repo = 'https://github.com/halitsever/dotfiles'
const author = { '@type': 'Person', name: 'Halit Sever', url: 'https://github.com/halitsever' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  '@id': `${site}#source`,
  name,
  description,
  url: site,
  image: `${site}og.png`,
  codeRepository: repo,
  programmingLanguage: 'Shell',
  runtimePlatform: 'zsh on macOS',
  license: 'https://opensource.org/licenses/MIT',
  author,
}

export default defineConfig({
  /** keeps the page hash map out of every page's HTML, which Semrush reads as a low text-to-HTML ratio */
  metaChunk: true,
  base: '/dotfiles/',
  lang: 'en',
  title: name,
  titleTemplate: ':title | dotfiles',
  description,
  cleanUrls: true,
  appearance: false,
  sitemap: { hostname: site },

  head: [
    /** Cloudflare Web Analytics, one token for every page on halitsever.github.io. */
    ['script', { defer: '', src: 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "dd7e54d3f48841c187d72d9dbb92a6b6"}' }],
    ['link', { rel: 'icon', href: '/dotfiles/favicon.png', sizes: '32x32', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/dotfiles/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#334155' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: name }],
    ['meta', { property: 'og:image', content: `${site}og.png` }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '640' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${site}og.png` }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)],
  ],

  transformPageData(pageData) {
    const title = pageData.frontmatter.title ?? pageData.title
    const url = site + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: `${title} | dotfiles` }],
      ['meta', { property: 'og:description', content: pageData.frontmatter.description ?? description }],
    )
  },

  markdown: {
    theme: 'github-light-default',
  },

  themeConfig: {
    logo: { src: '/logo.svg', alt: '' },
    nav: [
      { text: 'Annotated .zshrc', link: '/' },
      { text: 'What is .zshrc', link: '/what-is-zshrc' },
      { text: 'Aliases', link: '/aliases' },
      { text: 'Dotfiles', link: '/what-are-dotfiles' },
    ],
    socialLinks: [{ icon: 'github', link: repo }],
    outline: { level: 2, label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: {
      message: 'Released under the MIT License. Oh My Zsh, Homebrew and the other tools named here belong to their own projects.',
      copyright: 'Halit Sever',
    },
  },
})
