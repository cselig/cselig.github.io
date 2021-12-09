import Lexer from "lex"
import { Token, TokenClass } from "./shared"

export function buildCoolLexer(): Lexer {
  let i = 0
  let comment = false

  const tokenFactory = (tokenClass: TokenClass) => {
    const f = (lexeme) => {
      const token = {
        class: comment ? TokenClass.COMMENT : tokenClass,
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
      // A double dash starts a comment for the rest of the line.
      .addRule(/--/, function(lexeme) {
        comment = true
        this.reject = true
      })
      // Anything between ** is a comment.
      .addRule(/\*[\w\s]*\*/, tokenFactory(TokenClass.COMMENT))
      .addRule(/class|inherits|if|then|else|fi|while|loop|pool|let|in|case|of|esac|isvoid|new|not/, tokenFactory(TokenClass.KEYWORD))
      // This is a simplified COOL string (no escaped quotes).
      .addRule(/\"[^\"]+\"/, tokenFactory(TokenClass.STRING))
      // An integer is a string of digit.
      .addRule(/\d+/, tokenFactory(TokenClass.INTEGER))
      // An identifier starts with a letter and can contain letters, numbers, and underscores.
      .addRule(/[a-z][a-zA-Z0-9_]*/, tokenFactory(TokenClass.IDENTIFIER))
      .addRule(/[A-Z][a-zA-Z0-9_]*/, tokenFactory(TokenClass.TYPE))
      .addRule(/\n/, (lexeme) => {
        comment = false
        return tokenFactory(TokenClass.WHITESPACE)(lexeme)
      })
      .addRule(/\+|\-|\*|\/|<-|=/, tokenFactory(TokenClass.OPERATOR))
      .addRule(/[;{}():,.]/, tokenFactory(TokenClass.PUNCTUATION))
      .addRule(/\s/, tokenFactory(TokenClass.WHITESPACE))
      .addRule(/./, tokenFactory(TokenClass.UNDEFINED))
  }
  return f()
}

// Only returns token class
export function buildJisonCoolLexer() {
  const lexer = buildCoolLexer()
  const f = () => ({
    setInput: (input) => lexer.input = input,
    lex: () => {
      const token = lexer.lex()
      if (token == undefined) return token
      return token.class
    },
  })
  return f()
}

export function lex(input: string): Array<Token> {
  const lexer = buildCoolLexer()
  lexer.input = input

  let result = []
  while (true) {
    const token = lexer.lex()
    if (token == undefined) break
    result.push(token)
  }
  return result
}
