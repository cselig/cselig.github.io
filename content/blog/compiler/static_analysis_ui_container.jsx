import React from "react"
import {
  checkFunctionNamesUnique,
  checkMainExists,
  checkDuplicateParams,
  checkFunctionsInvokedProperly,
  checkNoUndefinedVars,
} from './calculator_static_analysis'

export default function StaticAnalysisUIContainer({ parseTree }) {
  if (parseTree.error) {
    return <p>Invalid parse tree</p>
  }

  // TODO: check unique function naming
  const functionNamesUniqueError = checkFunctionNamesUnique(parseTree)
  const mainExistsError = checkMainExists(parseTree)
  const duplicateParamError = checkDuplicateParams(parseTree)
  const functionsInvokedProperlyError = checkFunctionsInvokedProperly(parseTree)
  const noUndefinedVarsError = checkNoUndefinedVars(parseTree)

  return (
    <div id="static-analysis-ui-container">
      <h2>Static analysis:</h2>

      {
        [
          [
            "Are function names unique?",
            functionNamesUniqueError,
          ],
          [
            "Does the Main function exist?",
            mainExistsError,
          ],
          [
            "Are parameter names unique for each function?",
            duplicateParamError,
          ],
          [
            "Are functions invoked properly?",
            functionsInvokedProperlyError,
          ],
          [
            "Are all variable references valid?",
            noUndefinedVarsError,
          ],
        ].map(([title, error]) => (
          <div key={title}>
            <h4>{(error === "" ? <span>✅</span> : <span>❌</span>)} {title}</h4>
            <p>
              {error === "" ?
                ""
                :
                <span className="error">Error: {error}</span>
              }</p>
          </div>
        ))
      }
    </div>
  )
}
