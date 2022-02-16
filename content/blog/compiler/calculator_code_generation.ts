export default function generateCode(parseTreeRoot) {
  let code: Array<Array<any>> = [] // [[line, nodeId]]
  for (const node of parseTreeRoot.functions) {
    generateFunctionCode(node, code)
  }
  return code
}

function generateFunctionCode(node, code: Array<Array<any>>) {
  code.push([`label: ${node.fid}`, node])
  code.push([`mv $fp $sp`, node])
  code.push([`sw $ra 0($sp)`, node])
  code.push([`addiu $sp $sp -4`, node])
  generateExpressionCode(node.body, code)
  code.push([`lw $ra 4($sp)`, node])
  const nParams = node.params.length
  const nStackWords = 2 + nParams // fp + ra + params
  code.push([`addiu $sp $sp ${nStackWords * 4}`, node])
  code.push([`lw $fp 0($sp)`, node])
  code.push([`jr $ra`, node])
}

function generateExpressionCode(node, code: Array<Array<any>>) {
  switch (node.expressionType) {
    case "+":
      generateExpressionCode(node.lhs, code)
      code.push([`sw $a0 0($sp)`, node])
      code.push([`addiu $sp $sp -4`, node])
      generateExpressionCode(node.rhs, code)
      code.push([`lw $t1 4($sp)`, node])
      code.push([`add $a0 $a0 $t1`, node])
      code.push([`addiu $sp $sp 4`, node])
      break
    case "literal":
      code.push([`li $a0 ${node.value}`, node])
      break
  }
}
