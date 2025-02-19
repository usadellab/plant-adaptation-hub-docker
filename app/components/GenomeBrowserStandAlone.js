import React, { useEffect, useState } from "react";
import "@fontsource/roboto";
import {
  createViewState,
  JBrowseLinearGenomeView,
} from "@jbrowse/react-linear-genome-view";

// import { getSnapshot, onSnapshot } from "mobx-state-tree";
// import camregdata from "/public/genomeBrowser/2023_ExpressionDB_TPMs_RNAseqTracks.json";
// import GSE102422data from "/public/genomeBrowser/GSE102422_RNAseqTracks.json";
import { Autocomplete, Grid, TextField, Paper } from "@mui/material";
import assemblies from "/public/genomeBrowser/tracks/assemblies.json";

// const tracks = [
//   {
//     type: "VariantTrack",
//     trackId: "untwist_VCF",
//     name: "Untwist Variant",
//     assemblyNames: ["Camelina Sativa (Cs)"],
//     category: ["Variation data"],
//     adapter: {
//       type: "VcfTabixAdapter",
//       vcfGzLocation: {
//         uri: "/genomeBrowser/UNT54.lifted.sorted.vcf.bgzip",
//         locationType: "UriLocation",
//       },
//       index: {
//         location: {
//           uri: "/genomeBrowser/UNT54.lifted.sorted.vcf.bgzip.tbi",
//           locationType: "UriLocation",
//         },
//       },
//     },
//     displayMode: "compact",
//   },
//   ...camregdata,
//   ...GSE102422data,
// ];

function GenomeBrowserStandAlone() {

  const [selectedAssembly, setSelectedAssembly] = useState(assemblies[0]);

  const initialState = new createViewState({
    assembly: selectedAssembly,
    tracks: [
      ...(selectedAssembly?.variant_tracks || []), 
      ...(selectedAssembly?.rnaseq_tracks || []), 
      ...(selectedAssembly?.gff_track ? [selectedAssembly.gff_track] : []) 
    ],
  
    disableAddTracks: false,
    configuration: {},
    plugins: [],
    defaultSession: { name: `${selectedAssembly.name.replace(" ", "_")}"-session-view`, view: selectedAssembly.defaultSession , },
    configuration: {
      theme: {
        palette: {
          primary: { main: "#311b92" },
          secondary: { main: "#0097a7" },
        },
      },
    },
    onChange: () => {},
  });

  const [state, setState] = useState(initialState);

  useEffect(() => {
    const newState = new createViewState({
      assembly: selectedAssembly,
      tracks: [
        ...(selectedAssembly?.variant_tracks || []), 
        ...(selectedAssembly?.rnaseq_tracks || []), 
        ...(selectedAssembly?.gff_track ? [selectedAssembly.gff_track] : [])
      ],
      disableAddTracks: false,
      plugins: [
        /* runtime plugin definitions */
      ],
      defaultSession: {
        name: `${selectedAssembly.name.replace(" ", "_")}"-session-view`,
        view: selectedAssembly.defaultSession,
      },
      configuration: {
        theme: {
          palette: {
            primary: { main: "#311b92" },
            secondary: { main: "#0097a7" },
          },
        },
      },
      onChange: () => {},
    });

    setState(newState);
  }, [selectedAssembly]);

  // onSnapshot(state.session, (snapshot) => {
  //   // const selectedTrackIds = getSnapshot(snapshot.view.tracks)
  //   //   .filter((trackView) => trackView.visible)
  //   //   .map((trackView) => trackView.id);
  //   console.log("Selected Track IDs:", JSON.stringify(snapshot.view));
  // });

  const handleSelectedAssembly = (event, newValue) => {
    const assembly = assemblies.find((asm) => asm.name === newValue?.name);
    if (assembly) {
      setSelectedAssembly(assembly);
    }
  };

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          mx: "auto",
          mt: 5,
          p: 3,
        }}
      >
        <Grid container justifyContent="center" columnGap={2}>
          <Grid item>
            <Autocomplete
              size="small"
              sx={{ minWidth: 350 }}
              value={selectedAssembly}
              options={assemblies}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assembly Name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: selectedAssembly ? "green" : "red",
                      },
                    },
                  }}
                />
              )}
              onChange={handleSelectedAssembly}
            />
          </Grid>
        </Grid>
      </Paper>
      {!state || <JBrowseLinearGenomeView viewState={state} />}
    </div>
  );
}

export default GenomeBrowserStandAlone;
