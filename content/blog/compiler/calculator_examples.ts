export const EXAMPLE2 = `def SumTo(x) {
  if x = 0 then
    0
  else
    x + SumTo(x - 1)
  fi
}

def Main() {
  SumTo(10)
}`

export const EXAMPLE3 = `def Fun(x, x) {
  if a = 1 then 1 else 2 fi
}

def Fun() {
  Fun(1)
}`