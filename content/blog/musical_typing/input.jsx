import React, { useState } from 'react'
import * as Tone from 'tone'

import './styles.scss'

var $ = require('jquery')

const TEXT = "Type this text above and hear a nice scale being played. For each correct character you'll hear a note from the pentatonic scale, and for each incorrect character you'll hear a \"wrong\" note. I think this idea is interesting because it plays with the similarities between a computer keyboard and a piano keyboard and uses multiple senses to inform the user of incorrect input."

const SCALE = ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5", "C6"]
const WRONG_NOTES = ["C#4", "D#4", "D#4", "F#4", "Ab4", "C#5", "D#5", "D#5", "F#5", "Ab5", "C#6"]

const SYNTH = new Tone.Synth().toDestination()

const currTime = () => (new Date().getTime()) / 1000 // seconds

export default function Input() {
  const [textInd, setTextInd] = useState(0)
  const [startTimestamp, setStartTimestamp] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [scaleInd, setScaleInd] = useState(0)

  const onChange = (e) => {
    const text = e.target.value
    if (text === TEXT[textInd]) {
      $(`#input-container .text span:nth-child(${textInd + 1})`).addClass("complete")
      setTextInd(textInd + 1)

      SYNTH.triggerAttackRelease(SCALE[scaleInd], "64n")
      // update scale ind
      if (scaleInd == 0) {
        setScaleInd(scaleInd + 1)
      } else if (scaleInd == SCALE.length - 1) {
        setScaleInd(scaleInd - 1)
      } else if (Math.random() < 0.5) {
        setScaleInd(scaleInd + 1)
      } else {
        setScaleInd(scaleInd - 1)
      }
    } else {
      $(`#input-container .text span:nth-child(${textInd + 1})`).addClass("failed")
      SYNTH.triggerAttackRelease(WRONG_NOTES[scaleInd], "64n")
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

  return (
    <div id="input-container">
      <input
        onChange={onChange}
      ></input>

    <blockquote className="text">
      {[...TEXT].map((c, i) => <span key={i}>{c}</span>)}
    </blockquote>

      <p className="wpm hidden">Nice! Your words per minute: {Math.round(wpm)}</p>
    </div>
  )
}
