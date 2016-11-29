function renderBarChart(svgSelector, tooltipSelector, dataFile, xVariable, yVariable){
    // render the tooltip (one per page)
    var tooltip = d3.select(tooltipSelector)
        .attr("class","custom-tooltip");
    // create the svg
    var svg = d3.select(svgSelector);
    // set the height of the svg to be 2/3 of the browser
    svg.style("height", window.innerHeight*2/3);
    // Set the margins
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        // set the width to use to draw bars
        width = parseInt(svg.style("width"), 10) - margin.left - margin.right,
        // set the height ot use to draw bars
        height = window.innerHeight*2/3 - margin.top - margin.bottom;

    // set up scales
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // load the data
    d3.csv(dataFile, function(d) {
      d[yVariable] = +d[yVariable];
      return d;
    }, function(error, data) {
      if (error) throw error;

      x.domain(data.map(function(d) { return d[xVariable]; }));
      y.domain([0, d3.max(data, function(d) { return d[yVariable]; })]);

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10, "%"))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

      g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d[xVariable]); })
          .attr("y", function(d) { return y(d[yVariable]); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d[yVariable]); })
          // handle the tooltip
          .on("mouseover", function(d){
            tooltip.text(d[xVariable] + ": " +(d[yVariable]*100).toFixed(2));
            return tooltip.style("visibility", "visible");})
          .on("mousemove", function(){return tooltip.style("top",
            (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
          .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    });
}