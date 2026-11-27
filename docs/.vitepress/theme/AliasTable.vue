<script setup lang="ts">
import { data } from './zshrc.data'
import { aliasNotes } from './notes'
</script>

<template>
  <table class="alias-table">
    <thead>
      <tr>
        <th>Alias</th>
        <th>Expands to</th>
        <th>What it does</th>
        <th>Line</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="a in data.aliases" :key="a.name">
        <td><code>{{ a.name }}</code></td>
        <td><code>{{ a.value }}</code></td>
        <td>{{ aliasNotes[a.name] ?? '' }}</td>
        <td>{{ a.line }}</td>
      </tr>
    </tbody>
  </table>
</template>
