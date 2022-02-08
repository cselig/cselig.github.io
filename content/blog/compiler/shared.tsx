// export enum CoolTokenClass {
//   COMMENT = "COMMENT",
//   IDENTIFIER = "IDENTIFIER",
//   TYPE = "TYPE",
//   STRING = "STRING",
//   INTEGER = "INTEGER",
//   WHITESPACE = "WHITESPACE",
//   UNDEFINED = "UNDEFINED",
//   OPERATOR = "OPERATOR",
//   PUNCTUATION = "PUNCTUATION",
//   KEYWORD = "KEYWORD",
// }

export enum TokenClass {
  VID = "VID",
  FID = "FID",
  INTEGER = "INTEGER",
  WHITESPACE = "WHITESPACE",
  UNDEFINED = "UNDEFINED",
  OPERATOR = "OPERATOR",
  PUNCTUATION = "PUNCTUATION",
  KEYWORD = "KEYWORD",
}

export type Token = {
  class: TokenClass,
  start: number,
  length: number
}
