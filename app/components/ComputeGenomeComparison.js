'use client'
import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Typography,
  Autocomplete,
  Grid
} from "@mui/material";

import { Chart } from "react-google-charts";

const metrics = [
  { value: 'assemblystats_gcpercent_', label: 'GC Percent (%)' },
  { value: 'assemblystats_totalsequencelength_', label: 'Total Sequence Length (bp)' },
  { value: 'assemblystats_genomecoverage_', label: 'Genome Coverage (x)' },
  { value: 'assemblystats_contign50_', label: 'Contig N50 (bp)' },
  { value: 'assemblystats_scaffoldn50_', label: 'Scaffold N50 (bp)' },
  { value: 'PN50 Ratio', label: 'PN50 ratio' },
];

const computePN50 = (n50, gsize, chrs) => {
  return parseFloat(n50) / (parseFloat(gsize)/parseFloat(chrs));
};


const ComputeGenomeComparison = ({ data }) => {

  const [selectedAssemblies, setSelectedAssemblies] = useState([data[0], data[1], data[2], data[3]]);
  const [comparisonData, setComparisonData] = useState(null);

  const handleSelectAssemblies = (event, newValue) => {
    setSelectedAssemblies(newValue);
  };

  const [selectedMetric, setSelectedMetric] = useState(metrics[5]); // Set initial value

  const handleSelectMetric = (e, newValue) => {

    setSelectedMetric(newValue);
    handleComparisonData(newValue, selectedAssemblies);
  };

  const handleComparisonData = (selectedMetric, selectedAssemblies) => {
    if (selectedMetric && selectedAssemblies.length > 1) {
      const newComparisonData = selectedAssemblies.map((assembly) => {
        if (selectedMetric.value === 'PN50 Ratio') {
          let n50 = computePN50(
            assembly.assemblystats_scaffoldn50_,
            assembly.assemblystats_totalsequencelength_,
            assembly.assemblystats_totalnumberofchromosomes_
          );
          return [assembly.assemblyinfo_assemblyname_, n50];
        } else {
          return [
            assembly.assemblyinfo_assemblyname_,
            parseFloat(assembly[selectedMetric.value]),
          ];
        }
      });
  
      newComparisonData.sort((a, b) => b[1] - a[1]);
      newComparisonData.splice(0, 0, ["Assembly", selectedMetric.label]);
  
      // Update state with the new data
      setComparisonData(newComparisonData);
    } else {
      // Set state to null for cases where conditions aren't met
      setComparisonData(null);
    }
  };

  useEffect(() => {
    handleComparisonData(selectedMetric, selectedAssemblies); // Pass the initial selectedMetric
  }, [selectedMetric, selectedAssemblies]);

  return (
    <div>
      {!data ? (
        <Typography sx={{ mt: 10 }} color={"red"}>
          No data available!
        </Typography>
      ) : (
        <div>
        <Grid container rowGap={1.5} direction="column"
  sx={{
    padding : 2,
    justifyContent: "space-evenly",
    alignItems: "stretch",
  }} >

          <Grid item>
          <Autocomplete
            size="small"
            fullWidth
            multiple
            options={data}
            getOptionLabel={(option) => option.assemblyinfo_assemblyname_}
            defaultValue={selectedAssemblies}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select reference genome assemblies for comparison"
              />
            )}
            onChange={handleSelectAssemblies}
          />
          </Grid>

          <Grid item>
          <Autocomplete
            size="small"
            fullWidth
            disablePortal
            options={metrics} // Pass the entire object array
            getOptionLabel={(option) => option.label}
            value={selectedMetric} // Pass the selectedMetric state
            onChange={handleSelectMetric}
            renderInput={(params) => (
              <TextField {...params} label="Select Metric" variant="outlined" />
            )}
          />
          </Grid>

          </Grid>

          {comparisonData && (
            




            <Box sx={{ ml: 2 }}>
              <Chart
                chartType="BarChart"
                data={comparisonData}
                options={{
                  title: `Comparison of the selected genome assemblies for ${selectedMetric.label}`,
                  titleTextStyle: {
                    fontSize: 16,
                    bold: true,
                    color: "#4CAF50",
                  },
                  chartArea: {
                    width: "65%",
                    height: "70%",
                  },
                  hAxis: {
                    title: `${selectedMetric.label}`,
                    titleTextStyle: {
                      fontSize: 14,
                      bold: true,
                      color: "#333",
                    },
                    textStyle: {
                      fontSize: 12,
                      color: "#666",
                    },
                    gridlines: {
                      color: "#e9e9e9",
                    },
                  },
                  vAxis: {
                    textStyle: {
                      fontSize: 12,
                      color: "#666",
                    },
                  },
                  legend: {
                    position: "none",
                  },
                  annotations: {
                    alwaysOutside: true,
                    textStyle: {
                      fontSize: 12,
                      color: "#444",
                      auraColor: "none",
                    },
                  },
                  bars: "horizontal",
                  colors: ["#4CAF50"],
                  backgroundColor: "#f9f9f9",
                  bar: {
                    groupWidth: "75%",
                  },
                }}
                width={"100%"}
                height={"300px"}
              />
            </Box>







            
          )}
        </div>
      )}
    </div>
  );
};

export default ComputeGenomeComparison;