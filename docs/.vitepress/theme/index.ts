import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import '@fontsource-variable/martian-mono/standard.css'
import '@fontsource-variable/schibsted-grotesk/wght.css'
import './custom.css'
import Landing from './Landing.vue'
import AliasTable from './AliasTable.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Landing', Landing)
    app.component('AliasTable', AliasTable)
  },
} satisfies Theme
