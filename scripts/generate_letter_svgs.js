#!/usr/bin/env node

import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { LETTER_SVG_DATA, RUNE_LINES_TO_LETTER_LINES } from '@/constants/letters.js'
import { RUNE_SVG_DATA, RUNES } from '@/constants/runes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const outputBasePath = join(__dirname, '..', 'src', 'assets', 'letters')
const outputStyledPath = join(outputBasePath, 'styled')
const outputUnstyledPath = join(outputBasePath, 'unstyled')

async function deleteExistingSVGs() {
  const patterns = [
    `${outputStyledPath}/letter_template.svg`,
    `${outputUnstyledPath}/letter_template.svg`,
    `${outputStyledPath}/[0-9][0-9][0-9][0-9][0-9].svg`,
    `${outputUnstyledPath}/[0-9][0-9][0-9][0-9][0-9].svg`,
  ]

  for (const pattern of patterns) {
    for await (const match of fs.glob(pattern)) {
      await fs.unlink(match)
      console.log(`Deleted ${match}`)
    }
  }
}

function svgFor(outerRuneLineIDs, innerRuneLineIDs, hasCircle, hasStyle) {
  const outerLetterLines = outerRuneLineIDs
    .flatMap((id) => RUNE_LINES_TO_LETTER_LINES.outer[id])
    .map((id) => LETTER_SVG_DATA.lines.outer[id])
  const innerLetterLines = innerRuneLineIDs
    .flatMap((id) => RUNE_LINES_TO_LETTER_LINES.inner[id])
    .concat(13) // always include horizontal "word" line
    .map((id) => LETTER_SVG_DATA.lines.inner[id])
  const svgLines = [...new Set([...outerLetterLines, ...innerLetterLines])]
    .map(
      (line) =>
        `        <line id="${line.id}" x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}"/>`,
    )
    .join('\n')
  const { cx, cy, r } = LETTER_SVG_DATA.circle
  const svgCircle = hasCircle
    ? `\n        <circle cx="${cx}" cy="${cy}" r="${r}" fill="transparent"/>`
    : ''
  const inlineStyle = hasStyle ? ' stroke-width="10" stroke="black" stroke-linecap="round"' : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 165">
    <g${inlineStyle}>
${svgLines}${svgCircle}
    </g>
</svg>`
}

async function writeSVG(name, outerLineIDs, innerLineIDs, hasCircle) {
  let filename = `${outputStyledPath}/${name}.svg`
  await fs.writeFile(filename, svgFor(outerLineIDs, innerLineIDs, hasCircle, true))
  console.log(`Created ${filename}`)

  filename = `${outputUnstyledPath}/${name}.svg`
  await fs.writeFile(filename, svgFor(outerLineIDs, innerLineIDs, hasCircle, false))
  console.log(`Created ${filename}`)
}

async function writeTemplate() {
  await writeSVG(
    'letter_template',
    Object.keys(RUNE_SVG_DATA.lines.outer),
    Object.keys(RUNE_SVG_DATA.lines.inner),
    true,
  )
}

/**
 * Creates all possible Rune Letters as well as some that aren't "grammatically correct".
 * Specifically, an active Circle is only used when Letter consists of both an Outer and Inner Rune.
 * Here, we generate images with active Circles even when one or the other is empty
 */
async function writePermutations() {
  const emptyOuterRune = {
    id: '00',
    type: 'outer',
    lines: [],
  }
  const emptyInnerRune = {
    id: '00',
    type: 'inner',
    lines: [],
  }

  for (const outerRune of [...RUNES.outerRunes, emptyOuterRune]) {
    for (const innerRune of [...RUNES.innerRunes, emptyInnerRune]) {
      for (const activeCircle of [0, 1]) {
        const letterID = `${innerRune.id}${outerRune.id}${activeCircle}`
        await writeSVG(letterID, outerRune.lines, innerRune.lines, activeCircle === 1)
      }
    }
  }
}

await deleteExistingSVGs()
await writeTemplate()
await writePermutations()
console.log('Done.')
