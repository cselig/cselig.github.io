import React from "react"
import {
  checkFunctionNamesUnique,
  checkMainExists,
  checkDuplicateParams,
  checkFunctionsInvokedProperly,
  checkNoUndefinedVars,
} from './calculator_static_analysis'

export default function StaticAnalysisUIContainer({ parseTree, setFocusedNodeId }) {
  if (parseTree.error) {
    return <></>
  }

  return (
    <div id="static-analysis-ui-container">
      {
        [
          checkFunctionNamesUnique(parseTree),
          checkMainExists(parseTree),
          checkDuplicateParams(parseTree),
          checkFunctionsInvokedProperly(parseTree),
          checkNoUndefinedVars(parseTree),
        ].map(([error, nodeId]) => {
          if (error === "") {
            return null
          } else {
            return (
              <p
                key={error}
                onMouseOver={() => setFocusedNodeId(nodeId)}
                onMouseOut={() => setFocusedNodeId(null)}
              >
                <span>❌</span> Error: {error}
              </p>
            )
          }
        })
      }
    </div>
  )
}
