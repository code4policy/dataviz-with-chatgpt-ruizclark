// Load the CSV file and build the bar chart
d3.csv("311_boston_data.csv").then(data => {
    // Convert Count to a number
    data.forEach(d => d.Count = +d.Count);

    // Sort the data in descending order based on Count
    data.sort((a, b) => b.Count - a.Count);

    // Set dimensions and margins
    const margin = { top: 20, right: 50, bottom: 40, left: 200 };
    const width = 800 - margin.left - margin.right;

    // Create the SVG canvas
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right);

    // Function to draw the chart
    const drawChart = (filteredData) => {
        const height = filteredData.length * 25 + margin.top + margin.bottom;

        svg.attr("height", height);

        // Clear existing chart content
        svg.selectAll("*").remove();

        // Create scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.Count)])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(filteredData.map(d => d.reason))
            .range([margin.top, height - margin.bottom])
            .padding(0.1);

        // Add axes
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5));

        // Create bars
        svg.selectAll(".bar")
            .data(filteredData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", margin.left)
            .attr("y", d => y(d.reason))
            .attr("height", y.bandwidth())
            .attr("width", d => x(d.Count))
            .style("fill", "maroon");

        // Add labels
        svg.selectAll(".label")
            .data(filteredData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => margin.left + x(d.Count) + 5)
            .attr("y", d => y(d.reason) + y.bandwidth() / 2)
            .attr("dy", ".35em")
            .text(d => d.Count);
    };

    // Initial rendering with the top 10 issues
    const top10Data = data.slice(0, 10);
    drawChart(top10Data);

    // Toggle functionality
    const toggleButton = d3.select("#toggle-chart");
    let showingAll = false;

    toggleButton.on("click", () => {
        showingAll = !showingAll;
        drawChart(showingAll ? data : top10Data);
        toggleButton.text(showingAll ? "Show Top 10" : "Show All");
    });
});

