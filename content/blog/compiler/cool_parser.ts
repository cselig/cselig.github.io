export function parse(input: string) {
  if (input == "") return

  const parser = require('./generated_parser').parser

  try {
    const parseTree = parser.parse(input)
    console.log("parseTree:", parseTree)
    // console.log("classes:", parseTree.classes)
  } catch (e) {
    console.log("%c" + e.message, "color: red")
  }
}
