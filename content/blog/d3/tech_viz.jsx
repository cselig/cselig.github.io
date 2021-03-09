import React from "react"
import * as d3 from "d3"

const identity = (x) => x

export default class TechViz extends React.Component {
  render() {
    return (
      <div id="tech-viz" className="canvas">
        <svg></svg>
      </div>
    )
  }

  componentDidMount() {
    let svg = d3.select("#tech-viz svg")
      .attr("height", 300)
      .attr("width", 350)

    let data = [
      {
        "category": "languages",
        "items": ["js", "rb", "py", "c++", "cljs"]
      },
      {
        "category": "frontend",
        "items": ["js", "react", "cljs", "d3"]
      },
      {
        "category": "backend",
        "items": ["postgres", "rails", "c++", "rb", "flask", "aws", "redis"]
      },
      {
        "category": "data",
        "items": ["d3", "py", "tableau", "spark", "airflow", "sql"]
      },
    ]

    let _categories = []
    let _techs = []
    let categories_lkup = {}
    for (const { category, items } of data) {
      _categories.push(category)
      for (const item of items) {
        _techs.push(item)
        // an item can be in multiple categories
        if (categories_lkup.hasOwnProperty(item)) {
          categories_lkup[item].push(category)
        } else {
          categories_lkup[item] = [category]
        }
      }
    }
    _techs = [...new Set(_techs)]

    // layout doesn't work when M != N
    const M = 4,
          N = 4;

    // index of current category
    let ind = 0

    let techsGroup = svg.append("g")
      .attr("class", "techs")


    const updateCategory = function() {
      const category = _categories[ind % _categories.length]

      _techs.sort((d1, d2) => {
        const isMember = (item) => (+ categories_lkup[item].includes(category))
        return isMember(d2) - isMember(d1)
      })

      const t = techsGroup.transition().duration(500)

      const xFn = (d, i) => 70 * (i % M) + 50
      const yFn = (d, i) => 50 * (Math.floor(i / N)) + 80
      const opacityFn = (d) => categories_lkup[d].includes(category) ? 1 : 0.7
      const fontWeightFn = (d) => categories_lkup[d].includes(category) ? 500 : 300

      techsGroup.selectAll("text")
        .data(_techs, identity)
        .join(
          enter => enter.append("text")
            .attr("class", (d) => categories_lkup[d].join(" "))
            .text(identity)
            .style("opacity", opacityFn)
            .style("font-weight", fontWeightFn)
            .style("cursor", "default")
            .attr("x", xFn)
            .attr("y", yFn)
            // TODO center by calculating width
            .style("transform", (d) => `translate(-${d.length / 4}em)`),
          update => update
            .call(update => update.transition(t)
              .attr("x", xFn)
              .attr("y", yFn)
              .style("opacity", opacityFn)
              .style("font-weight", fontWeightFn)
            ),
          exit => exit.remove(),
        )

      svg.selectAll(".categories text")
        .style("font-weight", (d, i) => i === ind ? 500 : 300)
        .transition().duration(500)
          .style("opacity", (d, i) => i === ind ? 1 : 0.7)

      ind++
    }

    const handleMouseover = function(d, i) {
      // use index so this is composable with setting an interval
      // to cycle categories
      ind = i
      updateCategory()
    }

    svg.append("g")
      .attr("class", "categories")
      .selectAll("text")
      .data(_categories, identity)
      .enter().append("text")
        .attr("class", identity)
        .text(identity)
        .attr("x", (d, i) => 100 * i)
        .attr("y", 20)
        .style("cursor", "default")
        .style("font-size", "18px")
        .style("font-weight", (d, i) => i === ind ? 500 : 300)
        .style("opacity", (d, i) => i === ind ? 1 : 0.7)
        .on("mouseover", handleMouseover)

    updateCategory()
  }
}
