'use client'
import React, { useEffect } from "react";
import PlotlyPlots from "./PlotlyPlots2";
import { Typography, Button, Grid } from "@mui/material";
import { useUntwistThemeContext } from "../../contexts/ThemeContext";
import axios from "axios";
import { useApiContext } from "@/contexts/ApiEndPoint";
import { useTokenContext } from "../../contexts/TokenContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { useState } from "react";
import Cookies from "js-cookie";
import PCAplot from "./plots/pcaplot";

export default function PCA({studyId}) {
  const { pcaData, setPCAData } = useAppDataContext();
  const {apiEndpoint} = useApiContext()
  const {apiToken, setApiToken} = useTokenContext();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const darkModeValue = Cookies.get("isDarkMode");
      setIsDarkMode(darkModeValue === "true");
    }, 1); // Check every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);





  useEffect(() => {
    setPCAData(null);
    function parseQassoc(fileContent, delimiter) {
      const rows = fileContent.split("\n");
      const header = rows
        .shift()
        .split(delimiter)
        .filter((value) => value !== "");
      const resultArray = [];

      rows.forEach((row) => {
        const columns = row.split(delimiter).filter((value) => value !== "");
        const obj = {};

        columns.forEach((column, index) => {
          const key = header[index];
          const value = column;
          obj[key] = value;
        });

        resultArray.push(obj);
      });

      return resultArray;
    }


    axios
      .post(
        `${apiEndpoint}/getBucketObjectData?bucket_name=camelina&object_name=Plink/precomputed.plink.cov.pca&token=${apiToken}`,
        { responseType: "text/plain" }
      )
      .then((response) => {
        setPCAData(parseQassoc(response.data, "\t"));
      });
  },[studyId])

  // console.log(isDarkMode)

  const handlePCA = () => {
    setPCAData(null);
    function parseQassoc(fileContent, delimiter) {
      const rows = fileContent.split("\n");
      const header = rows
        .shift()
        .split(delimiter)
        .filter((value) => value !== "");
      const resultArray = [];

      rows.forEach((row) => {
        const columns = row.split(delimiter).filter((value) => value !== "");
        const obj = {};

        columns.forEach((column, index) => {
          const key = header[index];
          const value = column;
          obj[key] = value;
        });

        resultArray.push(obj);
      });

      return resultArray;
    }

    console.log(apiEndpoint)


    axios
      .post(
        `${apiEndpoint}/getBucketObjectData?bucket_name=camelina&object_name=Plink/precomputed.plink.cov.pca&token=${apiToken}`,
        { responseType: "text/plain" }
      )
      .then((response) => {
        setPCAData(parseQassoc(response.data, "\t"));
      });
  };

  return (
    <Grid sx={{ ml: 2, marginTop: 2, marginBottom: 2, marginRight: 2 }}>


      <div padding={2}>
        {/* <Button
          sx={{ marginLeft: 1, marginBottom: 2 }}
          variant="contained"
          onClick={handlePCA}
          color="primary"
        >
          PCA plot
        </Button> */}

        {!pcaData || (
          <div>
            <PCAplot
              plotSchema={{
                plot_type: "pca",
                inputData: pcaData,
                variablesToPlot: ["COV1", "COV2"],
                plotTitle: "Principle Component Analysis",
                xLable: "PC1",
                yLable: "PC2",
                isDark: isDarkMode,
              }}
            />
          </div>
        )}
      </div>
    </Grid>
  );
}
