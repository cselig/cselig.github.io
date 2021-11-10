import React, { useEffect } from 'react'
import * as d3 from 'd3'
import * as Tone from 'tone'

import './styles.scss'

const KEY_HEIGHT = 35 // px
const X_OFFSET = KEY_HEIGHT
const Y_OFFSET = KEY_HEIGHT

const STANDARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
]
const STANDARD_ROW_X_OFFSETS = [0, KEY_HEIGHT / 3, KEY_HEIGHT * 2 / 3]

const sumMapValues = map => {
  let result = 0
  map.forEach(val => result += val)
  return result
}

export default function MusicalTyping() {
  let synth

  useEffect(() => {
    synth = new Tone.Synth().toDestination();
  }, [])

  const onKeyPress = (e) => {
    console.log(e, e.key)

    const pentatonic = ["C4", "D4", "E4", "G4", "A4"]
    const blues = ["C4", "Eb4", "F4", "F#4", "G4", "Bb4", "C5"]
    const whole_tone = ["C4", "D4", "E4", "F#4", "G#4", "A#4", "C5"]
    const scale = whole_tone

    if (e.key == " ") {
      // const now = Tone.now()
      synth.triggerAttackRelease(["C3", "G3"], "32n")
      // synth.triggerRelease(now + 1)
    } else {
      synth.triggerAttackRelease(scale[Math.floor(Math.random() * scale.length)], "32n");
    }
  }

  return (
    <div>
      <input
        onKeyPress={onKeyPress}
      >
      </input>
    </div>
  )
}

function Keyboard({ }) {
  const rows = STANDARD_ROWS
  const rowXOffsets = STANDARD_ROW_X_OFFSETS

  const createKey = (key, i, rowInd) => {
    const xOffset = i * KEY_HEIGHT + X_OFFSET + rowXOffsets[rowInd]
    const yOffset = rowInd * KEY_HEIGHT + Y_OFFSET
    const transform = `translate(${xOffset}px, ${yOffset}px)`

    const pressed = false
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
        />
        <text x={textX} y={4} style={{ fontWeight, fontSize }}>{key}</text>
      </g>
    )
  }

  let keys = []
  rows.forEach((row, rowInd) => {
    row.forEach((key, keyInd) => {
      keys.push(createKey(key, keyInd, rowInd))
    })
  })

  return (
    <svg
      id="keyboard"
      width={KEY_HEIGHT * 10 + X_OFFSET * 2}
      height={KEY_HEIGHT * 3 + Y_OFFSET}
    >
      {keys}
    </svg>
  )
}
