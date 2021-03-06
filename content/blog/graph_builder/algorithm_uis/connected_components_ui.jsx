import React from "react"
import * as d3 from "d3"

const delay = 500
const colors = d3["schemeCategory10"]

// TODO: share these
function reciprocateEdges(edges) {
  let result = []
  for (const {start, end} of edges) {
    // could create duplicate edges
    result.push({start: start, end: end})
    result.push({start: end, end :start})
  }
  return result
}

function makeAdjacencyList(edges, nodes) {
  edges = reciprocateEdges(edges)
  let adjacencyList = new Map()
  for (const {start, end} of edges) {
    if (adjacencyList.has(start)) {
      adjacencyList.get(start).push(end)
    } else {
      adjacencyList.set(start, [end])
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    if (!adjacencyList.has(i)) adjacencyList.set(i, [])
  }
  return adjacencyList
}

class ConnectedComponentsUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currStep: 1,
      vars: { // a namespace for variables used in the algorithm itself
        currNode: 0,
        seen: new Set(),
        numComponents: 0,
      },
    }

    // this.setUpVars = this.setUpVars.bind(this)
    this.setVars = this.setVars.bind(this)
    this.stepOne = this.stepOne.bind(this)
    this.stepTwo = this.stepTwo.bind(this)
  }

  // need this function because setState doesn't do a deep merge...
  setVars(vars, callback=null) {
    this.setState(oldState => ({vars: {...oldState.vars, ...vars}}), callback)
  }

  resetVars() {
    this.setVars({
      currNode: 0,
      seen: new Set(),
      numComponents: 0,
    })
  }

  stepOne() {
    const t = d3.transition().delay(delay)
    d3.selectAll("g.node > circle").transition(t).attr("r", this.props.nodeOpts.radius)
    // TODO: calling advanceStep too fast triggers a D3 concurrent animation bug. Could either
    // figure out how to fix this or debounce advanceStep.
    let nextNode
    if (this.state.vars.currNode == null) {
      nextNode = 0
    } else {
      for (let i = 0; i < this.props.nodes.length; i++) {
        if (!this.state.vars.seen.has(i)) {
          nextNode = i
          break
        }
      }
      if (nextNode == undefined) {
        console.log("finished")
        return
      }
    }

    this.setState({currStep: 2})
    this.setVars(
      {currNode: nextNode},
      () => d3.selectAll("g.node > circle")
              .each((_, i, nodes) => {
                if (i === this.state.vars.currNode) {
                  d3.select(nodes[i])
                    .transition(t)
                    .style("fill", colors[this.state.vars.numComponents])
                    .attr("r", this.props.nodeOpts.radius + 4)
                }
              })
    )
  }

  stepTwo() {
    const t = d3.transition().delay(delay)
    const start = this.state.vars.currNode
    let group = [start]
    let seen = new Set(this.state.vars.seen)
    seen.add(start)
    let q = [start]

    while(!(q.length === 0)) {
      const q_length = q.length
      for (let i = 0; i < q_length; i++) {
        const curr = q[i]
        for (const neighbor of this.state.vars.adjacencyList.get(curr)) {
          if (!seen.has(neighbor)) {
            seen.add(neighbor)
            group.push(neighbor)
            q.push(neighbor)
          }
        }
      }
      q = q.slice(q_length)
    }

    d3.selectAll("g.node > circle")
      .each((_, i, nodes) => {
        if (group.includes(i)) {
          d3.select(nodes[i])
            .transition(t)
            .delay(group.indexOf(i) * 100)
            .style("fill", colors[this.state.vars.numComponents])
            .attr("r", this.props.nodeOpts.radius + 4)
        }
      })
    this.setState({currStep: 1})
    this.setVars({seen: seen, numComponents: this.state.vars.numComponents + 1})
  }

  componentDidMount() {
    // this is safe to do if we assume this component will always unmount when editing the graph
    this.setVars({adjacencyList: makeAdjacencyList(this.props.edges, this.props.nodes)})
  }

  render() {
    const reset = () => {
      this.props.resetHighlighting()
      this.setState({currStep: 1})
      this.resetVars()
    }

    let stepsText = [
      "for each node that hasn't been visited:",
      "  mark all connected nodes",
    ]
    const stepsFunctions = [this.stepOne, this.stepTwo]

    const nSteps = stepsText.length
    if (this.state.currStep != null) {
      stepsText[this.state.currStep - 1] += ' <'
    }

    const advanceStep = () => {
      // TODO: need to end when we run out of nodes
      stepsFunctions[this.state.currStep - 1].call()
    }

    return (
      <div id="connected-components" className="algorithm-ui">
        {/* <p className="text" onClick={reset}>Reset</p> */}
        <button onClick={advanceStep}>Next Step</button>
        <button onClick={() => this.props.setMode(null)}>Reset</button>
        <pre className="steps">
          {stepsText.join("\n")}
        </pre>
      </div>
    )
  }

  componentWillUnmount() {
    this.props.resetHighlighting()
  }
}

export default ConnectedComponentsUI
