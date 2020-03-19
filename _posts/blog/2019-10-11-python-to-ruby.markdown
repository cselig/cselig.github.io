---
layout: post
title: From Python to Ruby
date: 2019-10-11 00:00:00 -0800
categories: [blog]
---

As I embark on learning Ruby for my new job, I thought it would be useful as someone coming from a Python background to document what struck me when I compared the two languages. The tldr: really not as bad as I thought it would be.
 <!--excerpt-->

## Lots of nice shortcuts

Ruby provides a ton of shortcuts to carry out common tasks.

### Loops and Iteration

In Python, the <code>for</code> (and sometimes <code>while</code>) loop will take you quite far. The <code>for</code> loop goes through an "iterable", which could be a range of numbers, list, etc. Iterables are an important and central concept in Python.

In Ruby there's a wide variety of mechanisms to achieve looping, each with its own flavor and use cases. See the following code for examples:

```ruby
# rb
3.times {puts "Ruby!"}

for i in 1..3 do
    puts i
end

3.downto(1) {|i| puts i}
```

Each one of these mechanisms achieves the same thing: repeating a code block 3 times. But each has a slightly different meaning. Because of things like this it seems that in Ruby there's more room for writing expressive code, a concept which to me means the code conveys a certain subtlety of intention.

For enumerable objects, there's yet another iteration mechanism: <code>each</code>.

```ruby
# rb
arr = [1, 2, 3, 4]
arr.each {|x| puts x * 2}

hash = {key1: "val1", key2: "val2"}
hash.each {|k, v| print "#{k}, #{v}\n"}
```
```
2
4
6
8
key1, val1
key2, val2
```

### Pipelines

Ruby seems generally better suited for "pipeline" programming:

```ruby
# rb
arr = [1, 2, 3, 4]
arr.map {|x| x ** 2}.select {|x| x % 2 == 0}.each {|x| puts x}
```
```
4
16
```

This is super awesome coming from Python, where often similarly simple code had to be spread over multiple lines in the form of comprehensions, method calls, and other transformations.

The above code doesn't modify the array, but what if I wanted to have my <code>map</code> step modify the array in place (but maybe not my <code>select</code> step)? This bring us to...

### Bang Methods

Many Ruby classes define pairs of methods <code>method_name</code> and <code>method_name!</code>, the latter generally meaning that the operation is performed in-place. For example, the following code is equivalent:

```python
# py
arr = [1, 2, 3, 4]
new_arr = arr[::-1]
arr.reverse()
```

```ruby
# rb
arr = [1, 2, 3, 4]
new_arr = arr.reverse
arr.reverse!
```

To achieve this in Python, we have to use two completely different concepts: a function call and sequence slicing. In my mind, the Ruby way of doing this is more intuitive.

In addition, there's an interesting characteristic of (I think most?) bang methods: they return a copy of the object after the operation. This means our above code could also be:

```ruby
# rb
arr = [1, 2, 3, 4]
new_arr = arr.reverse!
```

However there's a strange edge case here: if the object is not modified by the operation, it sometimes **will not** return a copy. This isn't the case with Array's <code>reverse</code>, but it is the case with String's <code>downcase</code>.

```ruby
#rb
string = 'hello'
new_string = string.downcase!

puts 'nil' unless new_string
puts string
```
```
nil
hello
```

We can see that <code>nil</code> (Ruby's null value, same as <code>None</code> in Python) was returned instead of a copy of the string. This means there's definitely some things to be wary of if you want to exploit this feature in your Ruby code.

<code>unless</code>, by the way, doesn't exist in Python and is basically the opposite of <code>if</code>.

### Everything is an expression

In some languages (like Python), there is a distinction between expressions which produce a value and statements (e.g. control flow). In Ruby there is no such distinction. Everything is an expression, which means that everything produces a value.

One example of this is <code>if</code> / <code>else</code>: the value returned by <code>if</code> is the value of the code block executed.

```ruby
# rb
x = 3

s = if x == 1 then "one"
elsif x == 2 then "two"
elsif x == 3 then "three"
else "other"
end

puts s
```
```
three
```

Another example is assignment. An assignment expression evaluates to the right-hand value of the statement, which is the reason why the following code works.

```ruby
# rb
x = y = 0
```

This is equivalent to:

```ruby
# rb
x = (y = 0)
```

This concept should be familiar to C programmers; the following pattern is used quite a bit.

```c
// c
char string[] = "abc";

char c;
// assumes the string is null-terminated
for (int i = 0; (c = string[i]); i++) {
    printf("%c", c);
}
```

## Other Differences

### Truthy and Falsey Values

In contrast to Python, in Ruby only <code>false</code> and <code>nil</code> are falsey. All others (0, empty lists/hashes, empty string) are considered truthy.

### Mutable Strings 😱

However, symbols (essentially just immutable strings) exist and are often used as the keys of hashes.

### Single vs Double quotes

Single quoted strings in Ruby are raw, and double quoted strings allow for escape sequences and string interpolation.

```ruby
# rb
a = "my"
b = "string"

puts 'This is\n#{a} #{b}'
puts
puts "This is\n#{a} #{b}"
```
```
This is\n#{a} #{b}

This is
my string
```

### <code>and</code> and <code>&&</code>

Python's logical <code>and</code> and <code>or</code> directly translate to Ruby's <code>&&</code> and <code>||</code>. However, Ruby also has <code>and</code> and <code>or</code>. The caution here is that these are not two different ways of spelling the same operator: <code>and</code> and <code>or</code> actually have lower precedence than <code>&&</code> and <code>||</code>. I've seen in some style guides that it's best to just ignore the English versions and use <code>&&</code> and <code>||</code>.

<br>

### To be continued...
