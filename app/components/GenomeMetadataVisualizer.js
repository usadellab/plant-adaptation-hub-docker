import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Chart } from "react-google-charts";
import { NoneType } from "ol/expr/expression";

const GenomeMetadataVisualizer = ({ data }) => {

  console.log(data)

  const [selectedAssemblies, setSelectedAssemblies] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [refAssemblyData, setRefAssemblyData] = useState(null);


  useEffect(() => {
    // // Extract relevant data for assembly overview
    // const overviewData = data.find(
    //   (assembly) => assembly.annotationinfo_provider_ === "NCBI RefSeq"
    // );
    // console.log(overviewData)
    setRefAssemblyData(data[0]);   //This is temp fix only for this module
  }, [data]);

  // Extract relevant data for comparison
  const comparisonData = selectedAssemblies.map((assemblyAccession) => {
    const assembly = data.find((item) => item.accession_ === assemblyAccession);
    return [
      assembly.accession_,
      parseFloat(assembly[`assemblystats_${selectedMetric.toLowerCase()}_`]),
    ];
  });

  comparisonData.sort((a, b) => b[1] - a[1]);
  comparisonData.splice(0, 0, ["Assembly", `${selectedMetric.toLowerCase()}_`]);

  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [selectedAssembly, setSelectedAssembly] = useState(null);

  const handleAssemblyChange = (event, newValue) => {
    setSelectedAssembly(newValue);
    // You can also perform other actions with the selected value here
    setRefAssemblyData(newValue);
  };

  return (
    <div>
      {!refAssemblyData ? <Typography sx={{mt:10}} color={'red'}>No data available!</Typography> :  (
        <div>

          <Grid container sx={{ mt: 1 }} spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                align="left"
                paddingLeft={1}
                fontWeight={"bold"}
                sx={{ backgroundColor: "lightgrey" }}
              >
                General Information
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.organism_organismname_} (
                        {refAssemblyData.organism_commonname_})
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Common Name:</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.organism_infraspecificnames_cultivar_ || <Typography>unknown</Typography>}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Assembly Accession:</strong>
                      </TableCell>
                      <TableCell>{refAssemblyData.accession_|| <Typography>unknown</Typography>}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Assembly Level</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblyinfo_assemblylevel_|| <Typography>unknown</Typography>}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Assembly Method</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblyinfo_assemblymethod_|| <Typography>unknown</Typography>}
                      </TableCell>
                    </TableRow>
                    {/* <TableRow>
                          <TableCell><strong>Assembly Status:</strong></TableCell>
                          <TableCell>{refAssemblyData.assemblyInfo.assemblyStatus}</TableCell>
                        </TableRow> */}
                    <TableRow>
                      <TableCell>
                        <strong>Sequencing Technology</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblyinfo_sequencingtech_|| <Typography>unknown</Typography>}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                align="left"
                paddingLeft={1}
                fontWeight={"bold"}
                sx={{ backgroundColor: "lightgrey" }}
              >
                BUSCOs (v{refAssemblyData.annotationinfo_busco_buscover_})
              </Typography>

              {refAssemblyData.annotationinfo_busco_singlecopy_ ? (
                <div>
                  <Chart
                    chartType="BarChart"
                    data={[
                      ["Category", "Percentage"],
                      ["Single Copy",refAssemblyData.annotationinfo_busco_singlecopy_ * 100 ],
                      ["Duplicated", refAssemblyData.annotationinfo_busco_duplicated_ * 100 ],
                      ["Fragmented", refAssemblyData.annotationinfo_busco_fragmented_ * 100 ],
                      ["Missing",    refAssemblyData.annotationinfo_busco_missing_ * 100 ],
                    ]}
                    options={{
                      title: "BUSCO Categories",
                      titleTextStyle: {
                        fontSize: 16,
                        bold: true,
                        color: "#FF5722",
                      },
                      chartArea: {
                        width: "70%",
                        height: "70%",
                      },
                      hAxis: {
                        title: "Percentage",
                        minValue: 0,
                        maxValue: 100,
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
                      colors: ["#FF5722"],
                      backgroundColor: "#f9f9f9",
                      bar: {
                        groupWidth: "75%",
                      },
                    }}
                    width={"100%"}
                    height={"300px"}
                  />
                  <Grid container spacing={2}>
                    <Grid item>
                      <Typography color={"green"}>
                        {" "}
                        BUSCO Completeness{" "}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography color={"red"}>
                        {" "}
                        {refAssemblyData.annotationinfo_busco_complete_ *
                          100} %{" "}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Typography color={"green"}> BUSCO Lineage </Typography>
                    </Grid>
                    <Grid item>
                      <Typography color={"red"}>
                        {" "}
                        {refAssemblyData.annotationinfo_busco_buscolineage_} (
                        {refAssemblyData.annotationinfo_busco_totalcount_}){" "}
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              ) : (
                <Typography> No data available</Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                align="left"
                paddingLeft={1}
                fontWeight={"bold"}
                sx={{ backgroundColor: "lightgrey" }}
              >
                Assembly Stats
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>GC Percent</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblystats_gcpercent_} %
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Total Sequence Length</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblystats_totalsequencelength_}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Genome Coverage</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblystats_genomecoverage_}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Contig N50</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblystats_contign50_}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Scaffold N50</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblystats_scaffoldn50_}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Scaffold PN50</strong>
                      </TableCell>
                      <TableCell>
                        {refAssemblyData.assemblystats_scaffoldn50_ /
                          (parseInt(
                            refAssemblyData.assemblystats_totalsequencelength_
                          ) /
                            parseFloat(
                              refAssemblyData.assemblystats_totalnumberofchromosomes_
                            ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                align="left"
                paddingLeft={1}
                fontWeight={"bold"}
                sx={{ backgroundColor: "lightgrey" }}
              >
                Structural Features
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Number of genes</strong>
                      </TableCell>
                      <TableCell>
                        {" "}
                        {refAssemblyData.annotationinfo_stats_genecounts_total_ || (
                          <Typography>No data available</Typography>
                        )}{" "}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Number of Protein coding genes</strong>
                      </TableCell>
                      <TableCell>
                        {" "}
                        {refAssemblyData.annotationinfo_stats_genecounts_proteincoding_ || (
                          <Typography>No data available</Typography>
                        )}{" "}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Number of Pseudo genes</strong>
                      </TableCell>
                      <TableCell>
                        {" "}
                        {refAssemblyData.annotationinfo_stats_genecounts_pseudogene_ || (
                          <Typography>No data available</Typography>
                        )}{" "}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Number of noncoding genes</strong>
                      </TableCell>
                      <TableCell>
                        {" "}
                        {refAssemblyData.annotationinfo_stats_genecounts_noncoding_ || (
                          <Typography>No data available</Typography>
                        )}{" "}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

          </Grid>
        </div>
      )}
    </div>
  );
};

export default GenomeMetadataVisualizer;
