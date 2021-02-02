import React from "react"
import CodeBlock from "./code_block.js"

const FileNameCodeBlock = ({ code, fileName }) => {
  code = `# ${fileName}\n` + code
  const ext = fileName.split(".").pop()
  return <CodeBlock code={code} language={ext} />
}

export default FileNameCodeBlock
