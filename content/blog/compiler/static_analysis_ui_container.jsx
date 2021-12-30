import React from "react"
import { buildInheritanceGraph } from "./cool_static_analysis"

export default function StaticAnalysisUIContainer({ parseTree }) {
  if (parseTree.error) {
    return <p>Invalid parse tree</p>
  }

  const [inheritanceGraph, error] = buildInheritanceGraph(parseTree)
  if (error.length > 0) {
    console.error(error)
  }
  console.log("inheritance graph:", inheritanceGraph)

  return (
    <div id="static-analysis-ui-container">
      <h2>Static analysis:</h2>
      {error ?
        <p className="error">{error}</p>
        :
        <p>No errors found.</p>}
    </div>
  )
}
