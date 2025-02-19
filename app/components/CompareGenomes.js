"use client";

import React, { useEffect, useState } from "react";
import GenomeMetadataVisualizer from "./GenomeMetadataVisualizer";
import { Typography, Grid } from "@mui/material";
import axios from "axios";
import { useApiContext } from "@/contexts/ApiEndPoint";
import { useTokenContext } from "@/contexts/TokenContext";
import ComputeGenomeComparison from "./ComputeGenomeComparison";
import GenomeAlignments from "./GenomeAlignments";

export default function CompareGenomes() {
  const [assembliesData, setAssembliesData] = useState(null);
  const { apiEndpoint } = useApiContext();
  const token = useTokenContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiEndpoint}/get_genomes_metadata`,
          { token: token.apiToken }, // Send data as object in request body
          { headers: { "Content-Type": "application/json" } } // Set Content-Type header
        );
        setAssembliesData(response.data);
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {!assembliesData ? (
        <Typography> Loading .. </Typography>
      ) : (
        <Grid sx={{ ml: 2, marginTop: 4, marginRight: 2, marginBottom: 2 }}>
          <Typography variant="h8" color={"green"} fontWeight={"bold"}>
            Description:{" "}
          </Typography>
          <Typography variant="p">
            {`A tool for the basic comparative analysis of the currently available genome assemblies of the selected spp.`}
            . For more details please see{" "}
            <b>
              <a
                target="blind"
                href="https://ataulhaleem.github.io/camelina-hub-documentation/modules/ginfo/assembly_stats_comp"
              >
                documentation
              </a>
            </b>
          </Typography>
          <Grid
  container
  rowGap={4} // Increased gap for better separation of sections
  direction="column"
  sx={{
    justifyContent: "center",
    alignItems: "stretch",
    padding: 2, // Add padding for spacing around the content
  }}
>
  {/* Section 1: Compare Genome Assembly Statistics */}
  <Grid item>
    <Typography
variant="h8"     fontWeight={"bold"} component="h2" // Semantic heading
      color='green'
      gutterBottom // Adds spacing below the Typography
      sx={{ textAlign: "left" }} // Optional centering of the heading
    >
      1. Compare Genome Assembly Statistics
    </Typography>
    <ComputeGenomeComparison data={assembliesData} />
  </Grid>

  {/* Section 2: Genome Alignments */}
  <Grid item>
    <Typography
variant="h8"      fontWeight={"bold"} component="h2" // Semantic heading
      color='green'
      gutterBottom
      sx={{ textAlign: "left" }}
    >
      2. Genome Alignments
    </Typography>
    <GenomeAlignments />
  </Grid>
</Grid>

        </Grid>
      )}
    </div>
  );
}
