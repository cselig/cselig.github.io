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

// operators
'+' return '+'
'-' return '-'
'*' return "*"
'/' return '/'
'~' return '~'
"<-" return '<-'
'<' return '<'
"<=" return '<='

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
[0-9]+  return 'INTEGER'
"true" return 'TRUE'
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
      return {type: 'program', classes: $1};
    }
  ;

class
  : CLASS TYPE (INHERITS TYPE)? '{' (feature ';')* '}'
    {
      $$ = {type: 'class', className: $2}
    }
  ;

feature
  // method
  : ID '(' formal? (',' formal)* ')' ':' TYPE '{' expr '}'
  | formal ('<-' expr)?
  ;

formal
  : ID ':' TYPE
  ;

expr
  : ID '<-' expr
  // method call
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
  | INTEGER
  | TRUE
  | FALSE
  ;
