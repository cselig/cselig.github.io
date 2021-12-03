import React, { useState } from "react"
import * as lexerUtils from "./cool_lexer"

import "./styles.scss"

export default function LexingUIContainer() {
  const [input, setInput] = useState("")
  const tokens = lexerUtils.lex(input)
  console.log(tokens)

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

  const onChange = (e) => setInput(e.target.value)
  return (
    <div id="lexing-ui-container">
      <textarea value={input} onChange={onChange}></textarea>
      <pre className="lexed-input">{lexedInput}</pre>
    </div>
  )
}
