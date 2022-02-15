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
',' return ','

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
%left '='

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
  : DEF FID '(' params? ')' '{' expr '}'
    {
      $$ = {nodeType: 'function', body: $7, fid: $2, params: $4 || []}
    }
  ;

params
  : VID comma_params*
    {
      $$ = [$1].concat($2)
    }
  ;

comma_params
  : ',' VID
    {
      $$ = $2
    }
  ;

expr
  : FID '(' args? ')'
    {
      $$ = {nodeType: 'expression', expressionType: 'invocation', args: $3 || []}
    }
  | IF expr '=' expr THEN expr ELSE expr FI
    {
      $$ = {
        nodeType: 'expression',
        expressionType: 'if',
        predicateLHS: $2,
        predicateRHS: $4,
        trueBranch: $6,
        falseBranch: $8,
      }
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

args
  : expr comma_args*
    {
      $$ = [$1].concat($2)
    }
  ;

comma_args
  : ',' expr
    {
      $$ = $2
    }
  ;
