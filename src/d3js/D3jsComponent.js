import React, {Component} from 'react';
import * as d3 from 'd3';
import './d3js-component.css';

class D3jsComponent extends Component {

    constructor() {
        super();
        this.canvas = React.createRef();
    }

    componentDidMount() {
        const {width, height} = this.props;
        const svg = d3.select(this.canvas.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        this.draw(svg);
    }

    render() {
        const {
            containerClassName = "",
            svgClassName = ""
        } = this.attributes();
        return <div className={'d3js-component ' + containerClassName}>
            {this.legend()}
            <div ref={this.canvas} className={svgClassName}/>
        </div>
    }

}

export default D3jsComponent;

