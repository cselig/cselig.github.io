---
layout: post
title: Cellular Automata
date: 2020-04-14 00:00:00 -0800
categories: [blog]
---

In light of the unfortunate passing of John Conway I figured what better way to honor his legacy by pouring one out
and coding up some cellular automata.

<!--excerpt-->

<script src="https://d3js.org/d3.v5.min.js"></script>

<script>
let colors = ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];
let arr_sum = (arr) => arr.reduce((a,b) => a + b, 0);
</script>

<style>
/* scrollable code */
pre {
  max-height: 75vh;
}

.canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin:20px;
}

.canvas button {
  font-size: 10px;
}
</style>

First some utilities and shared code (I'll be using D3).

<script>
{% include blog/cellular_automata/utils.js %}
</script>

```js
{% include blog/cellular_automata/utils.js %}
```

### Conway's Game of Life

Displayed are two classic [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) "creatures": one that oscillates in place and one that travels across the board.

<div id="game-of-life" class="canvas">
  <button name="start">Start/Reset</button>
  <svg></svg>
</div>

<script>
// extra curly braces for scoping variables
{ {% include blog/cellular_automata/game_of_life.js %} }
</script>

```js
{% include blog/cellular_automata/game_of_life.js %}
```

### Physical Simulations with CA

I came across [this](https://tomforsyth1000.github.io/papers/cellular_automata_for_physical_modelling.html) interesting post about using
cellular automata to simulate various physical phenomena.

Here's an implementation of 2D fluid flow. It's not very realistic, but could probably be used
to simulate pressure equalization (with darker colors corresponding to higher pressure).

<div id="fluid-flow" class="canvas">
  <button name="start">Start/Reset</button>
  <svg></svg>
</div>

<script>
{ {% include blog/cellular_automata/fluid_flow.js %} }
</script>

```js
{% include blog/cellular_automata/fluid_flow.js %}
```
### To be continued...