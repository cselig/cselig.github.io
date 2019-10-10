---
layout: post
title: Traversing the Wikipedia Link Graph
date: 2019-10-05 00:00:00 -0800
categories: [blog]
---

Over the course of studying for coding interviews I'd been thinking a lot about topics like complexity analysis and graph traversals, and eventually I got the idea to put these concepts into practice by implementing some searches across the Wikipedia link graph. Of course this had been done [before][rate-with-science], but like any engineer who thinks they have a good idea, I wasn't going to let that stop me.
 <!--excerpt-->

## Representing Wikipedia links as a graph

If we consider every Wikipedia article to be a node in our graph, then links between nodes become edges. Because a link points in one direction from one article to another, we have a **directed** graph.

What other characteristics does our graph have?
* It's large: there are [~6million][wikicount] articles on Wikipedia as of 2019
* It's sparse: most articles are going to have links to a very small subset of all other articles
* It's unweighted
* It's possibly cyclic

What about the number of connected components? Is it possible that there are several large collections of nodes with no path connecting the two islands? It turns out the answer is [no][six-degrees]; amost all Wikipedia articles can be reached by almost all other articles by traversing links.

## Shortest path between nodes

Another interesting question we can ask is what is the shortest path between two articles by following links? Because our graph is unweighted, we can use a simple breadth first search algorithm to find this answer. We begin BFS from our starting node, and once we come across our destination node, we know we've found a shortest path.

Before coding this up I needed to find an already-built representation of the graph, since scraping from the web would take a long time. I came across [Wikicrush][wikicrush], a project to create a representation of the link graph that will fit in memory and allow for fast processing. The format is a large binary file representing a series of integers. Each page is represented by an offset in bytes where it is located in the file, and links are also offsets. We can follow a link by going to that offset in the file. We can load this file into memory as an int array using the following Python code:

```python
import struct

with open('./wikidata/indexbi.bin', 'rb') as f:
    data = f.read()

# read from the bytes stream and interpret as unsigned ints
arr = [x[0] for x in list(struct.iter_unpack('i', data))]
```

We're almost able to code up our BFS, but we first need to think about what output we want. We don't just want to know that there is a path between articles, but also what all the intermediate articles that make up that path actually are. To do this, we need to somehow keep track of the paths our search is traversing.

My initial thought was to store every path explicitly by using a queue of paths rather than a queue of nodes. However this comes with a lot of overhead and its implementation turned out to be very slow.

Another option is as follows: as we visit nodes, mark them with a pointer to their parent. Then when we reach our destination node, we can trace back these pointers and reconstruct the path we found.

It's useful to visualize this idea. One way we can do this is by looking at what happens when we do a BFS through a graph. In the below example, the original graph is on the left and on the right is how our BFS processes the graph (in a search starting from node A).

![](/assets/blog/wiki-link-graph/topological_sort.png){:height="300px" .center}

What we see is that the graph transforms into a tree. Looking at the tree, we can see that it resembles a loose kind of [topological sort][topological-sort].

<!-- where a level of depth N corresponds to the contents of a queue in BFS at breadth N -->

All we need to do now is populate parent pointers in our nodes as we reach them, allowing us to trace the path back up the BFS tree. In our compact array representation of the graph there's one unused int per article, which works perfectly for recording the parent node.

From here, we can code up our BFS. The only tricky thing here is remembering when to convert between the byte offset format and array indices.

```python
def bfs(src: int, dst: int) -> int:  
    assert src != dst

    q = Queue()
    q.put(src)

    # mark start node with parent = -1
    arr[src // 4] = -1

    breadth = 1
    while not q.empty():
        print('breadth, qsize:', breadth, q.qsize())
        for i in range(q.qsize()):
            offset = q.get()
            ind = offset // 4
            num_links = arr[ind + 1]
            link_start_ind = ind + 4
            for i in range(link_start_ind, link_start_ind + num_links):
                to_visit_offset = arr[i]
                # if a node has not had its parent set, it hasn't been visited
                if arr[to_visit_offset // 4] == 0:
                    # mark parent
                    arr[to_visit_offset // 4] = offset
                    if to_visit_offset == dst:
                        print('Path of length %s found' % (breadth + 1))
                        return to_visit_offset
                    # add to queue
                    q.put(to_visit_offset)

        breadth += 1

    print('No path found')
```

We'll also define a utility method for tracing back parent pointers and reconstructing the shortest path.

```python
def trace_path(offset: int) -> List[int]:
    path = []
    path.append(offset)

    # start node denoted with parent = -1
    while arr[offset // 4] != -1:
        offset = arr[offset // 4]
        path.append(offset)

    return path[::-1]
```

Let's try it out!

```python
src = 'Jeff Bezos'
dst = 'Illuminati'

src_offset = title_to_offset(src)
dst_offset = title_to_offset(dst)

offset = bfs(src_offset, dst_offset)
path = trace_path(offset)
[offset_to_title(x) for x in path]
```
```
Path of length 4 found
CPU times: user 2 s, sys: 19.7 ms, total: 2.02 s
Wall time: 2.13 s
['Jeff Bezos',
 'University of Florida',
 'Fraternities and sororities',
 'Illuminati']
```

We found a path between Jeff Bezos and the Illuminati (unsurprisingly), and pretty quickly too. To test out performance for longer shortest paths, I tried out the code on two randomly choosen Wikipedia articles: Craig Evans (an Australian footballer), and *Calliandra conferta* (a species of flowering plants).
```
Path of length 7 found
CPU times: user 58.1 s, sys: 20.3 s, total: 1min 18s
Wall time: 1min 35s
['Craig Evans (Australian footballer)',
 'Grovedale Football Club',
 'Australia',
 'Acacia',
 'Fabaceae',
 'Calliandra',
 'Calliandra conferta']
```

This shortest path was of length 7, and took quite a bit longer to find. There are a couple of ways we might improve this, including bidirectional BFS and rewriting the code in a language other than Python. Both of these ideas I may come back to in the future.


[rate-with-science]: http://ratewithscience.thume.net/
[wikicount]: https://wikicount.net/
[six-degrees]: http://mu.netsoc.ie/wiki/
[wikicrush]: https://github.com/trishume/wikicrush/tree/master
[topological-sort]: https://en.wikipedia.org/wiki/Topological_sorting
