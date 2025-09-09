"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  TextField,
  Slider,
} from "@mui/material";
import { Button } from "@mui/material";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import PlotlyPlots from "./PlotlyPlots2";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { useTokenContext } from "../../contexts/TokenContext";
import { useApiContext } from "@/contexts/ApiEndPoint";
import { useAppDataContext } from "@/contexts/AppDataContext";

import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import LocationMap from "./LocationMap";
import ProtocolDisplay from "./Protocols";
import StudyMetaData from "./StudyMetaData";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import HeatmapPlot from "./HeatMap";
import BioPortalAnnotator from "./BioPortalAnnotator";
import { capitalizeFirstLetter } from "./utils";
import AssayLayout from "./AssayLayout";
import Cookies from "js-cookie";
import DownloadTerms from "./DownloadTerms";

// import htmlToImage from 'html-to-image';
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import VariableSelectionDialog from "./VariableSelectionDialog";
import SearchGrid from "./Search";



import BarPlot from "./BarPlot";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.primary,
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export function VisPheno() {

  const token = useTokenContext();
  const { apiEndpoint } = useApiContext();

  const { phenotypeStudies, setPhenotypeStudies } = useAppDataContext();
  const { selectedPhenotypeStudy, setSelectedPhenotypeStudy } = useAppDataContext();
  const { phenotypeStudyMetaData, setPhenotypeStudyMetaData } = useAppDataContext();
  const { phenotypeSelectedStudyAssays, setPhenotypeSelectedStudyAssays } = useAppDataContext();
  const { phenotypeSelectedStudySelectedAssays, setPhenotypeSelectedStudySelectedAssays } = useAppDataContext();
  const { phenotypeSelectedStudySelectedAssaysPhenotypes, setPhenotypeSelectedStudySelectedAssaysPhenotypes } = useAppDataContext();
  const { phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype, setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype } = useAppDataContext();
  const {variablesToPlot, setVariablesToPlot} = useAppDataContext();
  const {phenotypeData, setPhenotypeData} = useAppDataContext();
  const {selected_plot_type, setSelectedPlotType} =  useAppDataContext();
  const {assayIds, setAssayIds} =  useAppDataContext()
  const {expFactors, setExpFactors} = useAppDataContext()
  const {selectedFactor, setSelectedFactor} = useAppDataContext()
  const {divider, setDivider} = useAppDataContext()
  const {counter, setCounter} = useAppDataContext()
  const {assayDataForMap, setAssayDataForMap} = useAppDataContext()
  const {locationDataForMap, setLoctaionDataForMap} = useAppDataContext()




  const handleSelectedPhenotypeStudy = (studyId) => {
    setSelectedPhenotypeStudy(studyId);

  };


  const [showOntology, setShowOntology] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const darkModeValue = Cookies.get("isDarkMode");
      setIsDarkMode(darkModeValue === "true");
    }, 1); // Check every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // VisPehno
  const [plotSize, setPlotSize] = useState(70);

  const [open, setOpen] = useState(false);
  const [isToggled, setPlotIsToggled] = useState(false);
  const [plotSchema, setPlotSchema] = useState({});
  const [plotTitle, setPlotTitle] = useState("");
  const [xLable, setXlable] = useState("");
  const [yLable, setYlable] = useState("");
  const [isMultiTrace, setIsMultiTrace] = useState(false);
  const [state, setState] = useState({});

  const handleFactorCheckboxChange = (factor) => {
    var newFactor = factor ? factor : null;
    setDivider(newFactor);
    setSelectedFactor(newFactor);
  };


  const handleVarsToPlot = (selectedValue) => {
    setCounter(counter + 1)
    setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype(selectedValue);



    // setPhenotypeData([])
    
    // setShowOntology(false);
    setVariablesToPlot([selectedValue]);
    // setPhenotypeData([])
  };

  function getTrueKeys(obj) {
    let result = [];
    for (let key in obj) {
      if (obj[key] === true) {
        result.push(key);
      }
    }
    return result;
  }

  const handleStateChange = (event) => {
    var newState = {
      ...state,
      [event.target.name]: event.target.checked,
    };
    setState(newState);
  };



  useEffect(() => {
    if (
      selected_plot_type == "box" ||
      // selected_plot_type == "line" ||
      selected_plot_type == "violin" ||
      selected_plot_type == "raincloud" ||
      selected_plot_type == "heatmap" ||
      selected_plot_type == "density_overlay"
    ) {
      setIsMultiTrace(true);
      setOpen(true);
      // var newState = {};
      // setState(newState);
    } else {
      setIsMultiTrace(false);
    }
  }, [selected_plot_type]);

  useEffect(() => {
    if (phenotypeData.length > 0) {
        handlePLOT();
        setShowOntology(true); // this place is crucial, to update the ontologies only after the data has been updated, it is set to false each time a variable is changed see above
    }
  }, [
    selected_plot_type,
    plotTitle,
    xLable,
    yLable,
    phenotypeData,
    isDarkMode,
    plotSize,
    phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype
  ]);

  useEffect(() => {
    if(divider){
      if (phenotypeData.length > 0) {
        if (
          selected_plot_type == "bar" ||
          selected_plot_type == "line" ||
          selected_plot_type == "histogram"
        ) {
          handlePLOT();
        }
      }
  
    }
  }, [divider]);


  var handlePLOT = () => {
    setPlotIsToggled(true)
    var schema1 = {
      inputData: phenotypeData,
      plot_type: "",
      variablesToPlot: variablesToPlot.map(variable => variable.title),
      plotTitle: plotTitle,
      xLable: xLable,
      yLable: yLable,
      isDark: isDarkMode,
      divider: divider,
      plotSize: plotSize,
    };
    if (selected_plot_type === "box") {
      schema1.plot_type = "box";
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title);
    } else if (selected_plot_type === "violin") {
      schema1.plot_type = "violin";
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title);
    } else if (selected_plot_type === "raincloud") {
      schema1.plot_type = "raincloud";
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title);
      // } else if (selected_plot_type === "heatmap") {
      //   schema1.plot_type = "heatmap";
      //   schema1.variablesToPlot = variablesToPlot;
      //   setPlotSchema(schema1);
    } else if (selected_plot_type === "density_overlay") {
      schema1.plot_type = "density_overlay";
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title);
    } else if (
      selected_plot_type === "scatter" ||
      selected_plot_type === "linear regression"
    ) {
      schema1.plot_type = selected_plot_type;
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title).slice(0, 2);
    } else {
      schema1.plot_type = selected_plot_type;
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title).slice(0, 2); // in this slice the first variable is selectedXvar and the second is selectedYvar], this applies to single plot variables
    }
    schema1.plotSize = plotSize;
    setPlotSchema(schema1);
  };


  // ASSAY OPTIONS

  async function getLocations(assayIds, token, apiEndpoint) {
    var newLocations = [];
    for (const assayId of assayIds) {
      const response = await axios.post(
        `${apiEndpoint}/samples?assayId=${assayId}&token=${token}`
      );
      const response_data = response.data.result.data;
      response_data.map((obj) => {
        newLocations.push(obj.sample_institute);
      }); // sample_institute is the institute_identifier used in the institutes table
    }
    return [...new Set(newLocations)];
  }



  const handleLocationData = async (assayIds) => {
    try {
      // Fetch locations
      const locations = await getLocations(assayIds, token.apiToken, apiEndpoint);
  
      let mapData = [];
      let assayData = [];
  
      // Use Promise.all to handle asynchronous requests in parallel
      const locationPromises = locations.map(async (instituteId) => {
        if (instituteId) {
          try {
            const response = await axios.post(
              `${apiEndpoint}/institute?instituteId=${instituteId}&token=${token.apiToken}`
            );
            if (response.status === 200) {
              let institute_data = response.data.result.data; // Assuming structure
              mapData.push(institute_data[0]);
            } else {
              console.error(
                "Error fetching location data:",
                response.statusText
              );
            }
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
        }
      });
  
      // Wait for all location requests to resolve
      await Promise.all(locationPromises);
  
      // Populate assayData after location requests are done
      phenotypeSelectedStudyAssays.forEach((assay) => {
        if (assayIds.includes(assay.assay_identifier)) {
          assayData.push({
            "Assay Name": assay.assay_name,
            Locations: assay.locations,
            Institutes: assay.institutes,
            treatments: assay.associated_intervals,
            tissuesMeasured: assay.plant_anatomical_entities,
          });
        }
      });
  
      // Update state only after all data is collected
      setLoctaionDataForMap(mapData);
      setAssayDataForMap(assayData);
  
    } catch (error) {
      console.error("Error handling location data:", error);
    }
  };
  

  useEffect(() => {
    if(assayIds.length > 0){
      handleLocationData(assayIds)
    }
  }, [assayIds])

  const handleToggle = (index) => () => {
    const newChecked = [...phenotypeSelectedStudySelectedAssays];
    newChecked[index] = !newChecked[index];
    setPhenotypeSelectedStudySelectedAssays(newChecked);
    setPlotIsToggled(false);
    setVariablesToPlot([]);
    setState({});

    var assayIds = [];
    if (phenotypeSelectedStudyAssays.length > 0) {
      phenotypeSelectedStudyAssays
        .filter((assay, index) => newChecked[index])
        .map((assay) => {
          assayIds.push(assay.assay_identifier);
        });
    }

    handleLocationData(assayIds)
  };

  const handleToggleAll = (event) => {
    const allTrue = phenotypeSelectedStudySelectedAssays.every(item => item === true);
    const newChecked = new Array(phenotypeSelectedStudySelectedAssays.length).fill(!allTrue);
    setPhenotypeSelectedStudySelectedAssays(newChecked);
    setVariablesToPlot([]);
    setState({});

    var assayIds = [];
    if (phenotypeSelectedStudyAssays.length > 0) {
      phenotypeSelectedStudyAssays
        .filter((assay, index) => newChecked[index])
        .map((assay) => {
          assayIds.push(assay.assay_identifier);
        });
    }
    handleLocationData(assayIds)
    
  };
  

  const [itemsByCategory, setItemsByCategory] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);

  useEffect(() => {
      const items_ByCategory = phenotypeSelectedStudySelectedAssaysPhenotypes.reduce((acc, cur) => {
        const { category, title } = cur;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(title);
        return acc;
      }, {});

      setItemsByCategory(items_ByCategory);
        var newCategoriesOrder = Object.keys(items_ByCategory) // customize order ["Germplasm", ...Object.keys(items_ByCategory)]; 
      setCategoryOrder(newCategoriesOrder);
  

  }, [phenotypeSelectedStudySelectedAssaysPhenotypes]);
  

  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const [distanceMethod, setDistanceMethod] = useState("euclidean");
  const disMethodsList = [
    // 'additiveSymmetric',
    "avg",
    "bhattacharyya",
    // 'canberra',
    "chebyshev",
    // 'clark',
    // 'czekanowski',
    "dice",
    // 'divergence',
    "euclidean",
    "fidelity",
    "gower",
    ,
    // 'harmonicMean'
    // ,'hellinger'
    "innerProduct",
    "intersection",
    "jaccard",
    "jeffreys",
    // ,'jensenDifference'
    // ,'jensenShannon'
    // ,'kdivergence'
    // ,'kulczynski'
    // ,'kullbackLeibler'
    // ,'kumarHassebrook'
    // ,'kumarJohnson'
    // ,'lorentzian'
    "manhattan",
    // ,'matusita'
    // ,'minkowski'
    // ,'motyka'
    // ,'neyman'
    "pearson",
    // ,'probabilisticSymmetric'
    // ,'ruzicka'
    // ,'soergel'
    // ,'sorensen'
    // ,'squared'
    // ,'squaredChord'
    "squaredEuclidean",
    // ,'taneja'
    // ,'tanimoto'
    // ,'topsoe'
    // ,'waveHedges'
  ];

  function valuetext(value) {
    setPlotSize(value);
    return `${value}°C`;
  }

  const [showTerms, setShowTerms] = useState(false);
  const [imageFormat, setImageFormat] = useState(null);



  const handleTermsAccepted = (value) => {
    if (value) {
      // if the user accepts the terms download the plot else not, value = boolean
      handleImageDownload(imageFormat);
    }
  };

  function getElementsWithSubstringInId(substring) {
    const allElements = document.getElementsByTagName('*'); // Get all elements in the document
    const matchingElements = [];
  
    for (let i = 0; i < allElements.length; i++) {
      const elementId = allElements[i].id;
      if (elementId && elementId.includes(substring)) {
        matchingElements.push(allElements[i]);
      }
    }
  
    return matchingElements;
  }


  // const handleImageDownload = (format) => {
  //   // Ensure a format is selected

  //   const plotElements = getElementsWithSubstringInId("plot-container"); // The container holding the plotly plot
  //   console.log(phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype)
  //   plotElements.forEach(plotElement => {
  //     if (!plotElement) {
  //       console.error("Plot container not found!");
  //       return;
  //     }
  
  //     if (format === "jpg" || format === "svg") {
  //       // Convert the plot to an image
  //       htmlToImage
  //         .toBlob(plotElement, { type: `image/${format}` })
  //         .then((blob) => {
  //           const url = window.URL.createObjectURL(blob);
  //           const a = document.createElement("a");
  //           a.href = url;
  //           a.download = `${phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype.title}_${plotElement.id.split('-')[0]}.${format}`;
  //           document.body.appendChild(a);
  //           a.click();
  //           window.URL.revokeObjectURL(url);
  //           document.body.removeChild(a);
  //         })
  //         .catch((error) => {
  //           console.error("Failed to download image:", error);
  //         });
  //     } else if (format === "pdf") {
  //       // Convert the plot to a PDF
  //       htmlToImage
  //         .toCanvas(plotElement)
  //         .then((canvas) => {
  //           const imgData = canvas.toDataURL("image/jpeg");
  //           const pdf = new jsPDF({
  //             orientation: "landscape",
  //             unit: "px",
  //             format: [canvas.width, canvas.height],
  //           });
  //           pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
  //           pdf.save("plot.pdf");
  //         })
  //         .catch((error) => {
  //           console.error("Failed to download PDF:", error);
  //         });
  //     } else {
  //       console.error("Unsupported format selected");
  //     }
  
  //   })

  // };


  const handleImageDownload = (format) => {
    // Ensure a format is selected
  
    const plotElements = getElementsWithSubstringInId("plot-container"); // The container holding the plotly plot
    console.log(phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype)
  
    plotElements.forEach(async (plotElement) => {
      if (!plotElement) {
        console.error("Plot container not found!");
        return;
      }
  
      if (format === "jpg" || format === "svg") {
        try {
          // Convert the plot to an image (await to ensure completion)
          const blob = await htmlToImage.toBlob(plotElement, { type: `image/${format}` });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype.title}_${plotElement.id.split('-')[0]}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error("Failed to download image:", error);
        }
      } else if (format === "pdf") {
        // Convert the plot to a PDF
        try {
          const canvas = await htmlToImage.toCanvas(plotElement);
          const imgData = canvas.toDataURL("image/jpeg");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
          pdf.save("plot.pdf");
        } catch (error) {
          console.error("Failed to download PDF:", error);
        }
      } else {
        console.error("Unsupported format selected");
      }
    });
  };
  const handleSelection = (selectedItems) => {
    setVariablesToPlot(selectedItems)
  };


  const handleClose = () => {
    setOpen(false);

    // setDivider(null)

    // console.log('state', state)


    // var varToPlot = getTrueKeys(state);
    // if (varToPlot.length != 0) {
    //   setState({}); //// if the users selects from the dialogue then reset else use the previous states selected.
    //   handleVarsToPlot(varToPlot);
    //   fetch_trait_data(tableNames, varToPlot, token);
    // } else {
    //   fetch_trait_data(tableNames, variablesToPlot, token);
    // }

    // setState({})
  };



  const [defaultY, setDefaultY] = useState(null)
  useEffect(() => {
    // console.log('phenotypeSelectedStudySelectedAssaysPhenotypes', phenotypeSelectedStudySelectedAssaysPhenotypes)
    if(phenotypeSelectedStudySelectedAssaysPhenotypes.length > 0){
      setDefaultY(phenotypeSelectedStudySelectedAssaysPhenotypes[1])
    }

  }, [phenotypeSelectedStudySelectedAssaysPhenotypes])



  const handleSelection2 = (selectedItems) => {
    var studyId = selectedItems.study_identifier;
    handleSelectedPhenotypeStudy(studyId);
    setPhenotypeStudyMetaData(selectedItems);

  };
  


  const {selectedFactors, setSelectedFactors} = useAppDataContext(); // Store selected factors in a list

    const handleFactorCheckboxChange2 = (factor) => {
      setSelectedFactors(prevFactors => {
            if (prevFactors.includes(factor)) {
                return prevFactors.filter(f => f !== factor); // Remove factor if already selected
            } else {
                return [...prevFactors, factor]; // Add factor if not already selected
            }
        });

        setDivider(prevFactors => {
          if (prevFactors.includes(factor)) {
              return prevFactors.filter(f => f !== factor); // Remove factor if already selected
          } else {
              return [...prevFactors, factor]; // Add factor if not already selected
          }
      });
    };

    
  return (
    <>
      <Grid sx={{ ml: 2, marginTop: 4, marginRight: 2, marginBottom: 2 }}>
        <Typography variant="h8" color={"green"} fontWeight={"bold"}>
          Description:{" "}
        </Typography>

        <Typography variant="p">
          {`This tool allows to visualize phenotypes collected as part of untwist project. Phenotypes are available using the drop downs in the Plotting Options menu. Users can also perform queries to filter the data based on any combination of phenotypes collected.`}{" "}
          For more details please see{" "}
          <b>
            <a
              target="blind"
              href="https://ataulhaleem.github.io/camelina-hub-documentation/modules/Phenology/vispheno"
            >
              documentation
            </a>
          </b>
        </Typography>
      </Grid>

      {!selectedPhenotypeStudy || (
        <div>

          {/* <Grid sx={{ mt: 2 }}>
            <Autocomplete
              size="small"
              defaultValue={StudyMetaData.study_title}
              options={phenotypeStudies.map((study) => study.study_title)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Study Title"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: selectedPhenotypeStudy ? "green" : "red",
                      },
                    },
                  }}
                />
              )}
              onChange={(e, value) => {
                const study = phenotypeStudies.find(
                  (study) => study.study_title === value
                );
                var studyId = study.study_identifier;
                handleSelectedPhenotypeStudy(studyId);
                setPhenotypeStudyMetaData(study);
              }}
            />

            
          </Grid> */}

<SearchGrid  studies={phenotypeStudies} onSelection={handleSelection2}></SearchGrid>


          <Grid container sx={{ padding: 1 }}>

            <Grid item xs={6}>
              
                <Grid sx={{ ml: 1, marginRight: 2 }}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h7" fontWeight="bold">
                        Experiments
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container direction="row"
  sx={{
    justifyContent: "space-between",
    alignItems: "flex-start"  }} >
<Grid item>
<Box
                display="flex"
                flexDirection="column"
                sx={{ mt: -2, ml: 1, mb : 4 }}
              >
                <FormControlLabel
                  sx={{ mt: -1 }}
                  control={
                    <Checkbox
                      checked={phenotypeSelectedStudySelectedAssays.every(Boolean)}
                      onClick={handleToggleAll}
                      disableRipple
                    />
                  }
                  label="All"
                  // onChange={handleToggleAll} // Add onChange event for the "All" checkbox
                />

                {phenotypeSelectedStudyAssays.map((assay, index) => (
                  <FormControlLabel
                    sx={{ mt: -1 }}
                    key={index}
                    control={
                      <Checkbox
                        checked={phenotypeSelectedStudySelectedAssays[index]}
                        onClick={handleToggle(index)}
                        disableRipple
                      />
                    }
                    label={capitalizeFirstLetter(assay.assay_name)}
                    // label={assay.assay_name}
                  />
                ))}

              </Box>
</Grid>

        
<Grid item >

  <div>
  {!selected_plot_type || (
                              <div>
                                {isMultiTrace ? (
                                  ""
                                ) : (
                                  <Grid
                                    className="top-grid"
                                    columns={2}
                                    columnGap={1}
                                  >
                                    {selected_plot_type == "histogram" ||
                                    selected_plot_type == "bar" ||
                                    selected_plot_type == "line" ? (


                                      
                                      
<div>
{!phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype || 
  <Autocomplete
  id="grouped-demo"
  value={phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype}
  defaultValue={phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype}
  options={phenotypeSelectedStudySelectedAssaysPhenotypes}
  groupBy={(option) => option.category}
  getOptionLabel={(option) => option.title}
  sx={{ mt : -3, mb : 1, maxWidth : 300}}
  size="small"
  renderInput={(params) => (
    <TextField {...params} label="select variable" />
  )}
  renderGroup={(params) => (
    <li
      key={params.key}
      style={{ marginBottom: "1.5rem" }}
    >
      <h4
        style={{
          color: "green",
          textDecoration: "underline",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          marginBottom: "0.5rem",
        }}
      >
        {capitalizeFirstLetter(params.group).replaceAll("_", " ")}
      </h4>
      <ul
        style={{
          listStyleType: "disc",
          paddingLeft: "1.5rem",
        }}
      >
        {params.children}
      </ul>
    </li>
  )}


  onChange={(event, selectedValue) => {
    setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype(selectedValue)
      // setVariablesToPlot([selectedValue.title])
      setVariablesToPlot([selectedValue])
  }}
/>
}



</div>








                                    ) : (
                                      <Grid
                                        // sx={{ marginTop: 2 }}
                                        className="top-grid"
                                        container
                                        columns={2}
                                        columnGap={1}
                                        rowGap={1}
                                      >


{!phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype || 

<div>

<Autocomplete
  id="grouped-demo-x"
  value={phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype}
  defaultValue={phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype}
  options={phenotypeSelectedStudySelectedAssaysPhenotypes}
  groupBy={(option) => option.category}
  getOptionLabel={(option) => option.title}
  sx={{ width: 300 }}
  size="small"
  renderInput={(params) => (
    <TextField {...params} label="select x-variable" />
  )}
  renderGroup={(params) => (
    <li
      key={params.key}
      style={{ marginBottom: "1.5rem" }}
    >
      <h4
        style={{
          color: "green",
          textDecoration: "underline",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          marginBottom: "0.5rem",
        }}
      >
        {capitalizeFirstLetter(params.group).replaceAll("_", " ")}
      </h4>
      <ul
        style={{
          listStyleType: "disc",
          paddingLeft: "1.5rem",
        }}
      >
        {params.children}
      </ul>
    </li>
  )}
  
  onInputChange={() => {
    // Make sure to keep x-variable in index 0
    let newVarsToPlot = [...variablesToPlot];
    newVarsToPlot[0] = phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype;
    setVariablesToPlot(newVarsToPlot);
  }}

  onChange={(event, selectedValue) => {
    // Make sure to update x-variable in index 0
    let newVarsToPlot = [...variablesToPlot];
    newVarsToPlot[0] = selectedValue;
    setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype(selectedValue);
    setVariablesToPlot(newVarsToPlot);
  }}
/>

<Autocomplete
  id="grouped-demo-y"
  value={defaultY}
  defaultValue={defaultY}
  options={phenotypeSelectedStudySelectedAssaysPhenotypes}
  groupBy={(option) => option.category}
  getOptionLabel={(option) => option.title}
  sx={{ width: 300 }}
  size="small"
  renderInput={(params) => (
    <TextField {...params} label="choose y-variable" />
  )}
  renderGroup={(params) => (
    <li
      key={params.key}
      style={{ marginBottom: "1.5rem" }}
    >
      <h4
        style={{
          color: "green",
          textDecoration: "underline",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          marginBottom: "0.5rem",
        }}
      >
        {capitalizeFirstLetter(params.group).replaceAll("_", " ")}
      </h4>
      <ul
        style={{
          listStyleType: "disc",
          paddingLeft: "1.5rem",
        }}
      >
        {params.children}
      </ul>
    </li>
  )}
  
  onInputChange={() => {
    setVariablesToPlot([phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype,defaultY]);

  }}

  onChange={(event, selectedValue) => {
    setDefaultY(selectedValue);
    setVariablesToPlot([phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype,selectedValue]);
  }}
/>  

</div>

}

                                                      

                                                                                  
                                                                                
                                                                                
                                                                            

                                      </Grid>
                                    )}
                                  </Grid>
                                )}

                              </div>
                            )}
  </div>

<div>
<Accordion   sx={{ mb : 1, maxWidth : 300}} >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h7" fontWeight="bold">
                            Edit Plot Labels (optional)
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid
                            // sx={{ marginTop: 2 }}
                            // className="top-grid"
                            container
                            // columns={3}
                            columnGap={1}
                            rowGap={1}
                          >
                            <TextField
                              size="small"
                              sx={{ width: 200 }}
                              onChange={(e) => {
                                setPlotTitle(e.target.value);
                              }}
                              label="Update  plot title (optional)"
                            ></TextField>

                            <TextField
                              size="small"
                              sx={{ width: 200 }}
                              onChange={(e) => {
                                setXlable(e.target.value);
                              }}
                              label="Update  x label (optional)"
                            ></TextField>

                            <TextField
                              size="small"
                              sx={{ width: 200 }}
                              onChange={(e) => {
                                setYlable(e.target.value);
                              }}
                              label="Update  y label (optional)"
                            ></TextField>

                            <Button
                              variant="outlined"
                              onClick={() => {
                                setXlable("");
                                setYlable("");
                                setPlotTitle("");
                              }}
                            >
                              Reset
                            </Button>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
</div>

                        <Grid
                                                      container
                                                      direction="column"
                                                      sx={{
                                                        justifyContent: "space-between",
                                                        alignItems: "flex-start",
                                                        mt : 1
                                                      }}                        >

                          <Grid >
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Grid item>
                                <Typography>Resize Image: </Typography>
                              </Grid>

                              <Grid item>
                                <Box sx={{ width: 180, mt : 1 }}>
                                  <Slider
                                    color="secondary"
                                    aria-label="Temperature"
                                    defaultValue={70}
                                    getAriaValueText={valuetext}
                                    valueLabelDisplay="auto"
                                    shiftStep={30}
                                    step={10}
                                    marks
                                    min={20}
                                    max={100}
                                  />
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid >
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                justifyContent: "center",
                                alignItems: "center",

                              }}
                            >
                              <Grid item>
                                <Typography>Download Image: </Typography>
                              </Grid>
                              <Grid item>
                                <Autocomplete
                                  size="small"
                                  id="grouped-demo"
                                  options={["jpg", "svg", "pdf"]}
                                  sx={{ width: 160, mb : 2 }}
                                  renderInput={(params) => (
                                    <TextField {...params} label="format" />
                                  )}
                                  onChange={(event, newValue) => {
                                    setImageFormat(newValue);
                                    setShowTerms(true);
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>



                        <div>
  {!expFactors || (

<Grid
container
direction="column"
spacing={2}
sx={{
  justifyContent: "flex-start",
  alignItems: "left",
}}
>
{(selected_plot_type === "scatter" || 
  selected_plot_type === "linear regression" || 
  Object.keys(expFactors).length < 2) ? null : (
  <>
    {/* Title for the checkboxes */}
    <Grid item>
      <Typography>{'Shuffle: '}</Typography>
    </Grid>


    <Grid
      container
      direction="row"
      spacing={2}
      sx={{
        ml : 0.1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {(selected_plot_type === "scatter" || 
        selected_plot_type === "linear regression" || 
        Object.keys(expFactors).length < 2) ? null : (
        <>

          {/* Checkboxes */}
          {/* {Object.entries(expFactors).map(([category, value], index) => (
            <Grid item key={index}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={selectedFactor === category}
                  onChange={() => handleFactorCheckboxChange(category)}
                  style={{ marginRight: "8px" }}
                />
                {category}
              </label>
            </Grid>
          ))} */}


{Object.entries(expFactors).map(([category, value], index) => (
                <Grid item key={index}>
                    <label style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="checkbox"
                            checked={selectedFactors.includes(category)} // Check if category is in the list
                            onChange={() => handleFactorCheckboxChange2(category)}
                            style={{ marginRight: "8px" }}
                        />
                        {category}
                    </label>
                </Grid>
            ))}

            {/* Display the selected factors (for demonstration) */}
            {/* <div>
                Selected Factors: {selectedFactors.length === 0 ? "None" : selectedFactors.join(", ")}
            </div> */}


        </>
      )}
    </Grid>



  </>
)}
</Grid>



  )}
</div>






</Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {!phenotypeSelectedStudySelectedAssays.some((x) => x == true) || (
                    <div>


{!isToggled || (

  <div>





                        <Item
                          style={{ background: isDarkMode ? "black" : "white" }}
                          sx={{
                            marginTop: 1,
                            border: 1,
                            borderColor: "lightblue",
                          }}
                        >
                          {selected_plot_type === "heatmap" ? (
                            <div>
                              <Autocomplete
                                size="small"
                                defaultValue="euclidean"
                                options={disMethodsList}
                                onChange={(e, v) => setDistanceMethod(v)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Distance Method"
                                    variant="outlined"
                                  />
                                )}
                              />
                              <HeatmapPlot
                                data={phenotypeData}
                                distanceMethod={distanceMethod}
                                plotTitle={plotTitle || "Heat Map"}
                                xLabel={""}
                                heatmapWidth={570}
                                heatmapHeight={1000}
                                dendrogramWidth={220}
                                dendrogramHeight={875}
                              />
                            </div>
                          ) : (
                            // <h1>here comes the plot</h1>
                            <PlotlyPlots plotSchema={plotSchema} />
                          )}
                        </Item>



                        <Accordion defaultExpanded sx={{mt: 1, mb : 1, padding : 1}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h7" fontWeight="bold">
                        Statistical Analysis
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                   {(plotSchema?.inputData?.length > 0) &&  <PhenotypStummary plotType={plotSchema.plotType} // Specify the plot type
inputData={plotSchema.inputData} // Pass the structured input data
// selectedVars={plotSchema.variablesToPlot} // Specify the variable(s) to plot
// plotTitle={plotSchema.plotTitle} // Title of the plot
// xLable={plotSchema.xLable} // Label for the x-axis
// yLable={plotSchema.yLable} // Label for the y-axis
// isDark={false} // Dark mode toggle
// textColor="#000000" // Text color
// divider={plotSchema.divider} // Field used to group data
// plotSize={plotSchema.plotSize} // Size of the plot
/>}

                    </AccordionDetails>
                  </Accordion>
  




                   </div>     
                      )}





                    </div>
                  )}

<VariableSelectionDialog
  open={open}
  handleClose={handleClose}
  categoryOrder={categoryOrder}
  itemsByCategory={itemsByCategory}
  isDarkMode={isDarkMode}
  onSelection={handleSelection}
  study_identifier={selectedPhenotypeStudy}
/>

                  {/* <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{
                      style: { background: isDarkMode ? "grey" : "white" },
                    }}
                  >
                    <DialogTitle>Select variables</DialogTitle>

                    <DialogContent>
                      <div>
                        {categoryOrder
                          .filter(
                            (category) =>
                              itemsByCategory !== null &&
                              itemsByCategory[category]
                          )
                          .map((category) => (
                            <div key={category}>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", marginBottom: 2 }}
                                color="green"
                              >
                                {category}
                              </Typography>
                              <FormGroup
                                variant="standard"
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                {itemsByCategory !== null &&
                                  itemsByCategory[category]?.map((item) => (
                                    <div
                                      key={item}
                                      style={{
                                        width: "480px",
                                        marginRight: "16px",
                                      }}
                                    >
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            onChange={handleStateChange}
                                            name={item}
                                          />
                                        }
                                        label={item}
                                      />
                                    </div>
                                  ))}
                              </FormGroup>
                            </div>
                          ))}
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="contained"
                        onClick={handleClose}
                        color="primary"
                      >
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                   */}
                </Grid>
                
            </Grid>

            <Grid item xs={6}>
              <div>
                <Box
                //  sx={{border:1, borderBlockColor:'green', borderWidth:2, mr : 1}}
                >
                  {/* <Typography variant="h6">Meta data</Typography> */}
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" fontWeight="bold">
                        Meta Data
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Box sx={{ bgcolor: "background.paper" }}>
                        <AppBar position="static">
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                          >
                            <Tab label="Description" {...a11yProps(0)} />
                            <Tab label="Locations" {...a11yProps(1)} />
                            <Tab label="Layouts" {...a11yProps(2)} />
                            <Tab label="Protocols" {...a11yProps(3)} />
                            <Tab label="Notes" {...a11yProps(4)} />
                          </Tabs>
                        </AppBar>

                        <SwipeableViews
                          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                          index={value}
                          onChangeIndex={handleChangeIndex}
                        >
                          <TabPanel
                            value={value}
                            index={0}
                            dir={theme.direction}
                          >
                            <Typography
                              color="green"
                              variant="h6"
                              fontWeight="bold"
                            >
                              Study Overview:
                            </Typography>

                            <StudyMetaData
                              studyMetaData={phenotypeStudyMetaData}
                              assays={phenotypeSelectedStudyAssays.filter(
                                (assay, index) => phenotypeSelectedStudySelectedAssays[index]
                              )} //pass only the selected assays
                            />
                            
                      {/* <div>

                      { !showOntology || <BioPortalAnnotator 
                    termsToSearch={[
                      ...variablesToPlot.filter(item => item.title !== 'line').map(variable => variable.title),
                      ...phenotypeSelectedStudyAssays.filter((assay, index) => phenotypeSelectedStudySelectedAssays[index]).map(assay => assay.assay_name)
                    ]} 
                    />} 
                      </div> */}
                          </TabPanel>

                          <TabPanel
                            value={value}
                            index={1}
                            dir={theme.direction}
                          >
                            {locationDataForMap ? (
                              <LocationMap
                                assayData={assayDataForMap}
                                mapData={locationDataForMap}
                              />
                            ) : (
                              <h4>Please select an experiment</h4>
                            )}
                          </TabPanel>

                          <TabPanel
                            value={value}
                            index={2}
                            dir={theme.direction}
                          >
                            <h4>coming soon ... </h4>
                            {/* <Grid container columnGap={2} rowGap={2} direction="column">

                    <Grid item>
                    <Typography variant="h7" fontWeight={'bold'}>Assay Layouts:</Typography>
                    <AssayLayout assays={assayDataForMap} />

                    </Grid>
                    
                    <Grid item>
                    <Typography variant="h7" fontWeight={'bold'}>Experiment Layouts:</Typography>
                    <Typography variant="body1" >Not available</Typography>

                    </Grid>
                    </Grid> */}
                          </TabPanel>

                          <TabPanel
                            value={value}
                            index={3}
                            dir={theme.direction}
                          >
                            {/* { showOntology ? <BioPortalAnnotator termsToSearch={variablesToPlot} /> : <Typography>Please Select a trait</Typography>} */}
                            <ProtocolDisplay assayData={assayDataForMap} />
                          </TabPanel>

                          <TabPanel
                            value={value}
                            index={4}
                            dir={theme.direction}
                          >
                            <Typography>No comments available</Typography>
                          </TabPanel>
                        </SwipeableViews>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </div>
            </Grid>

          </Grid>
        </div>
      )}

      {!showTerms || (
        <Grid container spacing={2}>
          {/* <DownloadTerms showTerms={showTerms} /> */}
          <div style={styles.overlay}>
            <div style={styles.messageBox}>
              <Grid container maxWidth={1000}>
                <Grid item>
                  <DownloadTerms />
                </Grid>

                <Grid
                  container
                  spacing={2}
                  direction="row"
                  sx={{
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Grid item>
                    <Button
                      variant={"outlined"}
                      onClick={(e, v) => {
                        setShowTerms(!showTerms);
                        handleTermsAccepted(true);
                      }}
                    >
                      Accept
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant={"outlined"}
                      onClick={(e, v) => {
                        setShowTerms(!showTerms);
                        handleTermsAccepted(false);
                      }}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      )}

    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredContent: {
    backgroundColor: "transparent",
    textAlign: "center",
    zIndex: 10000,
  },
  messageBox: {
    // height: 240, // Fixed height for the message box
    overflow: "hidden", // Hide overflow content
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    textAlign: "center",
    margin: "0 auto",
  },
};

