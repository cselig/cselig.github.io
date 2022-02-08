import Lexer from "lex"
import { Token, TokenClass } from "./shared"

export function buildCalculatorLexer(): Lexer {
  let i = 0

  const tokenFactory = (tokenClass: TokenClass) => {
    const f = (lexeme) => {
      const token = {
        class: tokenClass,
        start: i,
        length: lexeme.length,
        lexeme: lexeme,
      }
      i += lexeme.length
      if (token.class == TokenClass.UNDEFINED) return undefined
      return token
    }
    return f
  }

  const f = () => {
    return (new Lexer)
      .addRule(/def|if|then|else|fi/, tokenFactory(TokenClass.KEYWORD))
      // An integer is a string of digit.
      .addRule(/\d+/, tokenFactory(TokenClass.INTEGER))
      .addRule(/[a-z][a-zA-Z0-9_]*/, tokenFactory(TokenClass.VID))
      .addRule(/[A-Z][a-zA-Z0-9_]*/, tokenFactory(TokenClass.FID))
      .addRule(/\+|\-|=/, tokenFactory(TokenClass.OPERATOR))
      .addRule(/[;{}(),]/, tokenFactory(TokenClass.PUNCTUATION))
      .addRule(/\s/, tokenFactory(TokenClass.WHITESPACE))
      .addRule(/./, tokenFactory(TokenClass.UNDEFINED))
  }
  return f()
}

export function lex(input: string): Array<Token> {
  const lexer = buildCalculatorLexer()
  lexer.input = input

  let result = []
  while (true) {
    const token = lexer.lex()
    if (token == undefined) break
    result.push(token)
  }
  return result
}
