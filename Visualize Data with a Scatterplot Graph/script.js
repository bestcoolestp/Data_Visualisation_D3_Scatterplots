const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();

let values = [];

let xScale;
let yScale;

let xAxis;
let yAxis;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");
let tooltip = d3.select("#tooltip");

const drawCanvas = () => {
    svg.attr("width", width);
    svg.attr("height", height);
}

const generateScales = () => {
    xScale = d3.scaleLinear()
                .domain([d3.min(values, (item) =>  item["Year"] - 1), d3.max(values, (item) => item["Year"] + 1)])
                .range([padding, width - padding]);

    yScale = d3.scaleTime()
        .domain([d3.min(values, (item) => new Date(item["Seconds"] * 1000)), d3.max(values, (item) => new Date(item["Seconds"] * 1000))])
        .range([padding, height - padding]);
};

const drawPoint = () => {
    svg.selectAll("circle")
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (item) => xScale(item["Year"]))
        .attr("cy", (item) => yScale(new Date(item["Seconds"] * 1000)))
        .attr("r", 5)
        .attr("data-xvalue", (item) => item["Year"])
        .attr("data-yvalue", (item) => new Date(item["Seconds"] * 1000))
        .style("fill", (item) => {
            if (item["Doping"] != "") {
                return "red";
            } else {
                return "blue";
            }
        })
        .on("mouseover", (item) => {
            tooltip.transition()
                .style("visibility", "visible");
            if(item['Doping'] != '') {
                    tooltip.text(item["Year"] + " - " + item["Name"] + " - " + item["Time"] + " - " + item["Doping"]);
            }else {
                    tooltip.text(item["Year"] + " - " + item["Name"] + " - " + item["Time"] + " - " + "No doping allegations");
                }
            tooltip.attr("data-year", item["Year"]);
        })
        .on("mouseout", (item) => {
            tooltip.transition()
                .style("visibility", "hidden");
        })
};

const generateAxes = () => {
    xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (height - padding) + ")");
    
    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)");
}

req.open("GET", url, true);
req.onload = () => {
    // console.log(req.responseText);
    values = JSON.parse(req.responseText);
    console.log(values);
    drawCanvas();
    generateScales();
    drawPoint();
    generateAxes();
};
req.send();