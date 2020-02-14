import * as d3 from 'd3';
import './candlestick.css';
import React, {Component} from "react";
import {connect} from "react-redux";

class InfoItem extends Component {
    render() {
        const {id, name, width = 50} = this.props;
        return (
            <div className='infobar-item' style={{width: width}}>
                <div className='infobar-name'>{name}</div>
                <div id={id}/>
            </div>
        );
    }
}

const volumeFormat = d3.format(".2s");

function cschart({width, scale}) {

    var margin = {top: 0, right: 100, bottom: 40, left: 5},
        height = 300, Bheight = 460;

    function csrender(selection) {
        selection.each(function() {

            var minimal  = d3.min(genData, function(d) { return d.LOW; }) * 0.95;
            var maximal  = d3.max(genData, function(d) { return d.HIGH; }) * 1.05;
            console.log('minimal is ' + minimal);
            console.log('maximal is ' + maximal);

            var x = d3.scaleBand()
                .range([0, width - 2]);

            var y = (scale === 'log' ? d3.scaleLog().base(2.71828) : d3.scaleLinear())
                .rangeRound([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d"));

            const count = 10;
            const interval = (maximal - minimal) / count;
            const tickValues = Array.from(Array(count-1).keys()).map(index => (minimal + interval + index * interval).toFixed(1));

            var yAxis = d3.axisLeft()
                .scale(y)
                // .ticks(Math.floor(height/50));
                .tickValues(tickValues);


            x.domain(genData.map(function(d) { return d.TIMESTAMP; }));
            y.domain([minimal, maximal]); //.nice();

            var xtickdelta = Math.ceil(60 / (width / genData.length));
            xAxis.tickValues(x.domain().filter(function(d, i) { return !((i+Math.floor(xtickdelta/2)) % xtickdelta); }));

            var barwidth = x.bandwidth();
            // var candlewidth = Math.floor(d3.min([barwidth*0.8, 13])/2)*2+1;
            var candlewidth = barwidth - 2;
            var delta       = Math.round((barwidth-candlewidth)/2);

            d3.select(this).select("svg").remove();
            var svg = d3.select(this).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", Bheight + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
                .attr("class", "axis xaxis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis.tickSizeOuter(0));

            svg.append("g")
                .attr("class", "axis yaxis")
                .attr("transform", "translate(" + width + ",0)")
                .call(yAxis.tickSize(0));

            svg.append("g")
                .attr("class", "axis grid")
                .attr("transform", "translate(" + width + ",0)")
                .call(yAxis.tickFormat("").tickSize(width).tickSizeOuter(0));


            const drawLine = ({field, className}) => {
                const lineFn = d3.line()
                    .x(function(d) { return x(d.TIMESTAMP) + candlewidth/2; })
                    .y(function(d) { return y(d[field]); });
                svg.append("path")
                    .data([genData])
                    .attr("class", "line " + className)
                    .attr("d", lineFn);
            }

            drawLine({field: 'sma50', className: 'sma50'});
            drawLine({field: 'sma150', className: 'sma150'});
            drawLine({field: 'sma200', className: 'sma200'});

            var bands = svg.selectAll(".bands")
                .data([genData])
                .enter().append("g")
                .attr("class", "bands");

            bands.selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.TIMESTAMP) + Math.floor(barwidth/2); })
                .attr("y", 0)
                .attr("height", Bheight)
                .attr("width", 1)
                .attr("class", function(d, i) { return "band"+i; })
                .style("stroke-width", Math.floor(barwidth));

            var stick = svg.selectAll(".sticks")
                .data([genData])
                .enter().append("g")
                .attr("class", "sticks");

            stick.selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.TIMESTAMP) + Math.floor(barwidth/2); })
                .attr("y", function(d) { return y(d.HIGH); })
                .attr("class", function(d, i) { return "stick"+i; })
                .attr("height", function(d) { return y(d.LOW) - y(d.HIGH); })
                .attr("width", 1)
                .classed("rise", function(d) { return (d.CLOSE>=d.PREV_CLOSE); })
                .classed("fall", function(d) { return (d.PREV_CLOSE>d.CLOSE); });

            var candle = svg.selectAll(".candles")
                .data([genData])
                .enter().append("g")
                .attr("class", "candles");

            candle.selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.TIMESTAMP) + delta; })
                .attr("y", function(d) { return y(d3.max([d.OPEN, d.CLOSE])); })
                .attr("class", function(d, i) { return "candle"+i; })
                .attr("height", function(d) { return y(d3.min([d.OPEN, d.CLOSE])) - y(d3.max([d.OPEN, d.CLOSE])); })
                .attr("width", candlewidth)
                .classed("rise", function(d) { return (d.CLOSE>=d.PREV_CLOSE); })
                .classed("fall", function(d) { return (d.PREV_CLOSE>d.CLOSE); });

        });
    } // csrender

    csrender.Bheight = function(value) {
        if (!arguments.length) return Bheight;
        Bheight = value;
        return csrender;
    };

    return csrender;
} // cschart


function barchart({width}) {

    var margin = {top: 300, right: 30, bottom: 10, left: 5 },
        height = 60, mname = "mbar1";

    var MValue = "TURNOVER";

    function barrender(selection) {
        selection.each(function(data) {

            var x = d3.scaleBand()
                .range([0, width - 2]);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d"));

            var yAxis = d3.axisLeft()
                .scale(y)
                .ticks(Math.floor(height/50));

            var svg = d3.select(this).select("svg")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(data.map(function(d) { return d.TIMESTAMP; }));
            y.domain([0, d3.max(data, function(d) { return d[MValue]; })]).nice();

            var xtickdelta   = Math.ceil(60/(width/data.length))
            xAxis.tickValues(x.domain().filter(function(d, i) { return !((i+Math.floor(xtickdelta/2)) % xtickdelta); }));

            svg.append("g")
                .attr("class", "axis yaxis")
                .attr("transform", "translate(" + width + ",0)")
                .call(yAxis.tickFormat("").tickSize(0));

//      svg.append("g")
//          .attr("class", "axis yaxis")
//          .attr("transform", "translate(0,0)")
//          .call(yAxis.orient("left"));

            var barwidth = x.bandwidth();
            // var fillwidth   = (Math.floor(barwidth*0.9)/2)*2+1;
            var fillwidth   = Math.max(barwidth - 2, 1); // (Math.floor(barwidth*0.9)/2)*2+1;
            var bardelta    = Math.round((barwidth-fillwidth)/2);

            var mbar = svg.selectAll("."+mname+"bar")
                .data([data])
                .enter().append("g")
                .attr("class", mname+"bar");

            mbar.selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("class", mname+"fill")
                .attr("x", function(d) { return x(d.TIMESTAMP) + bardelta; })
                .attr("y", function(d) { return y(d[MValue]); })
                .attr("class", function(d, i) { return mname+i + ' bar'; })
                .attr("height", function(d) { return y(0) - y(d[MValue]); })
                .attr("width", fillwidth)
                .classed("rise", function(d) { return (d.CLOSE>=d.PREV_CLOSE); })
                .classed("fall", function(d) { return (d.PREV_CLOSE>d.CLOSE); });
            ;
        });
    } // barrender
    barrender.mname = function(value) {
        if (!arguments.length) return mname;
        mname = value;
        return barrender;
    };

    barrender.margin = function(value) {
        if (!arguments.length) return margin.top;
        margin.top = value;
        return barrender;
    };

    barrender.MValue = function(value) {
        if (!arguments.length) return MValue;
        MValue = value;
        return barrender;
    };

    return barrender;
} // barchart

function linechart({width, min, max}) {

    var margin = {top: 300, right: 30, bottom: 10, left: 5 },
        height = 60, mname = "mbar1";

    var MValue = "TURNOVER";

    function linerender(selection) {
        selection.each(function(data) {

            var x = d3.scaleBand()
                .range([0, width - 2]);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d"));

            var yAxis = d3.axisLeft()
                .scale(y)
                // .ticks(Math.floor(height/50));
                .tickValues([0, 30, 50, 70, 100]);

            var svg = d3.select(this).select("svg")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(data.map(function(d) { return d.TIMESTAMP; }));

            const yMin = min == null ? 0 : min;
            const yMax = max == null ? d3.max(data, function(d) { return d[MValue]; }) : max;
            y.domain([yMin, yMax]).nice();

            var xtickdelta = Math.ceil(60 / (width / data.length));
            xAxis.tickValues(x.domain().filter(function(d, i) { return !((i+Math.floor(xtickdelta/2)) % xtickdelta); }));

            svg.append("g")
                .attr("class", "axis yaxis")
                .attr("transform", "translate(" + width + ",0)")
                .call(yAxis.tickFormat("").tickSize(0));

//      svg.append("g")
//          .attr("class", "axis yaxis")
//          .attr("transform", "translate(0,0)")
//          .call(yAxis.orient("left"));

            var barwidth = x.bandwidth();
            // var fillwidth   = (Math.floor(barwidth*0.9)/2)*2+1;
            var fillwidth   = barwidth - 2; // (Math.floor(barwidth*0.9)/2)*2+1;
            var bardelta    = Math.round((barwidth-fillwidth)/2);

            var valueline = d3.line()
                .x(function(d) { return x(d.TIMESTAMP) + fillwidth/2; })
                .y(function(d) { return y(d[MValue]); });

            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline);

            svg.append("g")
                .attr("class", "axis grid")
                .attr("transform", "translate(" + width + ",0)")
                .call(yAxis.tickFormat("").tickSize(200).tickSizeOuter(0));

            // var mbar = svg.selectAll("."+mname+"bar")
            //     .data([data])
            //     .enter().append("g")
            //     .attr("class", mname+"bar");
            //
            // mbar.selectAll("rect")
            //     .data(function(d) { return d; })
            //     .enter().append("rect")
            //     .attr("class", mname+"fill")
            //     .attr("x", function(d) { return x(d.TIMESTAMP) + bardelta; })
            //     .attr("y", function(d) { return y(d[MValue]); })
            //     .attr("class", function(d, i) { return mname+i + ' bar'; })
            //     .attr("height", function(d) { return y(0) - y(d[MValue]); })
            //     .attr("width", fillwidth)
            //     .classed("rise", function(d) { return (d.CLOSE>=d.PREV_CLOSE); })
            //     .classed("fall", function(d) { return (d.PREV_CLOSE>d.CLOSE); });
            // ;
        });
    } // barrender
    linerender.mname = function(value) {
        if (!arguments.length) return mname;
        mname = value;
        return linerender;
    };

    linerender.margin = function(value) {
        if (!arguments.length) return margin.top;
        margin.top = value;
        return linerender;
    };

    linerender.MValue = function(value) {
        if (!arguments.length) return MValue;
        MValue = value;
        return linerender;
    };

    return linerender;
} // linechart

function genType(d) {
    d.TIMESTAMP  = parseDate(d.date);
    d.LOW        = +d.low;
    d.HIGH       = +d.high;
    d.OPEN       = +d.open;
    d.CLOSE      = +d.close;
    d.TURNOVER   = +d.volume;
    d.VOLATILITY = +d.volume;
    d.RSI        = +d.rsi;
    d.PREV_CLOSE = +d.previousClose;
    return d;
}

function csheader() {

    function cshrender(selection) {
        selection.each(function(data) {
            var format     = d3.timeFormat("%Y-%m-%d");
            d3.select("#infodate").text(format(data.TIMESTAMP));
            d3.select("#infoopen").text(data.OPEN.toFixed(2));
            d3.select("#infoclose").text(data.CLOSE.toFixed(2));
            d3.select("#infohigh").text(data.HIGH.toFixed(2));
            d3.select("#infolow").text(data.LOW.toFixed(2));
            let delta, deltaP, prefix;
            if (data.PREV_CLOSE) {
                delta = data.CLOSE - data.PREV_CLOSE;
                deltaP = (delta / data.PREV_CLOSE * 100).toFixed(1)
                prefix = delta > 0 ? '+' : '';
            } else {
                delta = 0;
                deltaP = 0;
                prefix = ''
            }
            d3.select("#infodelta").text(`${prefix}${delta.toFixed(2)} (${prefix}${deltaP}%)`);
            d3.select("#infovolume").text(volumeFormat(data.TURNOVER));
        });
    } // cshrender

    return cshrender;
} // csheader

var parseDate    = d3.timeParse("%Y-%m-%d");
var genRaw, genData;
var pointFrom, pointTo;

function mainjs({svg, width, height, scale}) {
    genData = genRaw;
    const attrs = {svg, width, height, scale};
    displayAll(attrs);
}

function displayAll({svg, width, height, scale}) {
    displayCS({svg, width, height, scale});
    displayGen(genData.length-1);
}

function displayCS({svg, width, height, scale}) {
    var chart = cschart({width, height, scale}).Bheight(460);
    svg.call(chart);
    var chart2 = barchart({width, height}).mname("volume").margin(320).MValue("TURNOVER");
    svg.datum(genData).call(chart2);
    // var chart3 = linechart({width, height}).mname("sigma").margin(400).MValue("RSI");
    // svg.datum(genData).call(chart3);
    hoverAll({svg});
}

function hoverAll({svg}) {

    const computeChange = (from, to) => {
        const change = to.CLOSE - from.CLOSE;
        const changePercentage = (change / from.CLOSE * 100).toFixed(1);
        const prefix = change > 0 ? '+' : '';

        d3.select("#infochangerange").text(from.date + ' - ' + to.date);
        d3.select("#infochange").text(`${prefix}${change.toFixed(2)} (${prefix}${changePercentage}%)`);
    };

    svg.select(".bands").selectAll("rect")
        .on('mousedown', function(d, i) {
            pointFrom = d;
            d3.select("#infochangerange").text(d.date + " - ");
            console.log('mousedown d:', d);
        })
        .on('mouseup', function(d, i) {
            computeChange(pointFrom, d);
            pointFrom = null;
        })
        .on("mouseover", function(d, i) {
            if (pointFrom) {
                computeChange(pointFrom, d)
            }

            d3.select(this).classed("hoved", true);
            d3.select(".stick"+i).classed("hoved", true);
            d3.select(".candle"+i).classed("hoved", true);
            d3.select(".volume"+i).classed("hoved", true);
            d3.select(".sigma"+i).classed("hoved", true);
            displayGen(i);
        })
        .on("mouseout", function(d, i) {
            d3.select(this).classed("hoved", false);
            d3.select(".stick"+i).classed("hoved", false);
            d3.select(".candle"+i).classed("hoved", false);
            d3.select(".volume"+i).classed("hoved", false);
            d3.select(".sigma"+i).classed("hoved", false);
            displayGen(genData.length-1);
        });
}

function displayGen(mark) {
    var header      = csheader();
    if (genData.length > 0) {
        d3.select("#infobar").datum(genData.slice(mark)[0]).call(header);
    }
}


class CandleChart extends Component {

    draw() {
        const {width, height, prices, scale} = this.props;
        d3.select(this.canvas.current).select('svg').remove();
        const svg = d3.select(this.canvas.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('overflow', 'visible');
        genRaw = prices.map(d => genType(d));
        mainjs({svg, width, height, scale});

        // d3.json('/price/historical/AMD')
        // // d3.json('/price/historical/BRK.A')
        //     .then(data => {
        //         // console.log('stockdata.csv', data.columns);
        //         genRaw = data.map(d => genType(d));
        //         mainjs({svg, width, height});
        //     })
        //     .catch(error => {
        //         console.log('error', error);
        //     });
    }


    constructor() {
        super();
        this.canvas = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.draw();
    }

    componentDidMount() {
    }

    render() {
        const {ric} = this.props;
        return <div className={'d3js-component candlestick-container'}>
            <div>
                <div id="infobar">
                    <InfoItem id='infodate' name='date' width={90}/>
                    <InfoItem id='infoopen' name='open'/>
                    <InfoItem id='infoclose' name='close'/>
                    <InfoItem id='infohigh' name='high'/>
                    <InfoItem id='infolow' name='low'/>
                    <InfoItem id='infodelta' name='change' width={100}/>
                    <InfoItem id='infovolume' name='volume'/>

                    <div style={{width: 50}}></div>
                    <InfoItem id='infochangerange' name='date' width={170}/>
                    <InfoItem id='infochange' name='date' width={150}/>
                </div>
            </div>
            <div ref={this.canvas} className='candlestick-chart'/>
        </div>
    }


}


const mapStateToProps = state => {
    return {
        ric: state.historical_price.ric,
        prices: state.historical_price.prices,
        scale: state.historical_price.scale
    };
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CandleChart);
