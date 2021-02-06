import React from "react"
import * as d3 from "d3"

import * as graphUtils from "../../../src/js/graphs.js"

const delay = 500
const fadeInText  = () => d3.select(".bfs-ui .text").transition().duration(delay).style("opacity", 1)
const fadeOutText = () => d3.select(".bfs-ui .text").transition().duration(delay).style("opacity", 0)

class BfsUI extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchStart: null,
      searchEnd: null,
    }
  }

  componentDidMount() {
    const handleNodeClick = (_, i, nodes) => {
      console.log("bfs node click")

      // this is a pretty clumsy way to do animations but it's simple enough in this case.
      if (this.state.searchStart == null) {
        fadeOutText()
        setTimeout(
          () => {
            this.setState({searchStart: i})
            fadeInText()
          },
          delay
        )
      } else if (this.state.searchEnd == null) {
        fadeOutText()
        setTimeout(
          // fading the text back in is handled in a callback after the animation is finished
          () => this.setState({searchEnd: i}),
          delay
        )
      }
      console.log(nodes[i])
      d3.select(nodes[i]).select("circle").style("fill", "red")
    }

    this.props.setNodeClickHandler(handleNodeClick)
  }

  render() {
    const reset = () => {
      this.setState({searchStart: null, searchEnd: null})
      d3.selectAll("g.node circle").style("fill", "black")
      d3.selectAll("g.node").transition().duration(500).style("opacity", 1)
      d3.selectAll("g.edge").transition().duration(500).style("opacity", 1)
    }

    let displayText
    let onTextClick
    let textClass = "text"
    if (this.state.searchStart === null) {
      displayText = "Pick start"
    } else if (this.state.searchEnd === null) {
      displayText = "Pick end"
    } else {
      const [_, path] = graphUtils.bfs(this.state.searchStart,
                                       this.state.searchEnd,
                                       this.props.edges,
                                       this.props.nodes)
      graphUtils.highlightPath(path, () => setTimeout(fadeInText, 500))
      displayText = "Reset"
      onTextClick = reset
      textClass += " reset-button"
    }

    return (
      <div className="bfs-ui">
        <p
          onClick={onTextClick}
          className={textClass}
        >{displayText}</p>
      </div>
    )
  }
}

export default BfsUI
