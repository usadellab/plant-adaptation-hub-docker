// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const ComputeSynteny = ({ genomes, syntenyBlocks, width, height }) => {

//   console.log(genomes, syntenyBlocks)
//   const svgRef = useRef(null);

//   useEffect(() => {
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove(); // Clear previous SVG content

//     const outerRadius = Math.min(width, height) / 2 - 60;
//     const innerRadius = outerRadius - 30;
//     const gap = 0.01 * Math.PI; // Define gap size between arcs

//     // Calculate total length of all chromosomes
//     const totalLength = genomes.reduce((sum, genome) =>
//       sum + genome.chromosomes.reduce((genomeSum, chr) => genomeSum + chr.length, 0), 0
//     );

//     // Define angle scales
//     const angleScale = d3.scaleLinear()
//       .domain([0, totalLength])
//       .range([0, 2 * Math.PI - gap * genomes.length]);

//     let currentAngle = 0;

//     // Define color scale for genomes
//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
//       .domain(genomes.map(genome => genome.name));

//     // Create a group for each genome's chromosomes
//     const chromosomeGroups = svg.append('g')
//       .attr('transform', `translate(${width / 2 }, ${height / 2 })`);

//     // Draw chromosomes arcs and labels
//     genomes.forEach(genome => {
//       genome.chromosomes.forEach(chr => {
//         const startAngle = currentAngle;
//         const endAngle = startAngle + angleScale(chr.length) - gap; // Subtract gap from angle
//         currentAngle = endAngle + gap; // Add gap after each chromosome

//         const arc = d3.arc()
//           .innerRadius(innerRadius)
//           .outerRadius(outerRadius)
//           .startAngle(startAngle)
//           .endAngle(endAngle);

//         chromosomeGroups.append('path')
//           .attr('d', arc)
//           .attr('fill', colorScale(genome.name))
//           .attr('stroke', 'black')
//           .attr('id', `${genome.name}_${chr.name}`);

//         // Add chromosome labels horizontally
//         const midAngle = (startAngle + endAngle) / 2 - gap;
//         const labelX = Math.cos(midAngle) * (outerRadius + 25);
//         const labelY = Math.sin(midAngle) * (outerRadius + 25);

//         console.log('ANGLE', midAngle, labelX, labelY)

//         chromosomeGroups.append('text')
//           .attr('x', labelX)
//           .attr('y', labelY)
//           .attr('text-anchor', 'middle')
//           .attr('alignment-baseline', 'middle')
//           .attr('transform', `rotate(0, ${labelX}, ${labelY})`) // Keep labels horizontal
//           .text(`${chr.name}`);
//       });
//     });

//     // Draw synteny blocks
//     const chordGenerator = d3.ribbon()
//       .radius(innerRadius);

//     const chords = svg.append('g')
//       .attr('transform', `translate(${width / 2}, ${height / 2})`);

//       syntenyBlocks.forEach(block => {
//         const sourceGenome = genomes.find(g => g.name === block.source_genome);
//         const targetGenome = genomes.find(g => g.name === block.target_genome);
      
//         if (sourceGenome && targetGenome) {
//           const sourceChromosome = sourceGenome.chromosomes.find(c => c.name === block.source_region.chr);
//           const targetChromosome = targetGenome.chromosomes.find(c => c.name === block.target_region.chr);
      
//           if (sourceChromosome && targetChromosome) {
//             const sourceStartAngle = angleScale(block.source_region.start);
//             const sourceEndAngle = angleScale(block.source_region.end);
//             const targetStartAngle = angleScale(block.target_region.start);
//             const targetEndAngle = angleScale(block.target_region.end);
      
//             chords.append('path')
//               .attr('d', chordGenerator({
//                 source: { startAngle: sourceStartAngle, endAngle: sourceEndAngle },
//                 target: { startAngle: targetStartAngle, endAngle: targetEndAngle },
//               }))
//               .attr('fill', 'lightblue')
//               .attr('stroke', 'black');
//           }
//         }
//       });
      

//     // Add legend
//     const legend = svg.append('g')
//       .attr('transform', `translate(${width - 150}, 20)`);

//     genomes.forEach((genome, i) => {
//       legend.append('rect')
//         .attr('x', 0)
//         .attr('y', i * 20)
//         .attr('width', 18)
//         .attr('height', 18)
//         .attr('fill', colorScale(genome.name));

//       legend.append('text')
//         .attr('x', 24)
//         .attr('y', i * 20 + 9)
//         .attr('dy', '.35em')
//         .text(genome.name)
//         .attr('text-anchor', 'start');
//     });

//   }, [genomes, syntenyBlocks, width, height]);

//   return (
//     <svg ref={svgRef} width={width} height={height}></svg>
//   );
// };

// export default ComputeSynteny;


// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const ComputeSynteny = ({ width, height }) => {
//   const svgRef = useRef(null);

//   useEffect(() => {
//     const data = [
//       { source: 'GenomeA_chr1', target: 'GenomeB_chr1', value: 30 },
//       { source: 'GenomeA_chr2', target: 'GenomeB_chr2', value: 20 },
//       { source: 'GenomeA_chr3', target: 'GenomeB_chr3', value: 50 },
//       { source: 'GenomeB_chr1', target: 'GenomeC_chr1', value: 40 },
//       { source: 'GenomeB_chr2', target: 'GenomeC_chr2', value: 10 },
//       { source: 'GenomeA_chr1', target: 'GenomeC_chr1', value: 60 },
//       { source: 'GenomeA_chr2', target: 'GenomeC_chr2', value: 35 },
//       { source: 'GenomeC_chr3', target: 'GenomeA_chr3', value: 25 },
//       { source: 'GenomeB_chr3', target: 'GenomeA_chr3', value: 45 }
//     ];

//     const names = d3.sort(d3.union(data.map(d => d.source), data.map(d => d.target)));
//     const index = new Map(names.map((name, i) => [name, i]));
//     const matrix = Array.from(index, () => new Array(names.length).fill(0));
//     for (const { source, target, value } of data) {
//       matrix[index.get(source)][index.get(target)] += value;
//     }

//     const innerRadius = Math.min(width, height) * 0.5 - 90;
//     const outerRadius = innerRadius + 10;

//     const chord = d3.chordDirected()
//       .padAngle(10 / innerRadius)
//       .sortSubgroups(d3.descending)
//       .sortChords(d3.descending);

//     const arc = d3.arc()
//       .innerRadius(innerRadius)
//       .outerRadius(outerRadius);

//     const ribbon = d3.ribbonArrow()
//       .radius(innerRadius - 1)
//       .padAngle(1 / innerRadius);

//     const colors = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, names.length));

//     const svg = d3.select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .attr("viewBox", [-width / 2, -height / 2, width, height])
//       .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

//     const chords = chord(matrix);

//     const group = svg.append("g")
//       .selectAll("g")
//       .data(chords.groups)
//       .join("g");

//     group.append("path")
//       .attr("fill", d => colors(d.index))
//       .attr("d", arc);

//     group.append("text")
//       .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
//       .attr("dy", "0.35em")
//       .attr("transform", d => `
//         rotate(${(d.angle * 180 / Math.PI - 90)})
//         translate(${outerRadius + 5})
//         ${d.angle > Math.PI ? "rotate(180)" : ""}
//       `)
//       .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
//       .text(d => names[d.index]);

//     svg.append("g")
//       .attr("fill-opacity", 0.75)
//       .selectAll("path")
//       .data(chords)
//       .join("path")
//       .style("mix-blend-mode", "multiply")
//       .attr("fill", d => colors(d.target.index))
//       .attr("d", ribbon)
//       .append("title")
//       .text(d => `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`);

//   }, [width, height]);

//   return (
//     <svg ref={svgRef}></svg>
//   );
// };

// export default ComputeSynteny;




import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ComputeSynteny = ({ genomes, syntenyBlocks, width, height }) => {
  const svgRef = useRef(null);

  console.log(genomes, syntenyBlocks, width, height)

  useEffect(() => {
    // const totalGenomeLength = genomes.reduce((total, genome) => 
    //   total + genome.chromosomes.reduce((genomeTotal, chr) => genomeTotal + chr.length, 0), 0);

    // const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    //   .domain(genomes.map(genome => genome.name));

    // const innerRadius = Math.min(width, height) * 0.5 - 90;
    // const outerRadius = innerRadius + 10;

    // const svg = d3.select(svgRef.current)
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("viewBox", [-width / 2, -height / 2, width, height])
    //   .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

    // let currentAngle = 0;
    // const angleScale = d3.scaleLinear()
    //   .domain([0, totalGenomeLength])
    //   .range([0, 2 * Math.PI]);

    // const chromosomes = [];

    // genomes.forEach(genome => {
    //   genome.chromosomes.forEach(chr => {
    //     const startAngle = currentAngle;
    //     const chrAngle = angleScale(chr.length);
    //     const endAngle = startAngle + chrAngle;
    //     currentAngle = endAngle;

    //     chromosomes.push({
    //       genome: genome.name,
    //       chr: chr.name,
    //       startAngle,
    //       endAngle,
    //       color: colorScale(genome.name),
    //       length: chr.length,
    //     });
    //   });
    // });

    // const arc = d3.arc()
    //   .innerRadius(innerRadius)
    //   .outerRadius(outerRadius);

    // const group = svg.append("g")
    //   .selectAll("g")
    //   .data(chromosomes)
    //   .join("g");

    // group.append("path")
    //   .attr("fill", d => d.color)
    //   .attr("d", d => arc({ startAngle: d.startAngle, endAngle: d.endAngle }))
    //   .append("title")
    //   .text(d => `${d.genome}: ${d.chr}`);

    // group.append("text")
    //   .attr("transform", d => `
    //     rotate(${(d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90})
    //     translate(${outerRadius + 10})
    //     ${((d.startAngle + d.endAngle) / 2 > Math.PI) ? "rotate(180)" : ""}
    //   `)
    //   .attr("dy", "0.35em")
    //   .attr("text-anchor", d => ((d.startAngle + d.endAngle) / 2 > Math.PI) ? "end" : null)
    //   .text(d => d.chr);

    // const ribbon = d3.ribbon()
    //   .radius(innerRadius);

    // const synteny = svg.append("g")
    //   .attr("fill-opacity", 0.75)
    //   .selectAll("path")
    //   .data(syntenyBlocks)
    //   .join("path")
    //   .attr("fill", d => {
    //     const source = chromosomes.find(c => c.genome === d.source_genome && c.chr === d.source_region.chr);
    //     const target = chromosomes.find(c => c.genome === d.target_genome && c.chr === d.target_region.chr);

    //     if (!source || !target) {
    //       console.warn(`Could not find matching chromosome for synteny block: ${JSON.stringify(d)}`);
    //       return 'gray'; // Fallback color if source or target chromosome is not found
    //     }

    //     return colorScale(source.genome);
    //   })
    //   .attr("d", d => {
    //     const source = chromosomes.find(c => c.genome === d.source_genome && c.chr === d.source_region.chr);
    //     const target = chromosomes.find(c => c.genome === d.target_genome && c.chr === d.target_region.chr);

    //     if (!source || !target) {
    //       return null; // Skip rendering if source or target chromosome is not found
    //     }

    //     const sourceAngle = d => source.startAngle + (d.source_region.start / source.length) * (source.endAngle - source.startAngle);
    //     const targetAngle = d => target.startAngle + (d.target_region.start / target.length) * (target.endAngle - target.startAngle);

    //     return ribbon({
    //       source: {
    //         startAngle: sourceAngle(d),
    //         endAngle: sourceAngle(d) + (d.source_region.end - d.source_region.start) / source.length * (source.endAngle - source.startAngle)
    //       },
    //       target: {
    //         startAngle: targetAngle(d),
    //         endAngle: targetAngle(d) + (d.target_region.end - d.target_region.start) / target.length * (target.endAngle - target.startAngle)
    //       }
    //     });
    //   })
    //   .append("title")
    //   .text(d => `${d.source_genome} ${d.source_region.chr} → ${d.target_genome} ${d.target_region.chr}`);
  }, [genomes, syntenyBlocks, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default ComputeSynteny;
