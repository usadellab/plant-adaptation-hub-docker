'use client'

import React from "react";
import { Chart } from "react-google-charts";
import { capitalizeFirstLetter } from "./utils";

const PieChart = ({ data }) => {

    // Filter the data to include only tables where "Number of variables" is present
    const filteredData = data.filter(item => item['variables'] !== undefined);
    const totalCount = filteredData.reduce((sum, item) => sum + item['variables'], 0);

    // Prepare the data for the pie chart
    const pieChartData = [
        ['Table Name', 'Number of Variables'],
        ...filteredData.map(item => [capitalizeFirstLetter((item.tableName.replace(/_/g, ' '))), item['variables']])
    ];

    return (
<Chart
  chartType="PieChart"
  data={pieChartData}
  options={{
    title: `Number of Variables Available Under Different Experiments (Total count: ${totalCount})`,
    is3D: true,
    titleTextStyle: {
      fontSize: 16,
      bold: true,
    },
    chartArea: {
      width: "70%",
      height: "70%",
    },
    backgroundColor: "#f9f9f9",
    legend: {
      position: "right", // Place the legend on the right
      alignment: "center", // Align the legend items centrally
      textStyle: {
        fontSize: 12, // Adjust font size to fit more items
      },
    },
  }}
  width={"100%"}
  height={"500px"}
/>

    );
};

export default PieChart;