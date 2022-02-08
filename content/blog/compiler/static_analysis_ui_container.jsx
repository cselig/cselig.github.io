import React from "react"
import { buildInheritanceGraph, freshTypeEnv, typeCheck } from "./cool_static_analysis"

export default function StaticAnalysisUIContainer({ parseTree }) {
  if (parseTree.error) {
    return <p>Invalid parse tree</p>
  }

  const [inheritanceGraph, error] = buildInheritanceGraph(parseTree)
  if (error.length > 0) {
    console.error(error)
  }

  console.log("parse tree:", parseTree)

  try {
    typeCheck(parseTree, freshTypeEnv())
  } catch(e) {
    if (typeof e === 'object' && e.errorType === "Type check error") {
      console.log("ERROR:", e.msg, e.nodeId)
    } else {
      throw e
    }
  }

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
