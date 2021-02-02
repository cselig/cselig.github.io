import React from "react"

import ExpandableCodeBlockMulti from "./expandable_code_block_multi.js"

const ExpandableCodeBlock = ({ filePath }) => {
  return <ExpandableCodeBlockMulti filePaths={[filePath]} />
}

export default ExpandableCodeBlock
