import * as d3 from 'd3';

class ManaColor {
    build(data, element) {
        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2;

        const color = d3.scaleOrdinal()
            .domain(['White', 'Blue', 'Black', 'Red', 'Green', 'Colorless'])
            .range(['#ffffff', '#4682B4', '#000000', '#B22222', '#228B22', '#A9A9A9']);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const svg = d3.select(element)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const arcs = svg.selectAll('arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.color) || "#ccc")
            .attr('stroke', "#000000");
    }
}

export { ManaColor };
