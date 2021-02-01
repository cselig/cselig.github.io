import React from "react"
import CodeBlock from "./code_block.js"

const MarkdownCodeBlock = ({ children, className }) => {
  const language = className ? className.replace(/language-/, '') : "javascript"
  return <CodeBlock code={children} language={language} />
}

export default MarkdownCodeBlock
