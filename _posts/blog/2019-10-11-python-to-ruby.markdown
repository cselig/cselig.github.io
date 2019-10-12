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

### Bang Methods

One example is the <code>!</code> operator for performing operations in-place. For example, the following code is equivalent:

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

## Other differences

### Truthy and Falsey values

In contrast to Python, in Ruby only <code>false</code> and <code>nil</code> are falsey. All others (0, empty lists/hashes, empty string) are considered truthy.

### Mutable Strings 😱

<br>

### To be continued...
