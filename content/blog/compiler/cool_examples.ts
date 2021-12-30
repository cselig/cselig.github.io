export const EXAMPLE1 = `class Example1 {
  sayHello(language: String) : Null {
    if language = "en" then
      print("Hello!")
    else
      print("¡Hola!")
    fi
  };
};`

export const EXAMPLE2 = `class B {
  s : String <- "Hello";

  g (y: String, x: Int) : Int {
    y.concat(s)
  };

  f (x: Int) : Int {
    x + 1
  };
};

class A inherits B {
  a : Int;

  b : B <- new B;

  f(x: Int) : Int {
    x + a
  };
};`

export const EXAMPLE3 = `class A inherits C {};

class B inherits A {};

class C inherits B {};`

export const EXAMPLE4 = `class A {};

class A {};`