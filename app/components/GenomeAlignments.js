import React, { useState } from "react";
import { Grid, Paper, Autocomplete, TextField } from "@mui/material";
import {
  createViewState,
  JBrowseLinearGenomeView,
} from "@jbrowse/react-linear-genome-view";
import assemblies from "../../public/genomeBrowser/tracks/assemblies.json";
// import { getSnapshot, onSnapshot } from "mobx-state-tree";

function GenomeAlignments() {
  const [selectedGenome1, setSelectedGenome1] = useState(assemblies[0]);
  const [selectedGenome2, setSelectedGenome2] = useState(assemblies[7]);

  const viewState = createViewState({
    assembly: selectedGenome1,
    plugins: [], //[new DotplotPlugin()], // Use the imported plugin directly
    tracks: [
      ...(selectedGenome1?.gff_track ? [selectedGenome1.gff_track] : []),
      ...(selectedGenome1?.rnaseq_tracks || []),
      {
        trackId: "my_alignments_track",
        name: `Genome Alignment ${selectedGenome1.name} vs ${selectedGenome2.name}`,
        assemblyNames: [selectedGenome1.name, selectedGenome2.name],
        type: "AlignmentsTrack",
        adapter: {
          type: "BamAdapter",
          bamLocation: {
            uri: `/genomeBrowser/genome_alignments/${
              selectedGenome1.name.split("(")[1].split(")")[0]
            }_vs_${selectedGenome2.name.split("(")[1].split(")")[0]}.bam`,
          },
          index: {
            location: {
              uri: `/genomeBrowser/genome_alignments/${
                selectedGenome1.name.split("(")[1].split(")")[0]
              }_vs_${selectedGenome2.name.split("(")[1].split(")")[0]}.bam.bai`,
            },
          },
        },
      },
    ],
    disableAddTracks: true,
    // defaultSession: { name: `${selectedGenome1.name.replace(" ", "_")}"-session-view`, view: selectedGenome1.defaultSession},
    
    defaultSession: {
      name: "alignment-session",
      view: {
        id: "linearGenomeView",
        minimized: false,
        type: "LinearGenomeView",
        offsetPx: 108699,
        bpPerPx: 109.8963963963964,
        displayedRegions: [
          {
            reversed: false,
            refName: "1",
            start: 0,
            end: 23241285,
            assemblyName: "Camelina Sativa (Cs)",
          },
        ],
        // tracks: selectedGenome1.defaultSession
        tracks: [
          {
            id: "xk1LyULOmRJbbYCD8Nz3Q",
            type: "ReferenceSequenceTrack",
            configuration: "Camelina_Sativa_(Cs)-genome",
            minimized: false,
            displays: [
              {
                id: "HhaEuA_uKlF8ZyEnUwQac",
                type: "LinearReferenceSequenceDisplay",
                heightPreConfig: 50,
                configuration:
                  "Camelina_Sativa_(Cs)-genome-LinearReferenceSequenceDisplay",
                showForward: true,
                showReverse: true,
                showTranslation: true,
              },
            ],
          },
          {
            id: "4muWj1mGN4NMIUedViklR",
            type: "FeatureTrack",
            configuration: "Camelina_Sativa_(Cs)_GFF",
            minimized: false,
            displays: [
              {
                id: "3kM7m4H3LTXt7d2CcFLAg",
                type: "LinearBasicDisplay",
                configuration: "Camelina_Sativa_(Cs)_GFF-LinearBasicDisplay",
              },
            ],
          },
          {
            id: "t8pYW80bvzfy6cbPoR2hD",
            type: "AlignmentsTrack",
            configuration: "my_alignments_track",
            minimized: false,
            displays: [
              {
                id: "jS4w7W-8oWHrArJZ1MsFU",
                type: "LinearAlignmentsDisplay",
                PileupDisplay: {
                  id: "s_ZPrbstR_TsAAWr8N--B",
                  type: "LinearReadArcsDisplay",
                  heightPreConfig: 205,
                  userByteSizeLimit: 5474395,
                  configuration: {
                    type: "LinearReadArcsDisplay",
                    displayId:
                      "my_alignments_track-LinearAlignmentsDisplay_LinearReadArcsDisplay_xyz",
                  },
                  filterBy: { flagInclude: 0, flagExclude: 1540 },
                  lineWidth: 5,
                  drawInter: true,
                  drawLongRange: true,
                },
                SNPCoverageDisplay: {
                  id: "jV3Z4ReAgMPEhB2xSuzC-",
                  type: "LinearSNPCoverageDisplay",
                  heightPreConfig: 45,
                  userByteSizeLimit: 5624503,
                  configuration: {
                    type: "LinearSNPCoverageDisplay",
                    displayId:
                      "my_alignments_track-LinearAlignmentsDisplay_snpcoverage_xyz",
                  },
                  selectedRendering: "",
                  resolution: 1,
                  constraints: {},
                  filterBy: { flagInclude: 0, flagExclude: 1540 },
                  jexlFilters: [],
                },
                snpCovHeight: 45,
                configuration: "my_alignments_track-LinearAlignmentsDisplay",
                lowerPanelType: "LinearReadArcsDisplay",
              },
            ],
          },
          {
            id: "6EEPpU5feoRejXrAQAYhm",
            type: "QuantitativeTrack",
            configuration: "DH55_root_salt_CPM",
            minimized: false,
            displays: [
              {
                id: "TfLDoZCYlsdx--APurujd",
                type: "LinearWiggleDisplay",
                configuration: "DH55_root_salt_CPM-LinearWiggleDisplay",
                selectedRendering: "",
                resolution: 1,
                constraints: {},
              },
            ],
          },
          {
            id: "4wHZCBjzT8rUhHSdpSwYw",
            type: "QuantitativeTrack",
            configuration: "DH55_root_control_CPM",
            minimized: false,
            displays: [
              {
                id: "w376P3lwlLO1gg5MEvImG",
                type: "LinearWiggleDisplay",
                configuration: "DH55_root_control_CPM-LinearWiggleDisplay",
                selectedRendering: "",
                resolution: 1,
                constraints: {},
              },
            ],
          },
          {
            id: "ftd6vwFGsjd6zb-s9xJUq",
            type: "QuantitativeTrack",
            configuration: "DH55_shoot_control_CPM",
            minimized: false,
            displays: [
              {
                id: "4xshewb86_RoQhDPB60nn",
                type: "LinearWiggleDisplay",
                configuration: "DH55_shoot_control_CPM-LinearWiggleDisplay",
                selectedRendering: "",
                resolution: 1,
                constraints: {},
              },
            ],
          },
          {
            id: "hPfECOtnCzC63B1ddgvAz",
            type: "QuantitativeTrack",
            configuration: "DH55_shoot_salt_CPM",
            minimized: false,
            displays: [
              {
                id: "W3oHNtD-rZyuNL7dRN9oX",
                type: "LinearWiggleDisplay",
                configuration: "DH55_shoot_salt_CPM-LinearWiggleDisplay",
                selectedRendering: "",
                resolution: 1,
                constraints: {},
              },
            ],
          },
        ],
        hideHeader: false,
        hideHeaderOverview: false,
        hideNoTracksActive: false,
        trackSelectorType: "hierarchical",
        showCenterLine: false,
        showCytobandsSetting: true,
        trackLabels: "",
        showGridlines: true,
        highlight: [],
        colorByCDS: false,
        showTrackOutlines: true,
      },
    },
    // 1:11,945,627..12,189,596
    configuration: {
      theme: {
        palette: {
          primary: { main: "#311b92" },
          secondary: { main: "#0097a7" },
        },
      },
    },
  });

  const handleSelectedGenome1 = (event, newValue) => {
    const assembly = assemblies.find((asm) => asm.name === newValue?.name);
    if (assembly) setSelectedGenome1(assembly);
  };

  const handleSelectedGenome2 = (event, newValue) => {
    const assembly = assemblies.find((asm) => asm.name === newValue?.name);
    if (assembly) setSelectedGenome2(assembly);
  };

  // onSnapshot(viewState.session, (snapshot) => {
  //   // const selectedTrackIds = getSnapshot(snapshot.view.tracks)
  //   //   .filter((trackView) => trackView.visible)
  //   //   .map((trackView) => trackView.id);
  //   console.log("Selected Track IDs:", JSON.stringify(snapshot.view));
  // });

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
              value={selectedGenome1}
              options={[assemblies[0]]}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Target genome"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: selectedGenome1 ? "green" : "red",
                      },
                    },
                  }}
                />
              )}
              onChange={handleSelectedGenome1}
            />
          </Grid>
          <Grid item>
            <Autocomplete
              size="small"
              sx={{ minWidth: 350 }}
              value={selectedGenome2}
              options={assemblies}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Query genome"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: selectedGenome2 ? "green" : "red",
                      },
                    },
                  }}
                />
              )}
              onChange={handleSelectedGenome2}
            />
          </Grid>
        </Grid>
      </Paper>
      <JBrowseLinearGenomeView viewState={viewState} />
    </div>
  );
}

export default GenomeAlignments;
