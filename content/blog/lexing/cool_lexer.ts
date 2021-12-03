import Lexer from "lex"

type Token = {
  class: string,
  start: number,
  length: number
}

function buildCoolLexer(): Lexer {
  let i = 0

  const tokenFactory = (tokenClass) => {
    const f = (lexeme) => {
      console.log("lexeme:", lexeme == "\n")
      const token = {
        class: tokenClass,
        start: i,
        length: lexeme.length,
        lexeme: lexeme,
      }
      i += lexeme.length
      return token
    }
    return f
  }

  const f = () => {
    return (new Lexer)
      .addRule(/\*[\w\s]+\*/, tokenFactory('COMMENT'))
      .addRule(/[\w]+/, tokenFactory('IDENTIFIER'))
      .addRule(/\"[\w]+\"/, tokenFactory('STRING'))
      .addRule(/\s/, tokenFactory('WHITESPACE'))
      .addRule(/./, (lexeme) => {
        i += lexeme.length
        return undefined
      })
  }
  return f()
}

export function lex(input: string): Array<Token> {
  console.log("")
  const lexer = buildCoolLexer();
  lexer.input = input

  let result = []
  while (true) {
    const token = lexer.lex()
    if (token == undefined) break
    result.push(token)
  }
  return result
}
