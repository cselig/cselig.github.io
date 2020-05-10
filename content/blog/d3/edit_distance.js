import React from "react"
import * as d3 from "d3"

class EditDistance extends React.Component {
  render() {
    return (
      <div id="edit-distance" className="canvas" style={{flexDirection: "column"}}>
        <div>
          <input id="text-update-input" style={{width:"200px"}}/>
          <button id="text-update-submit" style={{width:"100px"}}>Update</button>
        </div>
        <svg></svg>
      </div>
    )
  }

  componentDidMount() {
    let group = d3.select("#edit-distance svg")
      .attr("width", 800)
      .attr("height", 60)
      .append("g")
        .style("transform", "translate(20px, 40px)")
        .style("font-family", "Menlo");

    const update = (letters) => {
      const t = group.transition().duration(750);

      group.selectAll("text")
        .data(letters, d => d)
        .join(
          enter => enter.append("text")
            .attr("fill", "green")
            .attr("y", -50)
            .attr("x", (d, i) => i * 16)
            .style("pointer-events", "none")
            .text(d => d)
            .call(enter => enter.transition(t).attr("y", 0)),
          update => update
            .attr("fill", "black")
            .call(update => update.transition(t)
              .attr("x", (d, i) => i * 16)),
          exit => exit.attr("fill", "red")
            .call(exit => exit.transition(t)
              .attr("y", 50)
              .remove())
      );
    }

    document.getElementById("text-update-submit").onclick = () => {
      let text = document.getElementById("text-update-input").value;
      update(text.split(""));
    };

    // set initial value
    update("the quick brown fox".split(""));
    group.selectAll("text")
      .attr("fill", "black");
  }
}

export default EditDistance