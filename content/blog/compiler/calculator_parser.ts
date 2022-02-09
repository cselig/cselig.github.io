import { addIds, doublyLinkTree } from "./parse_tree_utils"

export function parse(input: string) {
  if (input == "") return

  const parser = require('./generated_calculator_parser').parser

  try {
    const parseTree = parser.parse(input)
    addIds(parseTree)
    doublyLinkTree(parseTree)
    return parseTree
  } catch (e) {
    console.log("%c" + e.message, "color: red")
    return {error: e.message}
  }
}
