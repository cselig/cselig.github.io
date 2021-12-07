import React from "react"

import "./styles.scss"

export default function LexingUIContainer({ tokens, input }) {
  let lexedInput = []
  let inputInd = 0
  let tokenInd = 0
  while (inputInd < input.length) {
    if (tokenInd < tokens.length && inputInd == tokens[tokenInd].start) {
      lexedInput.push(<span key={inputInd} className={tokens[tokenInd].class}>{tokens[tokenInd].lexeme}</span>)
      inputInd += tokens[tokenInd].length
      tokenInd += 1
    } else {
      lexedInput.push(<span key={inputInd}>{input[inputInd]}</span>)
      inputInd += 1
    }
  }

  return (
    <div id="lexing-ui-container">
      <pre className="lexed-input">{lexedInput}</pre>
    </div>
  )
}
