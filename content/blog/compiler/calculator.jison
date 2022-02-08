/* description: Parses the COOL language. */

/* lexical grammar */
%lex
%%

\s+ /* skip whitespace */

// puncuation
';' return ';'
'{' return '{'
'}' return '}'
'(' return '('
')' return ')'
// ':' return ':'
',' return ','
// '@' return '@'
// '.' return '.'

// operators
'+' return '+'
'-' return '-'
'=' return '='

// keywords
"def" return 'DEF'
"if" return 'IF'
"then" return 'THEN'
"else" return 'ELSE'
"fi" return 'FI'

// identifiers:
[A-Z][a-zA-Z0-9_]* return 'FID' // function IDs start with uppercase
[a-z][a-zA-Z0-9_]* return 'VID' // variable IDs start with lowercase

// literals
[0-9]+  return 'INTEGER'

<<EOF>> return 'EOF'


/lex

// enable extended BNF syntax (for repetition operators)
%ebnf

/* operator associations and precedence */
%left '+' '-'

// start symbol
%start program

%% /* language grammar */

program
  : function+ EOF
    {
      return {nodeType: 'program', functions: $1};
    }
  ;

function
  : DEF FID '(' ')' '{' (expr ';')+ '}'
    {
      $$ = {nodeType: 'function', body: $6, fid: $2}
    }
  ;

expr
  : VID '=' expr
    {
      $$ = {nodeType: 'expression', expressionType: 'vinit'}
    }
  | FID '(' expr? (',' expr)* ')'
    {
      $$ = {nodeType: 'expression', expressionType: 'invocation'}
    }
  // if statement: expr1 >= 0 -> THEN, expr1 < 0 -> ELSE
  | IF expr THEN expr ELSE expr FI
    {
      $$ = {nodeType: 'expression', expressionType: 'if'}
    }
  | expr '+' expr
    {
      $$ = {nodeType: 'expression', expressionType: '+', lhs: $1, rhs: $3}
    }
  | expr '-' expr
    {
      $$ = {nodeType: 'expression', expressionType: '-', lhs: $1, rhs: $3}
    }
  | VID
    {
      $$ = {nodeType: 'expression', expressionType: 'vid', value: $1}
    }
  | INTEGER
    {
      $$ = {nodeType: 'expression', expressionType: 'literal', value: $1}
    }
  ;
