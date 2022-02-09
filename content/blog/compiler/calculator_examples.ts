export const EXAMPLE1 = `def Fun() {
  Fun();
  if a = 1 then 1 else 2 fi;
  1 + 2;
  2 - 1;
  a;
  1;
}
`

export const EXAMPLE2 = `def SumTo(x) {
  if x = 0 then
    0
  else
    x + SumTo(x - 1)
  fi;
}`
