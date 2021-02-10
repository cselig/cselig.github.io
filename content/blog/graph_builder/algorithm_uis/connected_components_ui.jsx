import React from "react"
import * as d3 from "d3"

const delay = 500
const t = d3.transition().delay(delay)

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
        components: [], // List[Set]
      },
    }

    // this.setUpVars = this.setUpVars.bind(this)
    this.setVars = this.setVars.bind(this)
    this.addConnectedComponent = this.addConnectedComponent.bind(this)
    this.stepOne = this.stepOne.bind(this)
    this.stepTwo = this.stepTwo.bind(this)
    this.stepThree = this.stepThree.bind(this)
  }

  // need this function because setState doesn't do a deep merge...
  setVars(vars, callback=null) {
    this.setState(oldState => ({vars: {...oldState.vars, ...vars}}), callback)
  }

  // ...but use this for adding a new connected component
  addConnectedComponent(component) {
    this.setVars({components: this.state.vars.components.concat(component)})
  }

  resetVars() {
    this.setVars({
      currNode: 0,
      seen: new Set(),
      components: [],
    })
  }

  stepOne() {
    // TODO: calling advanceStep too fast triggers a D3 concurrent animation bug. Could either
    // figure out how to fix this or debounce advanceStep.
    let nextNode
    if (this.state.vars.currNode == null) {
      nextNode = 0
    } else {
      nextNode = this.state.vars.currNode + 1
      d3.selectAll("g.node > circle")
        .each((_, i, nodes) => {
          if (i === this.state.vars.currNode) {
            d3.select(nodes[i]).transition(t).attr("r", this.props.nodeOpts.radius)
          }
        })
    }

    this.setState({currStep: 2})
    this.setVars(
      {currNode: nextNode},
      () => d3.selectAll("g.node > circle")
              .each((_, i, nodes) => {
                if (i === this.state.vars.currNode) {
                  d3.select(nodes[i]).transition(t).attr("r", this.props.nodeOpts.radius + 4)
                }
              })
    )
  }

  stepTwo() {
    if (this.state.vars.seen.has(this.state.vars.currNode)) {
      this.setState({currStep: 1})
    } else {
      this.setState({currStep: 3})
    }
  }

  stepThree() {
    const start = this.state.vars.currNode
    let group = new Set([start])
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
            group.add(neighbor)
            q.push(neighbor)
          }
        }
      }
      q = q.slice(q_length)
    }

    const colors = d3["schemeCategory10"]
    d3.selectAll("g.node > circle")
      .each((_, i, nodes) => {
        if (group.has(i)) {
          d3.select(nodes[i])
            .transition(t)
            .style("fill", colors[this.state.vars.components.length])
        }
      })
    this.setState({currStep: 1})

    this.setVars({seen: seen})
    // currently don't need to keep track of this
    this.addConnectedComponent(group)
  }


  componentDidMount() {
    // this is safe to do if we assume this component will always unmount when editing the graph
    this.setVars({adjacencyList: makeAdjacencyList(this.props.edges, this.props.nodes)})
  }

  render() {
    const reset = () => {
      this.props.resetHighlighting()
      this.setState({currStep: 0})
      this.resetVars()
    }

    let stepsText = [
      "for each node:",
      "  if not visited:",
      "    explore from node",
    ]
    const stepsFunctions = [this.stepOne, this.stepTwo, this.stepThree]

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
        <h2>Connected Components</h2>
        <button onClick={advanceStep}>Inc Step</button>
        <p className="text" onClick={reset}>Reset</p>
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
