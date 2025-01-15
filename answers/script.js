// Load the CSV file and build the bar chart
d3.csv("311_boston_data.csv").then(data => {
    // Convert Count to a number
    data.forEach(d => d.Count = +d.Count);

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 200 };
    const width = 800 - margin.left - margin.right;
    const height = data.length * 25;

    // Create the SVG canvas
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.reason))
        .range([0, height])
        .padding(0.1);

    // Add axes
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));

    // Create bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.reason))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.Count));

    // Add labels
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("y", d => y(d.reason) + y.bandwidth() / 2)
        .attr("x", d => x(d.Count) + 5)
        .attr("dy", ".35em")
        .text(d => d.Count);
});

