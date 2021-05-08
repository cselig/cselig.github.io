import React, { useEffect } from 'react'
import * as d3 from 'd3'

const [CHART_WIDTH, CHART_HEIGHT] = [300, 300]
const margin = { right: 20, left: 60, top: 20, bottom: 40 }

function difficultyIndex(d, w) {
  return Math.log2(2 * d / w)
}

function lineOfBestFitConstants(xVals, yVals) {
  const xMean = d3.mean(xVals)
  const yMean = d3.mean(yVals)
  const m = d3.sum(xVals.map((x, i) => (x - xMean) * (yVals[i] - yMean))) / d3.sum(xVals.map(x => Math.pow(x - xMean, 2)))
  const b = yMean - m * xMean
  return [m, b]
}

function Chart({ data }) {
  const xVals = data.map(({ d, w }) => difficultyIndex(d, w))
  const yVals = data.map(({ t }) => t)
  const xMin = 0
  const yMin = 0
  const xMax = data.length > 0 ? d3.max(xVals) : 5
  const yMax = data.length > 0 ? d3.max(yVals) : 1000
  const xPad = (xMax - xMin) * 0.2
  const yPad = (yMax - yMin) * 0.2

  const xScale = d3.scaleLinear()
    .domain([xMin, xMax + xPad])
    .range([margin.left, CHART_WIDTH - margin.right])
  const yScale = d3.scaleLinear()
    .domain([yMin, yMax + yPad])
    .range([CHART_HEIGHT - margin.bottom, margin.top])

  // Compute line of best fit.
  const [m, b] = lineOfBestFitConstants(xVals, yVals)
  const p1 = [0, b]
  const p2 = [(xMax + xPad), m * (xMax + xPad) + b]
  const linePath = d3.line()([p1, p2].map(([x, y]) => [xScale(x), yScale(y)]))

  const circles = data.map(({ d, t, w }, i) => {
    const cx = xScale(difficultyIndex(d, w))
    const cy = yScale(t)
    return <circle cx={cx} cy={cy} r={5} key={i}></circle>
  })

  useEffect(
    () => {
      const svg = d3.select("#chart svg")
      svg.select("g.x-axis").remove()
      svg.select("g.y-axis").remove()
      const xAxis = d3.axisBottom().scale(xScale)
      const yAxis = d3.axisLeft().scale(yScale)
      const xAxisGroup = svg.append("g")
        .attr("class", "x-axis")
        .style("transform", `translate(0, ${CHART_HEIGHT - margin.bottom}px)`)
        .call(xAxis)
      const yAxisGroup = svg.append("g")
        .attr("class", "y-axis")
        .style("transform", `translate(${margin.left}px, 0)`)
        .call(yAxis)
      xAxisGroup.append("text")
        .style("transform", `translate(${(CHART_WIDTH - margin.right + margin.left) / 2}px, 33px)`)
        .style("fill", "black")
        .style("font-size", 12)
        .text("Difficulty Index")
      yAxisGroup.append("text")
        .style("fill", "black")
        .style("font-size", 12)
        .attr("x", (CHART_HEIGHT - margin.bottom + margin.top) / 2 + 40) // guessing here
        .attr("y", -40)
        .style("transform", "rotate(-90deg)")
        .style("transform-origin", "center")
        .text("Time (ms)")
    },
    [data])

  return (
    <div id="chart">
      <svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {circles}
        {circles.length > 1 &&
          <path d={linePath} stroke="black"></path>}
      </svg>
    </div>
  )
}

export default Chart
