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
  : CLASS TYPE (INHERITS TYPE)? '{' (feature ';')* '}'
    {
      $$ = {nodeType: 'class', className: $2, features: $5}
    }
  ;

feature
  // method
  : ID '(' formal? (',' formal)* ')' ':' TYPE '{' expr '}'
    {
      $$ = {nodeType: 'method', name: $1, body: $9}
    }
  | formal ('<-' expr)?
    {
      $$ = {nodeType: 'attribute', id: $1.id, type: $1.type}
    }
  ;

formal
  : ID ':' TYPE
    {
      $$ = {nodeType: 'formal', id: $1, type: $3}
    }
  ;

expr
  : ID '<-' expr
  // method calls
  | expr ('@' TYPE)? '.' ID '(' expr? (',' expr)* ')'
  | ID '(' expr? (',' expr)* ')'
  // if statement
  | IF expr THEN expr ELSE expr FI
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
    $$ = {nodeType: 'expr', operator: '+', lhs: $1, rhs: $3}
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
