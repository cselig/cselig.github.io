import React, { useState } from "react"
import data from "./chord_to_successors.json"
import MIDISounds from 'midi-sounds-react';
import { CSSTransition } from "react-transition-group"


const TONIC = 60
const TEMPO = 120

const CHORD_SHAPES = {
  "maj":  [0, 4, 7],
  "maj7": [0, 4, 7, 10],
  "min":  [0, 3, 7],
  "sus":  [0, 5, 7],
  "dim":  [0, 3, 6, 9],
  "aug":  [0, 4, 8],
}
let CHORDS = {}
for (const [name, notes] of Object.entries(CHORD_SHAPES)) {
  CHORDS[name] = notes.map(note => note + TONIC)
}
const OFFSETS = {
  "b7": -2,
  "7":  -1,
  "1":  0,
  "b2": 1,
  "2":  2,
  "b3": 3,
  "3":  4,
  "4":  5,
  "5":  7,
  "b6": 8,
  "6":  9,
}

const TRANSITION_TIME = 300 // ms

const ChordList = ({chords, onSelect, inProp}) => {
  const [height, setHeight] = useState(0)
  return (
    <CSSTransition
      in={inProp}
      appear={true}
      timeout={1000}
      onEntering={() => setHeight(40 * chords.length)}
      onExit={() => setHeight(0)}
    >
      <div className="chords" style={{height: height}}>
        {/* chords *should* be unique */}
        {chords.map((chord, i) => {
          const [startOpacity, endOpacity] = [1, 0.3]
          let opacity
          if (chords.length === 2) {
            // hack - don't want a gradient for picking the first chord
            opacity = 1
          } else {
            opacity = startOpacity + (i / chords.length) * (endOpacity - startOpacity)
          }

          return (
            <p
              className="chord"
              chord={chord}
              onClick={onSelect}
              style={{opacity: opacity}}
              key={chord}
            >{chord}</p>)
        })}
      </div>
    </CSSTransition>
  )
}

const NextChordPicker = ({data, onSelect, inProp}) => {
  let chords = []
  for (const chord in data) {
    chords.push([chord, data[chord]])
  }
  chords.sort((a, b) => b[1] - a[1])
  chords = chords.map((x) => x[0])
  return (
    <div className="next-chord-picker">
      <ChordList chords={chords} onSelect={onSelect} inProp={inProp} />
    </div>
  )
}

const FirstChordPicker = ({onSelect, inProp}) => (
  <div className="first-chord-picker">
    <ChordList chords={["1maj", "1min"]} onSelect={onSelect} inProp={inProp} />
  </div>
)

const ProgressionDisplay = ({chords, active, onSelect, listInProp}) => {
  chords = [...chords]
  const active_index = chords.length
  const pad = 4 - chords.length
  for (let i = 0; i < pad; i++) { chords.push("?") }

  return (
    <div className="progression-display">
      {chords.map((chord, i) => {
        return (
          <div key={i}>
            <p className={"progression-chord " + (chord !== "?" ? "selected" : "")}>{chord}</p>
            {active_index === 0 && i === 0 && active &&
              <FirstChordPicker onSelect={onSelect} inProp={listInProp} />}
            {active_index === i && i > 0 && active &&
              <NextChordPicker data={data[chords[i - 1]]} onSelect={onSelect} inProp={listInProp} />}
          </div>
        )
      })}
    </div>
  )
}

const Text = ({clickable, text, onClick, inProp}) => {
  return (
    <CSSTransition
      in={inProp}
      appear={true}
      timeout={TRANSITION_TIME}
    >
      <div
        className={"text " + (clickable ? "clickable" : "")}
        onClick={onClick}
      >
        <p>{text}</p>
      </div>
    </CSSTransition>
  )
}

class ChordPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chords: [],
      started: false,
      textInProp: true,
      listInProp: false
    }
  }

  render() {
    const resetChords = () => {
      this.midiSounds.stopPlayLoop()
      this.setState({chords: [], textInProp: true})
    }

    const chordToNotes = (chord) => {
      let offsetLen
      if (chord.startsWith("b")) {
        offsetLen = 2
      } else {
        offsetLen = 1
      }
      const offset = chord.substring(0, offsetLen)
      const shape = chord.substring(offsetLen, chord.length)
      return CHORDS[shape].map(x => x + OFFSETS[offset])
    }

    const playChords = () => {
      if (this.state.chords.length == 0) return
      const beat = this.state.chords.map((chord) => [
        [], // drums
        [
          [3, chordToNotes(chord), 1]
        ]
      ])
      this.midiSounds.startPlayLoop(beat, TEMPO, 1)
    }

    const selectChord = (e) => {
      const chord = e.target.getAttribute("chord")
      this.setState({listInProp: false})
      if (this.state.chords.length === 3) {
        this.setState({textInProp: false})
      }

      setTimeout(
        () => {
          this.setState(
            (oldState) => { return {chords: oldState.chords.concat([chord]), listInProp: true} },
            () => {
              if (this.midiSounds.loopStarted) {
                this.midiSounds.stopPlayLoop()
                playChords()
              }
            }
          )
        },
        TRANSITION_TIME
      )

    }

    const clear_enabled = this.state.chords.length > 0
    const play_enabled = this.state.chords.length === 4
    const stop_enabled = this.state.chords.length === 4

    let text
    if (!this.state.started) {
      text = "Click to start!"
    } else if (this.state.chords.length === 0) {
      text = "Pick your first chord"
    } else if (this.state.chords.length < 4) {
      text = "Pick your next chord"
    } else {
      text = ""
    }
    let textOnClick
    if (this.state.started) {
      textOnClick = undefined
    } else {
      textOnClick = () => {
        this.setState({textInProp: false})
        setTimeout(
          () => this.setState({started: true, textInProp: true, listInProp: true}),
          TRANSITION_TIME
        )
      }
    }

    return (
      <div id="chord-picker">
        <MIDISounds
          ref={(ref) => (this.midiSounds = ref)}
          appElementName="___gatsby"
          instruments={[3]}
        />

        <Text
          text={text}
          onClick={textOnClick}
          clickable={!this.state.started}
          inProp={this.state.textInProp}
        />

        <div className="controls">
          <span
            className={"button material-icons-outlined " + (clear_enabled ? "enabled" : "disabled")}
            onClick={clear_enabled ? resetChords : undefined}>clear</span>
          <span
            className={"button material-icons-outlined " + (play_enabled ? "enabled" : "disabled")}
            onClick={play_enabled ? playChords : undefined}>play_arrow</span>
          <span
            className={"button material-icons-outlined " + (stop_enabled ? "enabled" : "disabled")}
            onClick={stop_enabled ? () => this.midiSounds.stopPlayLoop() : undefined}>stop</span>
        </div>

        <ProgressionDisplay
          chords={this.state.chords}
          active={this.state.started}
          onSelect={selectChord}
          listInProp={this.state.listInProp}
        />
      </div>
    )
  }
}

export default ChordPicker