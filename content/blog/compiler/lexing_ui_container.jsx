import React, { useState } from "react"

import "./styles.scss"

export default function LexingUIContainer({ tokens, input }) {
  const [hoveredToken, setHoveredToken] = useState(null)
  const [tooltipLoc, setTooltipLoc] = useState(null)

  let lexedInput = []
  let inputInd = 0
  let tokenInd = 0

  const onMouseOver = (e, token) => {
    const spanRect = e.target.getBoundingClientRect()
    const codeRect = e.target.parentElement.getBoundingClientRect()
    setTooltipLoc({
      x: spanRect.x - codeRect.x + spanRect.width + 10,
      y: spanRect.y - codeRect.y - spanRect.height - 4
    })
    setHoveredToken(token)
  }
  const onMouseOut = () => {
    setHoveredToken(null)
    setTooltipLoc(null)
  }

  while (inputInd < input.length) {
    if (tokenInd < tokens.length && inputInd === tokens[tokenInd].start) {
      const token = tokens[tokenInd]
      lexedInput.push(
        <span
          key={inputInd}
          onMouseOver={(e) => onMouseOver(e, token)}
          onMouseOut={onMouseOut}
          className={token.class}>
          {token.lexeme}
        </span>
      )
      inputInd += token.length
      tokenInd += 1
    } else {
      lexedInput.push(
        <span
          class="UNIDENTIFIED"
          onMouseOver={(e) => onMouseOver(e, {class: "ERROR: unrecognized token"})}
          onMouseOut={onMouseOut}
          key={inputInd}>{
          input[inputInd]}
        </span>)
      inputInd += 1
    }
  }

  return (
    <div id="lexing-ui-container">
      <h3>Lexed code:</h3>
      <p>Hover over a token to see its class.</p>
      <pre className="lexed-input">
        {lexedInput}
        {hoveredToken && hoveredToken.class !== "WHITESPACE" &&
          <p
            style={{top: tooltipLoc.y, left: tooltipLoc.x}}
            className="tooltip">{hoveredToken.class}</p>}
      </pre>
    </div>
  )
}
