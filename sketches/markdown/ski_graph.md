---
title: Ski Graphs
date: '2021-01-28'
languages: ['js', 'd3']
hasReactComponent: true
---

I recently went skiing at Heavenly resort in South Lake Tahoe, and the process of studying the trail map and picking
out routes got me thinking about how a ski resort is basically a big directed graph (assuming you stay "on-piste").

This inspired me to make a little widget that would find shortest paths between two points in the resort. The result
is a simplified version of Heavenly that doesn't include the parts that were closed when I was there and
also doesn't include advanced terrain that I can't ski down (yet). The grey edges are the chairlifts, and the other edges
are the runs color-coded by level.

To find a path, click on a start and end node.