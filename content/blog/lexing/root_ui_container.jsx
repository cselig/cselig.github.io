import React, { useState } from "react"
import LexingUIContainer from "./lexing_ui_container"
import ParsingUIContainer from "./parsing_ui_container"
import { lex } from "./cool_lexer"
import { parse } from "./cool_parser"

export default function RootUIContainer() {
  const [input, setInput] = useState("")

  console.log("")
  const tokens = lex(input)
  console.log("tokens:", tokens)
  const parse_tree = parse(input)

  const onChange = (e) => setInput(e.target.value)

  return (
    <div id="root-ui-container">
      <textarea value={input} onChange={onChange}></textarea>
      <LexingUIContainer tokens={tokens} input={input} />
      <ParsingUIContainer />
    </div>
  )
}
