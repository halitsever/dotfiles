import { defineConfig } from 'vitepress'

const site = 'https://projects.halit.org/dotfiles/'
const name = 'dotfiles'
const description = 'A real macOS .zshrc example, annotated block by block: Oh My Zsh, Homebrew and SDK paths, pyenv, gvm, git aliases and shared zsh history.'

const repo = 'https://github.com/halitsever/dotfiles'
const author = { '@type': 'Person', name: 'Halit Sever', url: 'https://github.com/halitsever' }

const posts = [
  ['zsh-themes', 'Zsh themes'],
  ['zsh-vs-oh-my-zsh', 'Zsh vs Oh My Zsh'],
  ['zsh-plugins', 'Zsh plugins'],
  ['powerlevel10k-vs-agnoster', 'Powerlevel10k vs agnoster'],
  ['reload-zshrc', 'Reload .zshrc'],
  ['zshrc-command-not-found', 'Command not found'],
  ['zshrc-vs-zprofile', '.zshrc vs .zprofile'],
  ['uninstall-oh-my-zsh', 'Uninstall Oh My Zsh'],
]

/** BlogPosting, breadcrumbs and, when the post shows an FAQ, FAQPage data for a blog post. */
function postJsonLd(fm: Record<string, any>, url: string) {
  const person = { '@type': 'Person', name: 'Halit Sever', url: 'https://halit.org' }
  const graph: object[] = [
    {
      '@type': 'BlogPosting',
      headline: fm.headline ?? fm.title,
      description: fm.description,
      url,
      mainEntityOfPage: url,
      datePublished: fm.date,
      dateModified: fm.date,
      inLanguage: 'en',
      image: `${site}og.png`,
      keywords: fm.keyword,
      author: person,
      publisher: person,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'dotfiles', item: site },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}blog/` },
        { '@type': 'ListItem', position: 3, name: fm.headline ?? fm.title, item: url },
      ],
    },
  ]
  if (fm.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: fm.faq.map((f: { q: string; a: string }) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

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
    /** Cloudflare Web Analytics, one token for every page on projects.halit.org. */
    ['script', { defer: '', src: 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "dd7e54d3f48841c187d72d9dbb92a6b6"}' }],
    ['link', { rel: 'icon', href: '/dotfiles/favicon.png', sizes: '32x32', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/dotfiles/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#334155' }],
    ['meta', { property: 'og:site_name', content: name }],
    ['meta', { property: 'og:image', content: `${site}og.png` }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '640' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${site}og.png` }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)],
  ],

  transformPageData(pageData) {
    const fm = pageData.frontmatter
    const title = fm.title ?? pageData.title
    const url = site + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    fm.head ??= []
    fm.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:type', content: fm.date ? 'article' : 'website' }],
      ['meta', { property: 'og:title', content: fm.titleTemplate === false ? title : `${title} | dotfiles` }],
      ['meta', { property: 'og:description', content: fm.description ?? description }],
    )
    if (fm.date) fm.head.push(['script', { type: 'application/ld+json' }, JSON.stringify(postJsonLd(fm, url))])
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
      { text: 'Install Oh My Zsh', link: '/install-oh-my-zsh-mac/' },
      { text: 'Blog', link: '/blog/', activeMatch: '/blog/' },
    ],
    sidebar: {
      '/blog/': [
        {
          text: 'Zsh guides',
          items: [{ text: 'All posts', link: '/blog/' }, ...posts.map(([slug, text]) => ({ text, link: `/blog/${slug}` }))],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: repo }],
    outline: { level: 2, label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: {
      message: 'Released under the MIT License. Oh My Zsh, Homebrew and the other tools named here belong to their own projects.',
      copyright: 'Halit Sever',
    },
  },
})
