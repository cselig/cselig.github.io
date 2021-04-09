import React, { useState } from 'react'

const [FIELD_WIDTH, FIELD_HEIGHT] = [500, 500]

function distanceBetween(p1, p2) {
  return Math.pow(
    Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2),
    0.5
  )
}

function randomBetween(lower, upper) {
  return Math.random() * (upper - lower) + lower
}

function ClickingField({ recordDataPoint, finished, circleWidthRange }) {
  const [currPos, setCurrPos] = useState([100, 100])
  const [currWidth, setCurrWidth] = useState(10)
  const [prevPos, setPrevPos] = useState()
  const [prevClickTime, setPrevClickTime] = useState(Date.now())

  const onClick = () => {
    if (prevPos != undefined) {
      const now = Date.now()
      const t = now - prevClickTime
      const d = distanceBetween(currPos, prevPos)
      recordDataPoint({t, d, w: currWidth})
    }
    const newW = randomBetween(...circleWidthRange)
    const newX = randomBetween(newW, FIELD_WIDTH - newW)
    const newY = randomBetween(newW, FIELD_HEIGHT - newW)
    setCurrWidth(newW)
    setPrevPos(currPos)
    setCurrPos([newX, newY]) // race condition?
    setPrevClickTime(Date.now())
  }

  return (
    <div id="clicking-field">
      <svg width={FIELD_WIDTH} height={FIELD_HEIGHT}>
        {!finished &&
          <circle
            cx={currPos[0]}
            cy={currPos[1]}
            r={currWidth/2}
            onClick={onClick}
          />
        }
      </svg>
    </div>
  )
}

export default ClickingField
