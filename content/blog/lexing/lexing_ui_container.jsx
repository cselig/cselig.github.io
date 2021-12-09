import React, { useState } from "react"

import "./styles.scss"

export default function LexingUIContainer({ tokens, input }) {
  const [hoveredToken, setHoveredToken] = useState(null)
  const [tooltipLoc, setTooltipLoc] = useState(null)

  let lexedInput = []
  let inputInd = 0
  let tokenInd = 0
  while (inputInd < input.length) {
    if (tokenInd < tokens.length && inputInd == tokens[tokenInd].start) {
      const token = tokens[tokenInd]
      lexedInput.push(
        <span
          key={inputInd}
          onMouseOver={(e) => {
            const rect = e.target.getBoundingClientRect()
            setTooltipLoc({
              // NOTE: not sure why we need the magic numbers here.
              x: rect.right + window.scrollX - 10,
              y: rect.y + window.scrollY - 65
            })
            setHoveredToken(token)
          }}
          onMouseOut={() => {
            setHoveredToken(null)
            setTooltipLoc(null)
          }}
          className={token.class}>
          {token.lexeme}
        </span>
      )
      inputInd += token.length
      tokenInd += 1
    } else {
      lexedInput.push(<span key={inputInd}>{input[inputInd]}</span>)
      inputInd += 1
    }
  }

  return (
    <div id="lexing-ui-container">
      <h3>Lexed code:</h3>
      <p>Hover over a token to see its class.</p>
      <pre className="lexed-input">
        {lexedInput}
        {hoveredToken && hoveredToken.class != "WHITESPACE" &&
          <p
            style={{top: tooltipLoc.y, left: tooltipLoc.x}}
            className="tooltip">{hoveredToken.class}</p>}
      </pre>
    </div>
  )
}
