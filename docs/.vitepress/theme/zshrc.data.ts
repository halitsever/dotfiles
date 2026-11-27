import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { notes, type Note } from './notes'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const zshrcPath = path.join(root, '.zshrc')
const readmePath = path.join(root, 'Readme.md')

export interface Line {
  n: number
  html: string
}
export interface Segment {
  note: Omit<Note, 'from' | 'to'> | null
  lines: Line[]
}
export interface Alias {
  name: string
  value: string
  line: number
}
export interface Data {
  segments: Segment[]
  aliases: Alias[]
  lineCount: number
  install: string[]
}

declare const data: Data
export { data }

const KEYWORDS = /^(\s*)(export|alias|source|if|then|fi|case|esac|setopt|autoload|eval)\b/

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlight(line: string) {
  if (/^\s*#/.test(line)) return `<span class="c">${esc(line)}</span>`
  const head = line.match(KEYWORDS)
  const rest = head ? line.slice(head[0].length) : line
  const body = rest
    .split(/("(?:[^"\\]|\\.)*")/)
    .map((part, i) => (i % 2 ? `<span class="s">${esc(part)}</span>` : esc(part)))
    .join('')
  return head ? `${head[1]}<span class="k">${head[2]}</span>${body}` : body
}

/** Index of the only block that contains the key. */
function find(blocks: { text: string }[], key: string, id: string) {
  const hits = blocks.flatMap((b, i) => (b.text.includes(key) ? [i] : []))
  if (hits.length !== 1) {
    throw new Error(`Note "${id}": key "${key}" matches ${hits.length} blocks in .zshrc, expected 1. Update docs/.vitepress/theme/notes.ts.`)
  }
  return hits[0]
}

function build(raw: string, readme: string): Data {
  const lines = raw.replace(/\n+$/, '').split('\n')

  const blocks: { start: number; text: string }[] = []
  lines.forEach((line, i) => {
    if (!line.trim()) return
    const prev = i > 0 && lines[i - 1].trim() ? blocks[blocks.length - 1] : null
    if (prev) prev.text += '\n' + line
    else blocks.push({ start: i, text: line })
  })

  const owner = new Map<number, Note>()
  const skip = new Set<number>()
  for (const note of notes) {
    const from = find(blocks, note.from, note.id)
    const to = note.to ? find(blocks, note.to, note.id) : from
    if (to < from) throw new Error(`Note "${note.id}": "to" comes before "from" in .zshrc.`)
    for (let i = from; i <= to; i++) {
      if (owner.has(i) || skip.has(i)) throw new Error(`Note "${note.id}" overlaps another note.`)
      if (i === from) owner.set(i, note)
      else skip.add(i)
    }
  }

  // A segment runs up to the next segment's first line, blank lines included.
  const starts = blocks.map((b, i) => ({ start: i === 0 ? 0 : b.start, i })).filter((s) => !skip.has(s.i))
  const segments: Segment[] = starts.map((s, k) => {
    const end = k + 1 < starts.length ? starts[k + 1].start : lines.length
    const note = owner.get(s.i)
    return {
      note: note ? { id: note.id, title: note.title, body: note.body } : null,
      lines: lines.slice(s.start, end).map((text, j) => ({ n: s.start + j + 1, html: highlight(text) })),
    }
  })

  const aliases: Alias[] = lines.flatMap((line, i) => {
    const m = line.match(/^alias ([\w-]+)=(["'])(.*)\2\s*$/)
    return m ? [{ name: m[1], value: m[3], line: i + 1 }] : []
  })

  const install = readme.match(/### Install[^\n]*\n[\s\S]*?```sh\n([\s\S]*?)```/)
  if (!install) throw new Error('Readme.md has no sh code block under an "Install" heading.')

  return { segments, aliases, lineCount: lines.length, install: install[1].trim().split('\n') }
}

export default {
  watch: [zshrcPath, readmePath, './notes.ts'],
  load(): Data {
    return build(fs.readFileSync(zshrcPath, 'utf8'), fs.readFileSync(readmePath, 'utf8'))
  },
}
