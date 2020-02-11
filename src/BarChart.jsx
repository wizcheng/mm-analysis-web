import React, {Component} from 'react';
import * as d3 from 'd3';
import D3jsComponent from "./d3js/D3jsComponent";

class BarChart extends D3jsComponent {

    draw(svg) {

        const {height, data} = this.props;
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => height - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");

        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => height - (10 * d) - 3)


    }


}

export default BarChart;

