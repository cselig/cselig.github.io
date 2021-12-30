import React, { useState } from "react"
import LexingUIContainer from "./lexing_ui_container"
import ParsingUIContainer from "./parsing_ui_container"
import StaticAnalysisUIContainer from "./static_analysis_ui_container"

import { lex } from "./cool_lexer"
import { parse } from "./cool_parser"

import * as examples from "./cool_examples"


function Example({ selected, setInput, code, name }) {
  return (
    <div className={"example " + (selected? "selected" : "")} onClick={() => setInput(code)}>
      <p>{name}</p>
    </div>
  )
}

export default function RootUIContainer() {
  const [input, setInput] = useState(examples.EXAMPLE2)

  const tokens = lex(input)
  const parseTree = parse(input)
  console.log("parse tree:", parseTree)

  const onChange = (e) => setInput(e.target.value)

  return (
    <div id="root-ui-container">
      <div className="input-container">
        <div className="examples">
          <Example
            selected={input === examples.EXAMPLE1}
            setInput={setInput}
            code={examples.EXAMPLE1}
            name="Example 1" key="1" />
          <Example
            selected={input === examples.EXAMPLE2}
            setInput={setInput}
            code={examples.EXAMPLE2}
            name="Example 2" key="2" />
          <Example
            selected={input === examples.EXAMPLE3}
            setInput={setInput}
            code={examples.EXAMPLE3}
            name="Cyclic Inheritance" key="3" />
          <Example
            selected={input === examples.EXAMPLE4}
            setInput={setInput}
            code={examples.EXAMPLE4}
            name="Redefined Class" key="4" />
        </div>
        <textarea
          value={input}
          onChange={onChange}></textarea>
      </div>
      <LexingUIContainer tokens={tokens} input={input} />
      <ParsingUIContainer parseTree={parseTree} />
      <StaticAnalysisUIContainer parseTree={parseTree} />
    </div>
  )
}
