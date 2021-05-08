import React, { useState } from 'react'
import * as d3 from 'd3'

import ClickingField from './clicking_field'
import Chart from './chart'

import './styles.scss'

const MAX_CLICKS = 15
const CIRCLE_WIDTH_RANGE = [10, 50]

function Container() {
  const [data, setData] = useState([])
  const [clicksRemaining, setClicksRemaining] = useState(MAX_CLICKS)

  const recordDataPoint = (dataPoint) => {
    setData(data.concat([dataPoint]))
    setClicksRemaining(clicksRemaining - 1)
  }

  const meanClickTime = d3.mean(data.map(({ t }) => t))

  return (
    <div id="fitts">
      <p>Clicks remaining: {clicksRemaining}</p>
      <ClickingField
        recordDataPoint={recordDataPoint}
        finished={clicksRemaining === 0}
        circleWidthRange={CIRCLE_WIDTH_RANGE}
      />
      <Chart data={data}  />
      {clicksRemaining === 0 &&
        <p>Average time between target clicks: {Math.round(meanClickTime)} ms</p>}
    </div>
  )
}

export default Container
