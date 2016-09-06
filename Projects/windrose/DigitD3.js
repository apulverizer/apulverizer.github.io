function drawWindRose(node, data, width, height) {
    // helper function to convert test data to a more friendly format
    var convert_data = function (width, height, data) {
        var output_data = [];
        // for each direction, split it into 4 new elements which will be used to render rectangles
        data.forEach(function (element) {
            output_data.push({
                dir: element.dir,
                start: 0,
                originX: width / 2,
                originY: height / 2,
                width: 5,
                value: element.low,
                color: "rgb(94,79,162)"
            });
            output_data.push({
                dir: element.dir,
                start: element.low,
                originX: width / 2,
                originY: height / 2,
                width: 10,
                value: element.medium,
                color: "rgb(193,228,157)"
            });
            output_data.push({
                dir: element.dir,
                start: element.low + element.medium,
                originX: width / 2,
                originY: height / 2,
                width: 15,
                value: element.high,
                color: "rgb(253,192,108)"
            });
            output_data.push({
                dir: element.dir,
                start: element.low + element.medium + element.high,
                originX: width / 2,
                originY: height / 2,
                width: 20,
                value: element.extraHigh,
                color: "rgb(158,1,66)"
            });
        });
        return output_data;
    };
    // scale the rectangles based on the size of the svg area
    var inner_width = width - 50;
    var inner_height = width - 50;
    var scale = width / 100 / (3 / 4); // scale was based on 100 -> 20 so if
    // incremental_radius is width divided by 20, then scale is width divided by 100
    // the size of the radius to increment by for the concentric circles
    var incremental_radius = inner_width / 15;

    data = convert_data(inner_width, inner_height, data);

    // data for the circle
    var circle_data = [{
        r: 6 * incremental_radius,
        label: "N",
        dir: Math.PI / 2,
        offsetY: -10,
        offsetX: -7.5
    }, {
        r: 6 * incremental_radius,
        label: "S",
        dir: 3 * Math.PI / 2,
        offsetX: -7.5,
        offsetY: 20
    }, {
        r: 6 * incremental_radius,
        label: "E",
        dir: 0,
        offsetX: 5,
        offsetY: 0

    }, {
        r: 6 * incremental_radius,
        label: "W",
        dir: Math.PI,
        offsetX: -25,
        offsetY: 0
    }, {
        r: incremental_radius,
        label: "0%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 2 * incremental_radius,
        label: "5%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 3 * incremental_radius,
        label: "10%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 4 * incremental_radius,
        label: "15%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 5 * incremental_radius,
        label: "20%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 6 * incremental_radius,
        label: "25%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }];
    // append an svg to the specified node
    var svg = d3.select(node).append("svg").attr({
        width: width,
        height: height
    });
    svg.style("margin","0 auto")
    svg.style("display", "block")
    // draw the circles
    var circles = svg.selectAll("circle")
        .data(circle_data)
        .enter()
        .append("circle");
    circles.attr({
        cx: inner_width / 2,
        cy: inner_height / 2,
        r: function (d) {
            return d.r;
        },
        fill: "none",
        stroke: "black"
    });
    // write the text values for the circle percentages
    var texts = svg.selectAll("text")
        .data(circle_data)
        .enter()
        .append("text");
    texts
        .attr("x", function (d) {
            return inner_width / 2 + (Math.cos(-d.dir) * d.r);
        })
        .attr("y", function (d) {
            return inner_height / 2 + (Math.sin(-d.dir) * d.r);
        })
        .attr("dx", function (d) {
            return d.offsetX;
        })
        .attr("dy", function (d) {
            return d.offsetY;
        })
        .text(function (d) {
            return (d.label);
        });
    // render the tooltip but make it hidden
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("font-size", "24pt")
        .style("color", "black")
        .style("background-color", "white")
        .style("border-style", "solid")
        .text("a simple tooltip");
    /// draw the rectangles based on their specified data
    var rects = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect");
    rects
        .attr("x", function (d) {
            return d.originX - d.width / 2;
        })
        .attr("y", function (d) {
            return d.originY;
        })
        .attr("height", function (d) {
            return scale * d.value;
        })
        .attr("width", function (d) {
            return d.width;
        })
        .attr("fill", function (d) {
            return d.color;
        })
        .attr("transform", function (d) {
            var a = "translate(" + (-(incremental_radius + d.start * scale) * Math.sin(d.dir * Math.PI / 180)) + "," + ((incremental_radius + d.start * scale) * Math.cos(d.dir * Math.PI / 180)) + ") rotate(" + d.dir + "," + d.originX + "," + d.originY + ")";
            return a;
        })
        // on mouseover increase the width of the rectange and show the value in a tool tip
        .on("mouseover", function (d) {
            tooltip.text(d.value.toFixed(1));
            tooltip.style("border-color", d.color);
            d3.select(this).attr("x", (d3.select(this).node().getBBox().x) - (d3.select(this).node().getBBox().width) / 2);
            d3.select(this).attr("width", d3.select(this).node().getBBox().width * 2);
            return tooltip.style("visibility", "visible");
        })
        // move the tooltip near the mouse
        .on("mousemove", function () {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        // on mouseout decrease the width again and hide the tooltip
        .on("mouseout", function () {
            d3.select(this).attr("width", d3.select(this).node().getBBox().width / 2);
            d3.select(this).attr("x", (d3.select(this).node().getBBox().x) + (d3.select(this).node().getBBox().width) / 2);
            return tooltip.style("visibility", "hidden");
        });
    // build the legend
    var text_offset = 25;
    var legend = svg.append("g");
    legend.append("rect")
        .attr("width", inner_width / 8)
        .attr("height", 5)
        .attr("x", inner_width * 2 / 8)
        .attr("y", inner_height + 20 - 2.5)
        .attr("fill", "rgb(94,79,162)");

    legend.append("text")
        .attr("x", inner_width * 2 / 8)
        .attr("y", inner_height + 20 + text_offset)
        .text("0");

    legend.append("rect")
        .attr("width", inner_width / 8)
        .attr("height", 10)
        .attr("x", inner_width * 3 / 8)
        .attr("y", inner_height + 20 - 5)
        .attr("fill", "rgb(193,228,157)");

    legend.append("text")
        .attr("x", inner_width * 3 / 8)
        .attr("y", inner_height + 20 + text_offset)
        .text("2");

    legend.append("rect")
        .attr("width", inner_width / 8)
        .attr("height", 15)
        .attr("x", inner_width * 4 / 8)
        .attr("y", inner_height + 20 - 7.5)
        .attr("fill", "rgb(253,192,108)");

    legend.append("text")
        .attr("x", inner_width * 4 / 8)
        .attr("y", inner_height + 20 + text_offset)
        .text("4");

    legend.append("rect")
        .attr("width", inner_width / 8)
        .attr("height", 20)
        .attr("x", inner_width * 5 / 8)
        .attr("y", inner_height + 20 - 10)
        .attr("fill", "rgb(158,1,66)");

    legend.append("text")
        .attr("x", inner_width * 5 / 8)
        .attr("y", inner_height + 20 + text_offset)
        .text("6+");

    legend.append("text")
        .attr("x", inner_width * 6 / 8)
        .attr("y", inner_height + 20 + text_offset)
        .text("(m/s)");

    legend.selectAll("text").style("text-anchor", "middle");
}

function drawPollutionRose(node, data, width, height) {
    var convert_data = function (width, height, data) {
        var output_data = [];
        // for each direction, split it into 4 new elements which will be used to render rectangles
        data.forEach(function (element) {
            output_data.push({
                dir: element.dir,
                start: 0,
                originX: width / 2,
                originY: height / 2,
                width: 5,
                value: element.zero,
                color: "rgb(94,79,162)"
            });
            output_data.push({
                dir: element.dir,
                start: element.zero,
                originX: width / 2,
                originY: height / 2,
                width: 5,
                value: element.five,
                color: "rgb(102,194,165)"
            });
            output_data.push({
                dir: element.dir,
                start: element.zero + element.five,
                originX: width / 2,
                originY: height / 2,
                width: 10,
                value: element.ten,
                color: "rgb(230,245,152)"
            });
            output_data.push({
                dir: element.dir,
                start: element.zero + element.five + element.ten,
                originX: width / 2,
                originY: height / 2,
                width: 15,
                value: element.fifteen,
                color: "rgb(254,224,139)"
            });
            output_data.push({
                dir: element.dir,
                start: element.zero + element.five + element.ten + element.fifteen,
                originX: width / 2,
                originY: height / 2,
                width: 20,
                value: element.twenty,
                color: "rgb(244,109,67)"
            });
            output_data.push({
                dir: element.dir,
                start: element.zero + element.five + element.ten + element.fifteen + element.twenty,
                originX: width / 2,
                originY: height / 2,
                width: 20,
                value: element.twentyPlus,
                color: "rgb(158,1,66)"
            });
        });
        return output_data;
    };

    // scale the rectangles based on the size of the svg area
    var inner_width = width - 50;
    var inner_height = height - 50;
    var scale = width / 100 / (3 / 4); // scale was based on 100 -> 20 so if
    // incremental_radius is width divided by 20, then scale is width divided by 100

    data = convert_data(inner_width, inner_height, data);

    // the size of the radius to increment by for the concentric circles
    var incremental_radius = width / 15;
    // data for the circles
    var circle_data = [{
        r: 6 * incremental_radius,
        label: "N",
        dir: Math.PI / 2,
        offsetY: -10,
        offsetX: -7.5
    }, {
        r: 6 * incremental_radius,
        label: "S",
        dir: 3 * Math.PI / 2,
        offsetX: -7.5,
        offsetY: 20
    }, {
        r: 6 * incremental_radius,
        label: "E",
        dir: 0,
        offsetX: 5,
        offsetY: 0

    }, {
        r: 6 * incremental_radius,
        label: "W",
        dir: Math.PI,
        offsetX: -25,
        offsetY: 0
    }, {
        r: incremental_radius,
        label: "0%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 2 * incremental_radius,
        label: "5%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 3 * incremental_radius,
        label: "10%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 4 * incremental_radius,
        label: "15%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 5 * incremental_radius,
        label: "20%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }, {
        r: 6 * incremental_radius,
        label: "25%",
        dir: Math.PI / 4,
        offsetX: 0,
        offsetY: 0
    }];
    // append an svg to the specified node
    var svg = d3.select(node).append("svg").attr({
        width: width,
        height: height
    });
    svg.style("margin","0 auto")
    svg.style("display", "block")
    // draw the circles
    var circles = svg.selectAll("circle")
        .data(circle_data)
        .enter()
        .append("circle");
    circles.attr({
        cx: inner_width / 2,
        cy: inner_height / 2,
        r: function (d) {
            return d.r;
        },
        fill: "none",
        stroke: "black"
    });
    // write the text values for the circle percentages
    var texts = svg.selectAll("text")
        .data(circle_data)
        .enter()
        .append("text");
    texts
        .attr("x", function (d) {
            return inner_width / 2 + (Math.cos(-d.dir) * d.r);
        })
        .attr("y", function (d) {
            return inner_height / 2 + (Math.sin(-d.dir) * d.r);
        })
        .attr("dx", function (d) {
            return d.offsetX;
        })
        .attr("dy", function (d) {
            return d.offsetY;
        })
        .text(function (d) {
            return (d.label);
        });
    // render the tooltip but make it hidden
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("font-size", "24pt")
        .style("color", "black")
        .style("background-color", "white")
        .style("border-style", "solid")
        .text("a simple tooltip");
    /// draw the rectangles based on their specified data

    // normally size arcs
    var arc = d3.svg.arc()
        .innerRadius(function (d) {
            return incremental_radius + d.start * scale;
        })
        .outerRadius(function (d) {
            return incremental_radius + (d.value * scale) + (d.start * scale);
        })
        .startAngle(function (d) {
            return (d.dir - 10) * Math.PI / 180;
        })
        .endAngle(function (d) {
            return (d.dir + 10) * Math.PI / 180;
        });
     // larger arcs to use when mouse is hovering over    
     var arcLarge = d3.svg.arc()
        .innerRadius(function (d) {
            return incremental_radius + d.start * scale;
        })
        .outerRadius(function (d) {
            return incremental_radius + (d.value * scale) + (d.start * scale);
        })
        .startAngle(function (d) {
            return ((d.dir - 15) * Math.PI / 180);
        })
        .endAngle(function (d) {
            return ((d.dir + 15) * Math.PI / 180);
        });

    var paths = svg.selectAll("path")
        .data(data)
        .enter()
        .append("svg:path")
        .attr("d", arc)
        .attr("transform", function (d) {
            return "translate(" + (inner_width / 2) + "," + (inner_height / 2) + ")";
        })
        .attr("fill", function (d) {
            return d.color;
        })
        .on("mouseover", function (d) {
            tooltip.text(d.value.toFixed(1));
            tooltip.style("border-color", d.color);
            d3.select(this).attr("x", (d3.select(this).node().getBBox().x) - (d3.select(this).node().getBBox().width) / 2);
            d3.select(this).attr("width", d3.select(this).node().getBBox().width * 2);
            d3.select(this).transition()
               .duration(100)
               .attr("d", arcLarge)
            return tooltip.style("visibility", "visible");
        })
        // move the tooltip near the mouse
        .on("mousemove", function (d) {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        // on mouseout decrease the width again and hide the tooltip
        .on("mouseout", function (d) {
            d3.select(this).attr("width", d3.select(this).node().getBBox().width / 2);
            d3.select(this).attr("x", (d3.select(this).node().getBBox().x) + (d3.select(this).node().getBBox().width) / 2);
            d3.select(this).transition()
               .duration(100)
               .attr("d", arc)
            return tooltip.style("visibility", "hidden");
        });

    // build the legend
    var text_offset = 30;
    var legend = svg.append("g");
    legend.append("rect")
        .attr("width", width / 10)
        .attr("height", 5)
        .attr("x", inner_width * 2 / 10)
        .attr("y", inner_height + 20 - 2.5)
        .attr("fill", "rgb(94,79,162)");

    legend.append("text")
        .attr("x", inner_width * 2 / 10)
        .attr("y", inner_height + 20 + text_offset)
        .text("-1");

    legend.append("rect")
        .attr("width", width / 10)
        .attr("height", 10)
        .attr("x", inner_width * 3 / 10)
        .attr("y", inner_height + 20 - 5)
        .attr("fill", "rgb(102,194,165)");

    legend.append("text")
        .attr("x", inner_width * 3 / 10)
        .attr("y", inner_height + 20 + text_offset)
        .text("0");

    legend.append("rect")
        .attr("width", inner_width / 10)
        .attr("height", 15)
        .attr("x", inner_width * 4 / 10)
        .attr("y", inner_height + 20 - 7.5)
        .attr("fill", "rgb(230,245,152)");

    legend.append("text")
        .attr("x", inner_width * 4 / 10)
        .attr("y", inner_height + 20 + text_offset)
        .text("5");

    legend.append("rect")
        .attr("width", inner_width / 10)
        .attr("height", 20)
        .attr("x", inner_width * 5 / 10)
        .attr("y", inner_height + 20 - 10)
        .attr("fill", "rgb(254,224,139)");

    legend.append("text")
        .attr("x", inner_width * 5 / 10)
        .attr("y", inner_height + 20 + text_offset)
        .text("10");

    legend.append("rect")
        .attr("width", width / 10)
        .attr("height", 25)
        .attr("x", inner_width * 6 / 10)
        .attr("y", inner_height + 20 - 12.5)
        .attr("fill", "rgb(244,109,67)");

    legend.append("text")
        .attr("x", inner_width * 6 / 10)
        .attr("y", inner_height + 20 + text_offset)
        .text("15");

    legend.append("rect")
        .attr("width", inner_width / 10)
        .attr("height", 30)
        .attr("x", inner_width * 7 / 10)
        .attr("y", inner_height + 20 - 15)
        .attr("fill", "rgb(158,1,66)");

    legend.append("text")
        .attr("x", inner_width * 7 / 10)
        .attr("y", inner_height + 20 + text_offset)
        .text("20+");

    legend.append("text")
        .attr("x", inner_width * 8 / 10)
        .attr("y", inner_height + 20 + text_offset)
        .text("(O3)");

    legend.selectAll("text").style("text-anchor", "middle");
}