import React, { useState } from 'react'

import Input from './input'
import Keyboard from './keyboard'

import './styles.scss'

function DebugPanel({ keyFreqs }) {
  return (
    <ul>
      {Array.from(keyFreqs.keys()).map(keyCode => (
        <li key={keyCode}>
          {keyCode}: {keyFreqs.get(keyCode)}
        </li>
      ))}
    </ul>
  )
}

export default function KeyboardUIContainer() {
  const [keyFreqs, setKeyFreqs] = useState(new Map())
  const [lastPressedKey, setLastPressedKey] = useState("")
  const [keyboardLayout, setKeyboardLayout] = useState("standard") // "standard" | "dvorak" | "colemak"

  function registerKeyPress(key) {
    key = key.toLowerCase()
    setLastPressedKey(key)

    // unsure if I can avoid this copy
    let newKeyFreqs = new Map(keyFreqs)
    if (newKeyFreqs.has(key)) {
      newKeyFreqs.set(key, newKeyFreqs.get(key) + 1)
    } else {
      newKeyFreqs.set(key, 1)
    }
    setKeyFreqs(newKeyFreqs)
  }

  function reset() {
    setKeyFreqs(new Map())
    setLastPressedKey("")
  }

  return (
    <div id="keyboard-ui-container">
      <button onClick={reset}>Reset</button>
      <Input registerKeyPress={registerKeyPress} />
      <button onClick={() => setKeyboardLayout("standard")}>Standard</button>
      <button onClick={() => setKeyboardLayout("dvorak")}>Dvorak</button>
      <button onClick={() => setKeyboardLayout("colemak")}>Colemak</button>
      <Keyboard
        keyFreqs={keyFreqs}
        lastPressedKey={lastPressedKey}
        keyboardLayout={keyboardLayout}
      />
      {/* <DebugPanel keyFreqs={keyFreqs} /> */}
    </div>
  )
}
