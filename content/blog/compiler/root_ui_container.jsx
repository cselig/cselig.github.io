import React, { useState } from "react"
import LexingUIContainer from "./lexing_ui_container"
import { lex } from "./cool_lexer"
import { parse } from "./cool_parser"

const EXAMPLE1 = `class Example1 {
  sayHello(language: String) : Null {
    if language = "en" then
      print("Hello!")
    else
      print("¡Hola!")
    fi
  };
};`

const EXAMPLE2 = `class B {
  s : String <- "Hello";

  g (y: String) : Int {
    y.concat(s)
  };

  f (x: Int) : Int {
    x + 1
  };
};

class A inherits B {
  a : Int;

  b : B <- new B;

  f(x: Int) : Int {
    x + a
  };
};`

function Example({ selected, setInput, code, name }) {
  return (
    <div className={"example " + (selected? "selected" : "")} onClick={() => setInput(code)}>
      <p>{name}</p>
    </div>
  )
}

export default function RootUIContainer() {
  const [input, setInput] = useState(EXAMPLE1)

  const tokens = lex(input)
  parse(input)

  const onChange = (e) => setInput(e.target.value)

  return (
    <div id="root-ui-container">
      <div className="input-container">
        <div className="examples">
          <Example
            selected={input === EXAMPLE1}
            setInput={setInput}
            code={EXAMPLE1}
            name="Example 1" key="1" />
          <Example
            selected={input === EXAMPLE2}
            setInput={setInput}
            code={EXAMPLE2}
            name="Example 2" key="2" />
        </div>
        <textarea
          value={input}
          onChange={onChange}></textarea>
      </div>
      <LexingUIContainer tokens={tokens} input={input} />
    </div>
  )
}
