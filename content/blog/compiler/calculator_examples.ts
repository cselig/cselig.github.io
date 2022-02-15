export const EXAMPLE1 = `def Fun() {
  if a = 1 then 1 else 2 fi
}

def Main() {
  Fun()
}
`

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
