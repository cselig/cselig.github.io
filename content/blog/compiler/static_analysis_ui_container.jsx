import React from "react"
import { checkMainExists, checkFunctionsInvokedProperly } from './calculator_static_analysis'

export default function StaticAnalysisUIContainer({ parseTree }) {
  if (parseTree.error) {
    return <p>Invalid parse tree</p>
  }

  // TODO: check unique function naming
  const mainExistsError = checkMainExists(parseTree)
  const functionsInvokedProperlyError = checkFunctionsInvokedProperly(parseTree)

  return (
    <div id="static-analysis-ui-container">
      <h2>Static analysis:</h2>
      <h4>Main function exists?</h4>
      <p>
        {mainExistsError === "" ?
          "Yes"
          :
          <span className="error">Error: {mainExistsError}</span>
        }</p>
      <h4>Functions are invoked properly?</h4>
      <p>
        {functionsInvokedProperlyError === "" ?
          "Yes"
          :
          <span className="error">Error: {functionsInvokedProperlyError}</span>
        }</p>
    </div>
  )
}
