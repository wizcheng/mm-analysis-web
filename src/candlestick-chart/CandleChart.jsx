import D3jsComponent from "../d3js/D3jsComponent";
import * as d3 from 'd3';
import './candlestick.css';
import React from "react";

function cschart({width}) {

    var margin = {top: 0, right: 100, bottom: 40, left: 5},
        height = 300, Bheight = 460;

    function csrender(selection) {
        selection.each(function() {

            var minimal  = d3.min(genData, function(d) { return d.LOW; });
            var maximal  = d3.max(genData, function(d) { return d.HIGH; });

            var x = d3.scaleBand()
                .range([0, width - 5]);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d"));

            var yAxis = d3.axisLeft()
                .scale(y)
                .ticks(Math.floor(height/50));

            x.domain(genData.map(function(d) { return d.TIMESTAMP; }));
            y.domain([minimal, maximal]).nice();

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
                .range([0, width - 5]);

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
            var fillwidth   = barwidth - 2; // (Math.floor(barwidth*0.9)/2)*2+1;
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

function genType(d) {
    d.TIMESTAMP  = parseDate(d.date);
    d.LOW        = +d.low;
    d.HIGH       = +d.high;
    d.OPEN       = +d.open;
    d.CLOSE      = +d.close;
    d.TURNOVER   = +d.volume;
    d.VOLATILITY = +d.volume;
    d.PREV_CLOSE = +d.previousClose;
    return d;
}

function timeCompare(date, interval) {
    if (interval === "week") {
        return d3.timeMonday(date);
    } else if (interval === "month") {
        return d3.timeMonth(date);
    } else {
        return d3.timeDay(date);
    }
}

function dataCompress(data, interval) {
    var compressedData  = d3.nest()
        .key(function(d) { return timeCompare(d.TIMESTAMP, interval); })
        .rollup(function(v) { return {
            TIMESTAMP:   timeCompare(d3.values(v).pop().TIMESTAMP, interval),
            OPEN:        d3.values(v).shift().OPEN,
            LOW:         d3.min(v, function(d) { return d.LOW;  }),
            HIGH:        d3.max(v, function(d) { return d.HIGH; }),
            CLOSE:       d3.values(v).pop().CLOSE,
            TURNOVER:    d3.mean(v, function(d) { return d.TURNOVER; }),
            VOLATILITY:  d3.mean(v, function(d) { return d.VOLATILITY; })
        }; })
        .entries(data).map(function(d) { return d.values; });

    return compressedData;
}

function csheader() {

    function cshrender(selection) {
        selection.each(function(data) {
            var format     = d3.timeFormat("%Y-%m-%d");
            d3.select("#infodate").text(format(data.TIMESTAMP));
            d3.select("#infoopen").text(data.OPEN);
            d3.select("#infoclose").text(data.CLOSE);
            d3.select("#infohigh").text(data.HIGH);
            d3.select("#infolow").text(data.LOW);

        });
    } // cshrender

    return cshrender;
} // csheader

var parseDate    = d3.timeParse("%Y-%m-%d");
var genRaw, genData;

function mainjs({svg, width, height}) {
    genData = genRaw;
    const attrs = {svg, width, height};
    displayAll(attrs);
}

function displayAll({svg, width, height}) {
    displayCS({svg, width, height});
    displayGen(genData.length-1);
}

function displayCS({svg, width, height}) {
    var chart = cschart({width, height}).Bheight(460);
    svg.call(chart);
    var chart2 = barchart({width, height}).mname("volume").margin(320).MValue("TURNOVER");
    svg.datum(genData).call(chart2);
    var chart3 = barchart({width, height}).mname("sigma").margin(400).MValue("VOLATILITY");
    svg.datum(genData).call(chart3);
    hoverAll({svg});
}

function hoverAll({svg}) {
    svg.select(".bands").selectAll("rect")
        .on("mouseover", function(d, i) {
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
    d3.select("#infobar").datum(genData.slice(mark)[0]).call(header);
}


class CandleChart extends D3jsComponent {

    attributes() {
        return {
            containerClassName: 'candlestick-container',
            svgClassName: "candlestick-chart"
        }
    }

    legend() {
        return <div>
            <div id="infobar">
                <div className='infobar-item' style={{width: 100}}>
                    <div className='infobar-name'>date</div>
                    <div id="infodate"/>
                </div>
                <div className='infobar-item'>
                    <div className='infobar-name'>open</div>
                    <div id="infoopen"/>
                </div>
                <div className='infobar-item'>
                    <div className='infobar-name'>close</div>
                    <div id="infoclose"/>
                </div>
                <div className='infobar-item'>
                    <div className='infobar-name'>high</div>
                    <div id="infohigh"/>
                </div>
                <div className='infobar-item'>
                    <div className='infobar-name'>low</div>
                    <div id="infolow"/>
                </div>
            </div>
        </div>
    }

    draw(svg) {
        const {width, height} = this.props;
        // https://query1.finance.yahoo.com/v7/finance/download/0388.HK?period1=1549724284&period2=1581260284&interval=1d&events=history
        d3.json('/price/historical/1858.HK')
        // d3.json('/price/historical/BRK.A')
            .then(data => {
                // console.log('stockdata.csv', data.columns);
                genRaw = data.map(d => genType(d));
                mainjs({svg, width, height});
            })
            .catch(error => {
                console.log('error', error);
            });

    }

}

export default CandleChart
