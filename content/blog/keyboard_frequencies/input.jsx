import React, { useState } from 'react'

const SAMPLE_TEXT = ["hello", "world"]

export default function InputContainer({ registerKeyPress }) {
  const [textInd, setTextInd] = useState(0)

  const onChange = (e) => {
    const inputEl = e.target
    const typedText = inputEl.value

    if (typedText === SAMPLE_TEXT[textInd]) {
      inputEl.value = ""
      setTextInd((textInd + 1) % SAMPLE_TEXT.length)
    }
  }

  const onKeyPress = (e) => {
    registerKeyPress(e.key)
  }

  return (
    <div id="input-container">
      <p>{SAMPLE_TEXT[textInd]}</p>
      <input
        onChange={onChange}
        onKeyPress={onKeyPress}
      ></input>
    </div>
  )
}
