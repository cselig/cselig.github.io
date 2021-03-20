import React, { useState } from 'react'

import './styles.scss'

var $ = require('jquery')

const TEXT = "The path of the righteous man is beset on all sides by the inequities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of the darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who attempt to poison and destroy My brothers. And you will know I am the Lord when I lay My vengeance upon you."

const currTime = () => (new Date().getTime()) / 1000 // seconds

export default function InputContainer({ registerKeyPress, typedText, setTypedText, clearOnce }) {
  const [textInd, setTextInd] = useState(0)
  const [showText, setShowText] = useState(false)
  const [startTimestamp, setStartTimestamp] = useState(0)
  const [wpm, setWpm] = useState(0)

  const onChange = (e) => {
    const text = e.target.value
    if (text === TEXT[textInd]) {
      $(`#input-container .text span:nth-child(${textInd + 1})`).addClass("complete")
      setTextInd(textInd + 1)
    } else {
      $(`#input-container .text span:nth-child(${textInd + 1})`).addClass("failed")
    }
    e.target.value = ""

    // WPM
    if (textInd === 0 && startTimestamp === 0) {
      setStartTimestamp(currTime())
    } else if (textInd === TEXT.length - 1) {
      $("#input-container .wpm").removeClass("hidden")
      const elapsedMinutes = (currTime() - startTimestamp) / 60
      setWpm(TEXT.split(" ").length / elapsedMinutes)
    }
  }

  const onKeyPress = (e) => {
    registerKeyPress(e.key)
    setTypedText(typedText + e.key.toLowerCase())
  }

  const onFocus = () => {
    setShowText(true)
    clearOnce()
  }

  return (
    <div id="input-container">
      <input
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
      ></input>

      {showText &&
        <blockquote className="text">
          {[...TEXT].map((c, i) => <span key={i}>{c}</span>)}
        </blockquote>
      }

      <p className="wpm hidden">Nice! Your words per minute: {Math.round(wpm)}</p>
    </div>
  )
}
