import React from 'react'
import * as d3 from 'd3'

import './styles.scss'

const KEY_HEIGHT = 35 // px
const X_OFFSET = KEY_HEIGHT
const Y_OFFSET = KEY_HEIGHT

const STANDARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]
const STANDARD_ROW_X_OFFSETS = [0, KEY_HEIGHT / 3, KEY_HEIGHT * 2 / 3]

const DVORAK_ROWS = [
  ['p', 'y', 'f', 'g', 'c', 'r', 'l'],
  ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'],
  ['q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z']
]
const DVORAK_ROW_X_OFFSETS = [8 / 3 * KEY_HEIGHT, 0, 3 / 2 * KEY_HEIGHT]

const COLEMAK_ROWS = [
  ['q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y'],
  ['a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o'],
  ['z', 'x', 'c', 'v', 'b', 'k', 'm']
]
const COLEMAK_ROW_X_OFFSETS = [0, KEY_HEIGHT / 3, 2 * KEY_HEIGHT / 3]

const sumMapValues = map => {
  let result = 0
  map.forEach(val => result += val)
  return result
}

export default function Keyboard({ keyFreqs, lastPressedKey, keyboardLayout }) {
  let rows
  let rowXOffsets
  if (keyboardLayout === "standard") {
    rows = STANDARD_ROWS
    rowXOffsets = STANDARD_ROW_X_OFFSETS
  } else if (keyboardLayout === "dvorak") {
    rows = DVORAK_ROWS
    rowXOffsets = DVORAK_ROW_X_OFFSETS
  } else if (keyboardLayout === "colemak") {
    rows = COLEMAK_ROWS
    rowXOffsets = COLEMAK_ROW_X_OFFSETS
  }

  const computeFill = key => {
    const total = sumMapValues(keyFreqs)
    const n = keyFreqs.get(key)
    if (n == undefined) return "white"
    const proportion = total === 0 ? 0 : n / total
    // x^1/3 gives a more distributed range of color shades
    return d3.interpolateReds(Math.pow(proportion, 1/3))
  }

  const createKey = (key, i) => {
    const xOffset = i * KEY_HEIGHT + X_OFFSET
    const transform = `translate(${xOffset}px, 0)`
    const fill = computeFill(key)

    const pressed = key === lastPressedKey
    const fontWeight = pressed ? 900 : 400
    const fontSize = pressed ? "20px" : "16px"
    const textX = pressed ? -6 : -4
    return (
      <g className="key" id={key} style={{ transform }} key={key}>
        <rect
          x={-KEY_HEIGHT / 2}
          y={-KEY_HEIGHT / 2}
          height={KEY_HEIGHT}
          width={KEY_HEIGHT}
          style={{ fill }}
        />
        <text x={textX} y={4} style={{ fontWeight, fontSize }}>{key}</text>
      </g>
    )
  }

  const createRow = (row, i) => {
    const xOffset = rowXOffsets[i]
    const yOffset = i * KEY_HEIGHT + Y_OFFSET
    const transform = `translate(${xOffset}px, ${yOffset}px)`
    return (
      <g className="row" style={{ transform }} key={i}>
        {row.map(createKey)}
      </g>
    )
  }

  const keys = rows.map(createRow)

  return (
    <svg
      id="keyboard"
      width={KEY_HEIGHT * 10 + X_OFFSET * 2}
      height={KEY_HEIGHT * 3 + Y_OFFSET * 2}
    >
      {keys}
    </svg>
  )
}
