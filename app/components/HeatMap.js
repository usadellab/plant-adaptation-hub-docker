'use client'
import React, { useMemo, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import { distance } from 'ml-distance';
import getDistanceMatrix from 'ml-distance-matrix';
import { agnes } from 'ml-hclust';
import * as d3 from 'd3';
import { nanoid } from 'nanoid';
import { correlation } from 'ml-matrix';

const convertDataToMatrix = (data, valueKey, sampleKey, variableKey) => {

  const sampleIdentifiers = [...new Set(data.map(item => item[sampleKey]))];
  const variableNames = [...new Set(data.map(item => item[variableKey]))];
  const matrix = Array(sampleIdentifiers.length).fill(0).map(() => Array(variableNames.length).fill(0));

  data.forEach(item => {
    const sampleIndex = sampleIdentifiers.indexOf(item[sampleKey]);
    const variableIndex = variableNames.indexOf(item[variableKey]);
    matrix[sampleIndex][variableIndex] = item[valueKey];
  });

  return { matrix, sampleIdentifiers, variableNames };
};

const HeatmapPlot = ({
  data,
  distanceMethod = 'euclidean',
  plotTitle = 'Heat Map',
  xLabel = 'X-axis Label',
  yLabel = 'Y-axis Label',
  heatmapWidth = 800,
  heatmapHeight = 1000,
  dendrogramWidth = 220,
  dendrogramHeight = 875,
}) => {

  const { matrix, sampleIdentifiers } = useMemo(() => convertDataToMatrix(data, 'value', 'subject', 'variable'), [data]);


  const sortClusteredMatrix = (matrix, order) => {
    return order.map(rowIndex => order.map(colIndex => matrix[rowIndex][colIndex]));
  };

  const getTreeLeaves = (cluster, srcNames) => {
    if (!cluster) return {};

    if (cluster.isLeaf) {
      return srcNames
        ? { [srcNames[cluster.index]]: cluster.index }
        : { [cluster.index]: cluster.index };
    } else if (cluster.children) {
      const index = cluster.children.reduce((accumulator, clusterChild) => {
        const leaves = getTreeLeaves(clusterChild, srcNames);
        return { ...accumulator, ...leaves };
      }, {});
      return index;
    } else {
      return {};
    }
  };

  const clusterToTree = (cluster, leafNames) => {
    if (cluster.isLeaf) {
      return { name: leafNames[cluster.index] };
    } else {
      const name = nanoid();
      const children = cluster.children.map((c) => clusterToTree(c, leafNames));
      return { name, children };
    }
  };

  const { distanceMatrix, sortedMatrix, tree, sortedIdentifiers } = useMemo(() => {
// should i transpose ?
    const computeDistance = (matrix, method) => {
      const distanceMethods = {
        // 'additiveSymmetric': 'additiveSymmetric',
        'avg': 'avg',
        'bhattacharyya': 'bhattacharyya',
        'canberra': 'canberra',
        'chebyshev': 'chebyshev',
        'clark': 'clark',
        'czekanowski': 'czekanowski',
        'dice': 'dice',
        'divergence': 'divergence',
        'euclidean': 'euclidean',
        'fidelity': 'fidelity',
        'gower': 'gower',
        'harmonicMean': 'harmonicMean',
        'hellinger': 'hellinger',
        'innerProduct': 'innerProduct',
        'intersection': 'intersection',
        'jaccard': 'jaccard',
        'jeffreys': 'jeffreys',
        'jensenDifference': 'jensenDifference',
        'jensenShannon': 'jensenShannon',
        'kdivergence': 'kdivergence',
        'kulczynski': 'kulczynski',
        'kullbackLeibler': 'kullbackLeibler',
        'kumarHassebrook': 'kumarHassebrook',
        'kumarJohnson': 'kumarJohnson',
        'lorentzian': 'lorentzian',
        'manhattan': 'manhattan',
        'matusita': 'matusita',
        'minkowski': 'minkowski',
        'motyka': 'motyka',
        'neyman': 'neyman',
        'pearson': 'pearson',
        'probabilisticSymmetric': 'probabilisticSymmetric',
        'ruzicka': 'ruzicka',
        'soergel': 'soergel',
        'sorensen': 'sorensen',
        'squared': 'squared',
        'squaredChord': 'squaredChord',
        'squaredEuclidean': 'squaredEuclidean',
        'taneja': 'taneja',
        'tanimoto': 'tanimoto',
        'topsoe': 'topsoe',
        'waveHedges': 'waveHedges',
      };
    
      if (method in distanceMethods) {
        return getDistanceMatrix(matrix, distance[method]);
      } else if (method === 'correlation') {
        const transposedMatrix = new d3.transpose(matrix);
        const corrMatrix = correlation(transposedMatrix, { center: true, scale: false });
        return corrMatrix.to2DArray();
      } else {
        throw new Error(`Unsupported distance method ${method}.`);
      }
    };
    

    const clusterMatrix = (matrix, method) => {
      return agnes(matrix, { isDistanceMatrix: true, method });
    };

    const distanceMatrix = computeDistance(matrix, distanceMethod);


    const cluster = clusterMatrix(distanceMethod === 'correlation' ? distanceMatrix.map((r) => r.map((x) => 1 - Math.abs(x))) : distanceMatrix, 'ward');
    

    const sortedCols = getTreeLeaves(cluster, sampleIdentifiers);
    const sortedOrder = Object.values(sortedCols);
    const sortedMatrix1 = sortClusteredMatrix(distanceMatrix, sortedOrder);

    const sortedMatrix2 = sortedMatrix1.map(row => row.map(value => isNaN(value) ? 0 : value));

    const normalizeMatrix = (matrix) => {
      const flatMatrix = matrix.flat();
      const min = Math.min(...flatMatrix);
      const max = Math.max(...flatMatrix);
      return matrix.map(row => row.map(value => (value - min) / (max - min)));
    };

    const sortedMatrix = normalizeMatrix(sortedMatrix2);

    console.log('sortedMatrix', sortedMatrix)


    const tree = clusterToTree(cluster, sampleIdentifiers);
    const sortedIdentifiers = sortedOrder.map(index => sampleIdentifiers[index]);

    return { distanceMatrix, sortedMatrix, tree, sortedIdentifiers };

  }, [matrix, sampleIdentifiers, distanceMethod]);

  const renderDendrogram = (tree, svgRef, width, height, labels) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
  
    const root = d3.hierarchy(tree);
    const cluster = d3.cluster().size([height, width - 100]);
    cluster(root);

    const elbow = (d) => `M${d.source.y},${d.source.x}H${d.target.y}V${d.target.x}`;
  
    svg.selectAll("path")
      .data(root.links())
      .enter().append("path")
        .attr("d", elbow)
        .attr("stroke", "#ccc")
        .attr("fill", "none");

    svg.selectAll("circle")
      .data(root.descendants())
      .enter().append("circle")
        .attr("cx", d => d.y)
        .attr("cy", d => d.x)
        .attr("r", 4)
        .attr("fill", d => d.children ? "#fff" : "#000");

    svg.selectAll("text")
      .data(labels)
      .enter().append("text")
        .attr("x", width - 80)
        .attr("y", (_, i) => i * (height / labels.length) + (height / labels.length / 2))
        .attr("dy", "0.31em")
        .attr("text-anchor", "start")
        .text(d => d)
        .attr("font-size", "10px")
        .attr("transform", "translate(10, -5)");

    svg.attr("viewBox", [-10, 0, width, height]);
  };

  const svgRef = useRef(null);

  useEffect(() => {
    if (tree && svgRef.current) {
      renderDendrogram(tree, svgRef, dendrogramWidth, dendrogramHeight, sortedIdentifiers);
    }
  }, [tree, dendrogramWidth, dendrogramHeight, sortedIdentifiers]);

  return (
    <div style={{ display: 'flex' }}>

      
      <div style={{ marginTop: 50, width: dendrogramWidth, marginRight: -30 }}>
        <svg ref={svgRef} width={dendrogramWidth} height={dendrogramHeight} />
      </div>
      
      <div style={{ width: heatmapWidth ,  marginLeft: -50}}>

      <Plot
config={{ 'displaylogo': false, modeBarButtonsToRemove: ['toImage', 'zoom2d', 'toggleSpikelines','hoverClosestCartesian','hoverCompareCartesian', 'select2d', 'pan2d', 'autoScale2d', 'lasso2d'] }}      
  data={[
    {
      z: sortedMatrix,
      x: sortedIdentifiers,
      y: sortedIdentifiers,
      type: 'heatmap',
      colorscale: 'Viridis',
      zmin: 0,  // Add minimum value for the color range
      zmax: 1,  // Add maximum value for the color range
    }
  ]}
  layout={{
    title: plotTitle,
    xaxis: { title: xLabel, side: 'bottom', tickfont: { color: 'green' } },
    yaxis: {
      ticklen: 30,
      tickcolor: 'green',
      ticksuffix: ' ',
      tickfont: { color: 'green' },
      side: 'left',
      autorange: 'reversed',
    },
    width: heatmapWidth,
    height: heatmapHeight,
    margin: { t: 50, l: -500 },
  }}
/>


      </div>
    </div>
  );
};

export default HeatmapPlot;


