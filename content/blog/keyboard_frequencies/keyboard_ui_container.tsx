import React, { useState } from 'react'

import Input from './input'
import Keyboard from './keyboard'

import { hamletText } from './hamlet'

import './styles.scss'

type KeyboardLayout = "qwerty" | "dvorak" | "colemak"

function textToLetterFreqs(text) {
  let result = new Map()
  for (const c of text) {
    if (result.has(c)) {
      result.set(c, result.get(c) + 1)
    } else {
      result.set(c, 1)
    }
  }
  return result
}

function LayoutSelector({ keyboardLayout, setKeyboardLayout }) {
  return (
    <div className="keyboard-layouts">
      <p
        className={keyboardLayout === "dvorak" ? "selected" : ""}
        onClick={() => setKeyboardLayout("dvorak")}
      >Dvorak</p>
      <p
        className={keyboardLayout === "qwerty" ? "selected" : ""}
        onClick={() => setKeyboardLayout("qwerty")}
      >Qwerty</p>
      <p
        className={keyboardLayout === "colemak" ? "selected" : ""}
        onClick={() => setKeyboardLayout("colemak")}
      >Colemak</p>
    </div>
  )
}

export default function KeyboardUIContainer() {
  const [lastPressedKey, setLastPressedKey] = useState("")
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>("qwerty")
  const [timeoutId, setTimeoutId] = useState(null)
  const [typedText, setTypedText] = useState(hamletText)
  const [cleared, setCleared] = useState(false)

  function registerKeyPress(key) {
    key = key.toLowerCase()
    setLastPressedKey(key)
    clearTimeout(timeoutId)
    setTimeoutId(
      setTimeout(
        () => setLastPressedKey(""),
        500
      )
    )
  }

  function clearOnce() {
    if (!cleared) {
      setTypedText("")
      setCleared(true)
    }
  }

  return (
    <div id="keyboard-ui-container">
      <LayoutSelector
        keyboardLayout={keyboardLayout}
        setKeyboardLayout={setKeyboardLayout}
      />
      <Keyboard
        keyFreqs={textToLetterFreqs(typedText)}
        lastPressedKey={lastPressedKey}
        keyboardLayout={keyboardLayout}
      />
      <Input
        typedText={typedText}
        setTypedText={setTypedText}
        registerKeyPress={registerKeyPress}
        clearOnce={clearOnce}
      />
    </div>
  )
}
