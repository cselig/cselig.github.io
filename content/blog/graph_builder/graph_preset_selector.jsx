import React from "react"
import * as graphUtils from "../../../src/js/graphs.js"

import defaultNodes from "./data/default/nodes.json"
import defaultEdges from "./data/default/edges.json"
import heavenlyNodes from "../ski_graphs/data/heavenly/nodes.json"
import heavenlyEdges from "../ski_graphs/data/heavenly/edges.json"
import gridNodes from "./data/grid/nodes.json"
import gridEdges from "./data/grid/edges.json"
import islandsNodes from "./data/islands/nodes.json"
import islandsEdges from "./data/islands/edges.json"

const presetsMap = {
  "default": {"nodes": defaultNodes, "edges": defaultEdges},
  "heavenly": {"nodes": heavenlyNodes, "edges": heavenlyEdges},
  "grid": {"nodes": gridNodes, "edges": gridEdges},
  "islands": {"nodes": islandsNodes, "edges": islandsEdges},
}

class GraphPresetSelector extends React.Component {
  componentDidMount() {
    this.props.setNodes(graphUtils.scaleNodeData(defaultNodes, this.props.svgWidth, this.props.svgHeight))
    this.props.setEdges(defaultEdges)
  }

  render() {
    const selectPreset = (preset) => {
      const { nodes, edges } = presetsMap[preset]
      // TODO: there should be some sort of interface for getting this data
      // so we don't have to care about scaling it up or where it is.
      this.props.setNodes(graphUtils.scaleNodeData(nodes, this.props.svgWidth, this.props.svgHeight))
      this.props.setEdges(edges)
    }

    return (
      <div className="preset-selector">
        <p onClick={() => selectPreset("default")}>Default</p>
        <p onClick={() => selectPreset("heavenly")}>Heavenly Ski Resort</p>
        <p onClick={() => selectPreset("grid")}>Grid</p>
        <p onClick={() => selectPreset("islands")}>Islands</p>
      </div>
    )
  }
}

export default GraphPresetSelector
