"use client";
import * as React from "react";
import { Button } from "@mui/material";
import axios from "axios";

import { useSelectedSpecies } from "../../contexts/SelectedSpeciesContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


import { useState, useEffect } from "react";
import Papa from "papaparse";
import PlotlyPlots from "./PlotlyPlots2";

import MessageWithTimer from "./MessageDisplay";
import { useUntwistThemeContext } from "../../contexts/ThemeContext"
import { UntwistThemeProvider } from "../../contexts/ThemeContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { useTokenContext } from "../../contexts/TokenContext";
import { useApiContext } from "@/contexts/ApiEndPoint";
import Cookies from "js-cookie";
import MDSplot from "./plots/mdsplot";


// var dbID = {
//   Camelina: "camelina",
//   Brassica: "brassica",
// };

export default function MDS(props) {

  const { apiEndpoint } = useApiContext()

  const [startMDS, setStartMDS] = useState(false);
  const {mdsData, setMdsData} = useAppDataContext()
  const [displayMessage, setDisplayMessage] = useState([]);
  const {apiToken, setApiToken} = useTokenContext();
  const {k, setK} = useAppDataContext()




const [isDarkMode, setIsDarkMode] = useState(false);

useEffect(() => {
  const intervalId = setInterval(() => {
    const darkModeValue = Cookies.get("isDarkMode");
    setIsDarkMode(darkModeValue === "true");
  }, 1); // Check every second

  return () => clearInterval(intervalId); // Cleanup on unmount
}, []);



  const runMDS = () => {
    setStartMDS(true);
    setModalIsOpen(true);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (modalIsOpen) {
      const interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [modalIsOpen]);



  useEffect(() => {
    if (startMDS) {
      var msgs = [];
      const plinkWorker = new Worker("/plink-worker.js"); // Adjust the path to your worker script
      plinkWorker.postMessage({
        cmd: "runMDS",
        token: apiToken,
        spp: "camelina",
        k : k,
        apiEndpoint : apiEndpoint

      });
      plinkWorker.onmessage = (e) => {
        if (e.data.cmd === "processed") {
          setMdsData(e.data.res);
          localStorage.setItem('mdsData', JSON.stringify(e.data.res, " "));
          setModalIsOpen(false);
          setTimeElapsed(0);
        } else if (e.data.cmd === "message") {
          msgs.push(e.data.res);
          setDisplayMessage(msgs);
        }
      };
    }
    setStartMDS(false);
    setTimeElapsed(0);
  }, [startMDS]);


  const handleK = (v) => {
    setK(v)
    runMDS()
}

  return (
    <>

      {!modalIsOpen || (
        <MessageWithTimer messages={displayMessage} timeElapsed={timeElapsed} />
      )}

        <Grid sx={{ ml:2,marginTop: 2, marginBottom: 2, marginRight: 2 }}>
          {/* <Typography variant="h4">Multidimentional Scaling</Typography>

          <Typography variant="p">
            {`This tool computes and visualizes MDS coordinates based on the same genotypic data available for GWAS analyisis.`}
          </Typography> */}
        </Grid>
          <div padding={2}>

            <Grid container  sx={{ marginLeft: 2, marginBottom:2, marginTop :4  }}>
              <Autocomplete size="small"
              defaultValue={k}
  options={["2","3","4","5","6","7","8","9","10"]}
  sx={{ width: 250 }}
  renderInput={(params) => <TextField {...params} label="Set number of clusters (k)"/>}
  onChange={(e,v) => handleK(v)}
/>
              
<Button
              sx={{ marginLeft: 1, marginBottom:2  }}
              variant="contained"
              onClick={runMDS}
              color="primary"
            >
              perform MDS
            </Button>


            </Grid>

            {!mdsData || (
              <div>
                <MDSplot
                  plotSchema={{
                    plot_type: "mds",
                    inputData: mdsData,
                    variablesToPlot: ["C1", "C2"],
                    plotTitle: "Multidimentional Scaling",
                    xLable: "MDS Coordinate 1",
                    yLable: "MDS Coordinate 2",
                    isDark : isDarkMode
                  }}
                />
              </div>
            )}
          </div>



    </>
  );
}


