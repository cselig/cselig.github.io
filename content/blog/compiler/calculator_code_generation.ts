import { getParentFunction } from "./parse_tree_utils"

type Code = Array<[string, object]>

let code: Code = [] // [[line, nodeId]]

export default function generateCode(parseTreeRoot) {
  code = []
  for (const node of parseTreeRoot.functions) {
    generateFunctionCode(node)
  }
  return code
}

function generateFunctionCode(node) {
  code.push([`label: ${node.fid}`, node])
  code.push([`mv $fp $sp`, node])
  code.push([`sw $ra 0($sp)`, node])
  code.push([`addiu $sp $sp -4`, node])
  generateExpressionCode(node.body)
  code.push([`lw $ra 4($sp)`, node])
  const nParams = node.params.length
  const nStackWords = 2 + nParams // fp + ra + params
  code.push([`addiu $sp $sp ${nStackWords * 4}`, node])
  code.push([`lw $fp 0($sp)`, node])
  code.push([`jr $ra`, node])
}

function generateExpressionCode(node) {
  switch (node.expressionType) {
    case "invocation":
      code.push([`sw $fp 0($sp)`, node])
      code.push([`addiu $sp $sp -4`, node])
      for (let i = node.args.length - 1; i >= 0; i--) {
        generateExpressionCode(node.args[i])
        code.push([`sw $a0 0($sp)`, node])
        code.push([`addiu $sp $sp -4`, node])
      }
      code.push([`jal ${node.fid}`, node])
      break;
    case "+":
      generateExpressionCode(node.lhs)
      code.push([`sw $a0 0($sp)`, node])
      code.push([`addiu $sp $sp -4`, node])
      generateExpressionCode(node.rhs)
      code.push([`lw $t1 4($sp)`, node])
      code.push([`add $a0 $a0 $t1`, node])
      code.push([`addiu $sp $sp 4`, node])
      break
    case "-":
      generateExpressionCode(node.lhs)
      code.push([`sw $a0 0($sp)`, node])
      code.push([`addiu $sp $sp -4`, node])
      generateExpressionCode(node.rhs)
      code.push([`lw $t1 4($sp)`, node])
      code.push([`sub $a0 $a0 $t1`, node])
      code.push([`addiu $sp $sp 4`, node])
      break
    case "literal":
      code.push([`li $a0 ${node.value}`, node])
      break
    case "vid":
      const z = getParentFunction(node).params.indexOf(node.value) * 4
      code.push([`lw $a0 ${z}($fp)`, node])
      break
    case "if":
      generateExpressionCode(node.predicateLHS)
      code.push([`sw $a0 0($sp)`, node])
      code.push([`addiu $sp $sp -4`, node])
      generateExpressionCode(node.predicateRHS)
      code.push([`lw $t1 4($sp)`, node])
      code.push([`addiu $sp $sp 4`, node])
      code.push([`beq $a0 $t1 true_branch`, node])
      code.push([`label: false_branch`, node])
      generateExpressionCode(node.falseBranch)
      code.push([`b end_if`, node])
      code.push([`label: true_branch`, node])
      generateExpressionCode(node.trueBranch)
      code.push([`label: end_if`, node])
  }
}
