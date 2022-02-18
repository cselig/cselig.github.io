import React, { useState } from "react"
import * as d3 from "d3"

import "./bitonic_array_max.scss"

/*
def find_bitonic_max(arr):
  start = 0                           # INIT_START
  end = len(arr) - 1                  # INIT_END
  while start < end:                  # LOOP
    mid = start + (end - start) // 2  # CALCULATE_MID
    if arr[mid] > arr[mid + 1]:       # BRANCH
      end = mid                       # MOVE_END
    else:
      start = mid + 1                 # MOVE_START
  return arr[start]                   # RETURN

INITIAL -> INIT_START -> INIT_END -> LOOP
LOOP -> CALCULATE_MID | RETURN
CALCULATE_MID -> BRANCH -> MOVE_END | MOVE_START -> LOOP
*/

enum State {
  INITIAL = "INITIAL",
  INIT_START = "INIT_START",
  INIT_END = "INIT_END",
  LOOP = "LOOP",
  CALCULATE_MID = "CALCULATE_MID",
  BRANCH = "BRANCH",
  MOVE_END = "MOVE_END",
  MOVE_START = "MOVE_START",
  RETURN = "RETURN",
}

function Code({ state }) {
  const stateToLine = new Map([
    [State.INITIAL, 0],
    [State.INIT_START, 1],
    [State.INIT_END, 2],
    [State.LOOP, 3],
    [State.CALCULATE_MID, 4],
    [State.BRANCH, 5],
    [State.MOVE_END, 6],
    [State.MOVE_START, 8],
    [State.RETURN, 9],
  ])
  const lines = [
    `  def find_bitonic_max(arr):`,
    `    start = 0`,
    `    end = len(arr) - 1`,
    `    while start < end:`,
    `      mid = start + (end - start) // 2`,
    `      if arr[mid] > arr[mid + 1]:`,
    `        end = mid`,
    `      else:`,
    `        start = mid + 1`,
    `    return arr[start]`,
  ]
  const comments = [
    ``,
    `initialize start`,
    `initialize end`,
    `if start < end, we keep searching`,
    `calculate the mid point`,
    `is the midpoint in the increasing or decreasing half?`,
    `if in the decreasing half, adjust end`,
    ``,
    `if in the increasing half, adjust start`,
    `we found the answer – both start and end will point to the peak`,
  ]
  return (
    <div id="code">
      <pre>
        {
          lines.map((line, i) => {
            if (stateToLine.get(state) === i) {
              let firstChar = 0
              while (line[firstChar] === " ") firstChar ++
              console.log(line, firstChar, line[firstChar], line[firstChar] === " ")
              line = line.slice(0, firstChar - 2) + ">" + line.slice(firstChar - 1, line.length)
              if (comments[i] !== "") {
                line = line + " # " + comments[i]
              }
            }
            return <span key={i}>{line + "\n"}</span>
          })
        }
      </pre>
    </div>
  )
}

function Chart({ arr, start, end, mid }) {
  const WIDTH = 450
  const HEIGHT = 200
  const PADDING = 50
  const X_MIN = PADDING
  const X_MAX = WIDTH - PADDING
  const Y_MAX = HEIGHT - PADDING
  const Y_MIN = 25
  const BAR_WIDTH = (X_MAX - X_MIN) / arr.length

  let xScale = d3.scaleLinear()
    .domain([0, arr.length])
    .range([X_MIN, X_MAX])
  let yScale = d3.scaleLinear()
    .domain([0, d3.max(arr)])
    .range([Y_MIN, Y_MAX])

  return (
    <svg width={WIDTH} height={HEIGHT}>
      {
        [
          [start, "green"],
          [mid, "yellow"],
          [end, "red"],
        ].map(([num, color]) => {
          if (num === null) return null
          let yAdjust = 0
          if (color === "yellow" && start === mid) {
            yAdjust = -20
          } else if (color === "red" && end === start) {
            yAdjust = -20
          }
          return <circle
            r="7"
            cx={xScale(num) + BAR_WIDTH / 2}
            cy={Y_MAX - 12 + yAdjust}
            fill={color}
            stroke="none"
            key={color}
          />
        })
      }
      {
        arr.map((element, i) => {
          const style = {
            x: xScale(i),
            y: Y_MAX - yScale(element) + Y_MIN,
            width: BAR_WIDTH,
            height: yScale(element) - Y_MIN,
          }
          return (
            <g key={i}>
              <rect
                fill="none"
                stroke="black"
                style={style}
                key={i}
              />
              <text x={xScale(i) + BAR_WIDTH / 3} y={Y_MAX - yScale(element) + Y_MIN - 10}>
                {element}
              </text>
              <text x={xScale(i) + BAR_WIDTH / 3} y={Y_MAX + 20}>
                {i}
              </text>
            </g>
          )
        })
      }
    </svg>
  )
}

const arrayIsBitonic = (arr) => {
  if (arr.length < 3) {
    return false
  }

  let decreasing = false
  for (let i = 1; i < arr.length; i++) {
    if (decreasing) {
      if (arr[i] > arr[i - 1]) {
        return false
      }
    } else if ((arr[i] < arr[i - 1])) {
      if (i == 1) {
        return false
      } else {
        decreasing = true
      }
    }
  }
  return decreasing
}

function ArrayInput({ arr, setArr, reset, setError }) {
  const [input, setInput] = useState(arr.join(","))
  const setArray = () => {
    const newArr = input.replaceAll(" ", "").split(",").map((x) => parseInt(x))
    console.log(input, newArr)
    setArr(newArr)
    reset()
    if (newArr.includes(NaN)) {
      setError("Array is invalid")
    } else if (!arrayIsBitonic(newArr)) {
      setError("Array is not a mountain array")
    } else {
      setError(null)
    }
  }
  return (
    <div id="array-input">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={setArray}>Set Array</button>
    </div>
  )
}

export default function UI() {
  const [arr, setArr] = useState([1, 2, 3, 4, 5, 4, 3, 2])
  const [error, setError] = useState(null)
  const [state, setState] = useState(State.INITIAL)
  const [start, setStart] = useState(null)
  const [mid, setMid] = useState(null)
  const [end, setEnd] = useState(null)

  const advance = () => {
    switch (state) {
      case State.INITIAL:
        setState(State.INIT_START)
        break;
      case State.INIT_START:
        setStart(0)
        setState(State.INIT_END)
        break;
      case State.INIT_END:
        setEnd(arr.length - 1)
        setState(State.LOOP)
        break;
      case State.LOOP:
        if (start < end) {
          setState(State.CALCULATE_MID)
        } else {
          setState(State.RETURN)
        }
        break;
      case State.CALCULATE_MID:
        setMid(start + Math.floor((end - start) / 2))
        setState(State.BRANCH)
        break;
      case State.BRANCH:
        if (arr[mid] > arr[mid + 1]) {
          setState(State.MOVE_END)
        } else {
          setState(State.MOVE_START)
        }
        break;
      case State.MOVE_END:
        setEnd(mid)
        setMid(null)
        setState(State.LOOP)
        break;
      case State.MOVE_START:
        setStart(mid + 1)
        setMid(null)
        setState(State.LOOP)
        break;
      case State.RETURN:
        break;
      default:
        console.error(`unknown state: ${state}`)
        break;
    }
  }

  const reset = () => {
    setState(State.INITIAL)
    setStart(null)
    setMid(null)
    setEnd(null)
  }

  return (
    <div id="bitonic-array-max">
      <h2>Solution Code</h2>
      <Code state={state} />
      <h2>Input Array</h2>
      <ArrayInput
        arr={arr}
        setArr={setArr}
        reset={reset}
        setError={setError}
        />
      {error &&
        <p><span>❌</span> Error: {error}</p>
      }
      {!error &&
        <div>
          <Chart
            arr={arr}
            start={start}
            end={end}
            mid={mid}
          />
          <div>
            <p><span className="dot start"></span>Start: {start}</p>
            <p><span className="dot mid"></span>Mid: {mid}</p>
            <p><span className="dot end"></span>End: {end}</p>
            <button name="advance" onClick={advance}>{state === State.INITIAL ? "Start" : "Advance"}</button>
            <button name="reset" onClick={reset}>Reset</button>
          </div>
        </div>
      }
    </div>
  )
}
