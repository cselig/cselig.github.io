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
':' return ':'
',' return ','
'@' return '@'
'.' return '.'

// operators
'+' return '+'
'-' return '-'
'*' return "*"
'/' return '/'
'~' return '~'
"<-" return '<-'
'<' return '<'
"<=" return '<='
'=' return '='

// keywords
"class" return 'CLASS'
"inherits" return 'INHERITS'
"if" return 'IF'
"then" return 'THEN'
"else" return 'ELSE'
"fi" return 'FI'
"while" return 'WHILE'
"loop" return 'LOOP'
"pool" return 'POOL'
"let" return 'LET'
"in" return 'IN'
"case" return 'CASE'
"of" return 'OF'
"esac" return 'ESAC'
"isvoid" return 'ISVOID'
"new" return 'NEW'
"not" return 'NOT'

// identifiers
[A-Z][a-zA-Z0-9_]* return 'TYPE'
[a-z][a-zA-Z0-9_]* return 'ID'

// literals
\".+\" return 'STRING'
[0-9]+  return 'INTEGER'
"true"  return 'TRUE'
"false" return 'FALSE'
// TODO: string

<<EOF>> return 'EOF'


/lex

%{
let allClasses = []
%}

// enable extended BNF syntax (for repetition operators)
%ebnf

/* operator associations and precedence */
// %nonassoc ';'
%left '+' '-'
%left '*' '/'

// start symbol
%start program

%% /* language grammar */

program
  : (class ';')+ EOF
    { 
      return {nodeType: 'program', classes: $1};
    }
  ;

class
  : CLASS TYPE inherits? '{' (feature ';')* '}'
    {
      $$ = {
        nodeType: 'class', className: $2, features: $5, type: $2,
        classParent: $3,
      }
    }
  ;

inherits
  : INHERITS TYPE
    {
      $$ = $2
    }
  ;

feature
  // method
  : ID '(' formal? comma_formal* ')' ':' TYPE '{' expr '}'
    {
      params = []
      if ($3 != undefined) params.push($3)
      params = params.concat($4)
      $$ = {nodeType: 'method', name: $1, body: $9, params: params}
    }
  // attribute
  | formal ('<-' expr)?
    {
      $$ = {nodeType: 'attribute', name: $1.name, type: $1.type}
    }
  ;

comma_formal
  : ',' formal
    {
      $$ = $2
    }
  ;

formal
  : ID ':' TYPE
    {
      $$ = {nodeType: 'formal', name: $1, type: $3}
    }
  ;

expr
  : ID '<-' expr
  // dispatch
  | expr ('@' TYPE)? '.' ID '(' expr? (',' expr)* ')'
  | ID '(' expr? (',' expr)* ')'
  // if statement
  | IF expr THEN expr ELSE expr FI
    {
      $$ = {nodeType: 'expression', expressionType: 'if'}
    }
  // while loop
  | WHILE expr LOOP expr POOL
  | '{' (expr ';')+ '}'
  | LET ID ':' TYPE ('<-' expr)? (',' ID ':' TYPE ('<-' expr)?)* IN expr
  // should be => or <- below?
  | CASE expr OF (ID ':' TYPE '=>' expr ';')+ ESAC
  | NEW TYPE
  | ISVOID expr
  | expr '+' expr
  {
    $$ = {nodeType: 'expression', operator: '+', lhs: $1, rhs: $3}
  }
  | expr '-' expr
  | expr '*' expr
  | expr '/' expr
  | '~' expr
  | expr '<' expr
  | expr '<=' expr
  | expr '=' expr
  | NOT expr
  | '(' expr ')'
  | ID
  {
    $$ = {nodeType: 'identifier', value: $1}
  }
  | STRING
  | INTEGER
  | TRUE
  | FALSE
  ;
