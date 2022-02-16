import React, { useState } from "react"
import LexingUIContainer from "./lexing_ui_container"
import ParsingUIContainer from "./parsing_ui_container"
import StaticAnalysisUIContainer from "./static_analysis_ui_container"
import CodeGenerationUIContainer from "./code_generation_ui_container"

import { lex } from "./calculator_lexer"
import { parse } from "./calculator_parser"
import * as examples from "./calculator_examples"

import "./styles.scss"

function Example({ selected, setInput, code, name }) {
  return (
    <div className={"example " + (selected? "selected" : "")} onClick={() => setInput(code)}>
      <p>{name}</p>
    </div>
  )
}

function FocusManager({ parseTree, tokens, input }) {
  const [focusedNodeId, setFocusedNodeId] = useState(null)
  const [showLexing, setShowLexing] = useState(false)
  const [showParsing, setShowParsing] = useState(true)
  const [showStaticAnalysis, setShowStaticAnalysis] = useState(false)
  const [showCodeGen, setShowCodeGen] = useState(true)

  return (
    <div>
      <div className="selectors">
        <button onClick={() => setShowLexing(!showLexing)}>Lexing</button>
        <button onClick={() => setShowParsing(!showParsing)}>Parsing</button>
        <button onClick={() => setShowStaticAnalysis(!showStaticAnalysis)}>Static Analysis</button>
        <button onClick={() => setShowCodeGen(!showCodeGen)}>Code Generation</button>
      </div>
      <div className="compiler-phases">
        {showLexing &&
          <LexingUIContainer tokens={tokens} input={input} />}
        {showParsing &&
          <ParsingUIContainer
            parseTree={parseTree}
            focusedNodeId={focusedNodeId}
            setFocusedNodeId={setFocusedNodeId} />}
        {showStaticAnalysis &&
          <StaticAnalysisUIContainer parseTree={parseTree} />}
        {showCodeGen &&
          <CodeGenerationUIContainer
            parseTree={parseTree}
            focusedNodeId={focusedNodeId} />}
      </div>
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
          {/* <Example
            selected={input === examples.EXAMPLE1}
            setInput={setInput}
            code={examples.EXAMPLE1}
            name="Example 1" key="1" /> */}
          <Example
            selected={input === examples.EXAMPLE2}
            setInput={setInput}
            code={examples.EXAMPLE2}
            name="Sum To" key="2" />
          <Example
            selected={input === examples.EXAMPLE3}
            setInput={setInput}
            code={examples.EXAMPLE3}
            name="Errors" key="3" />
          <Example
            selected={input === examples.EXAMPLE4}
            setInput={setInput}
            code={examples.EXAMPLE4}
            name="Simple" key="4" />
          {/* <Example
            selected={input === examples.EXAMPLE5}
            setInput={setInput}
            code={examples.EXAMPLE5}
            name="Test" key="5" /> */}
        </div>
        <textarea
          value={input}
          onChange={onChange}></textarea>
      </div>
      <FocusManager tokens={tokens} parseTree={parseTree} input={input} />
    </div>
  )
}
