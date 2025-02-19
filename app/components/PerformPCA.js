"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  TextField,
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
import MenuItem from "@mui/material/MenuItem";
import { FormControl, InputLabel, Select } from "@mui/material";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { useTokenContext } from "../../contexts/TokenContext";
import { useApiContext } from "@/contexts/ApiEndPoint";
import { useUntwistThemeContext } from "../../contexts/ThemeContext";
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
import { generatePlinkFam, generatePlinkFamWithBLUPs } from "./utils";
import PCA from "./PCA";
import SearchGrid from "./Search";

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


export default function PerformPCA() {


  const token = useTokenContext();
  const {apiEndpoint} = useApiContext();


  const { projectIdentifier, setProjectIdentifier } = useAppDataContext();

  const { studies, setStudies } = useAppDataContext();
  const [pcaStudies, setPCAStudies] = useState([])
  const { isSmallScreen } = useAppDataContext();

  const [selectedPcaStudy, setSelectedPcaStudy] = useState("");
  const [studyMetaData, setStudyMetaData] = useState({});

  useEffect(() => {
    if (studies.length > 0) {
      let first_study = studies[0];
      setSelectedPcaStudy(first_study.study_identifier);
      setStudyMetaData(first_study)
    }
  }, [studies]);



  const { assays, setAssays } = useAppDataContext();

  const [showOntology, setShowOntology] = useState(false)


  useEffect(() => {
    const subset = studies.filter(study => study.study_type === 'gwas');
    setPCAStudies(subset);
  
  }, [studies]);


  useEffect(() => {
if(selectedPcaStudy){
  axios
  .post(`${apiEndpoint}/assays?studyId=${selectedPcaStudy}&token=${token.apiToken}`)
  .then((response) => {
    setAssays(response.data.result.data);
    let assayChecklist = new Array(response.data.result.data.length).fill(
      false
    ); // creates a dynamic list of boolean all set unchecked for the selected assays
    setChecked(assayChecklist);
  })
  .catch((error) => {
    // Handle errors
    console.error("Error:", error);
  });

}
  }, [selectedPcaStudy]);

  const { isDarkMode, toggleTheme } = useUntwistThemeContext();

  const [data, setData] = useState([]);

  // VisPehno
  const [selected_plot_type, setSelectedPlotType] = useState("");
  const [col_names, setColNames] = useState([]);
  const [col_names2, setColNames2] = useState([]);

  const [variablesToPlot, setVariablesToPlot] = useState([])

  const [open, setOpen] = useState(false);
  const [isToggled, setPlotIsToggled] = useState(false);
  const [plotSchema, setPlotSchema] = useState({});
  const [isNewSchema, setIsNewSchema] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const [plotTitle, setPlotTitle] = useState("");
  const [xLable, setXlable] = useState("");
  const [yLable, setYlable] = useState("");
  const [isMultiTrace, setIsMultiTrace] = useState(false);
  const [state, setState] = useState({});

  const [expFactors, setExpFactors] = useState(null);
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [divider, setDivider] = useState(null);

  const handleFactorCheckboxChange = (factor) => {
    var newFactor = factor ? factor : null 
    setDivider(newFactor);
    setSelectedFactor(newFactor);
  };

  const [famString, setFamString] = useState('')
  const fetch_trait_data = (tableNames, traits_list, token) => {
    axios
    .post(`${apiEndpoint}/assay/trait/data?assayTableNames=${tableNames}&variables=${traits_list}&token=${token.apiToken}`)
    .then((response) => {
      var data = JSON.parse(response.data.result.data);
      const expFactors = response.data.metadata.factors;
      const filteredFactors = Object.fromEntries(
        Object.entries(expFactors).filter(([_, value]) => value.length > 1)
      );
      setExpFactors(filteredFactors);
      // setLocationData(filteredData.location)
      handleFactorCheckboxChange(Object.keys(filteredFactors)[0]);
      setData(data);
      // const famString = generatePlinkFamWithBLUPs(data) 
      const famString = generatePlinkFam(data) 

      setFamString(famString)

      setPlotIsToggled(true);
      setShowOntology(true)

    });
  }



  const [tableNames, setTableNames] = useState([])

const handleVarsToPlot =  (vars) => {
  setShowOntology(false)
  setVariablesToPlot(vars)
  fetch_trait_data(tableNames,vars, token )
}

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
    setState(newState)
  };

  const handleClose = () => {
    setOpen(false);
    // setDivider(null)
    var varToPlot = getTrueKeys(state)
    if(varToPlot.length != 0){
      setState({})              //// if the users selects from the dialogue then reset else use the previous states selected. 
      handleVarsToPlot(varToPlot)
      fetch_trait_data(tableNames,varToPlot, token )  
    }else{
        fetch_trait_data(tableNames,variablesToPlot, token )      
    }

    // setState({})

  };

  useEffect(() => {
    if (
      selected_plot_type == "boxplot" ||
      // selected_plot_type == "line" ||
      selected_plot_type == "violin" ||
      selected_plot_type == "raincloud" ||
      selected_plot_type == "heatMap" ||
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
    if (data) {
      handlePLOT()
      setShowOntology(true)        // this place is crucial, to update the ontologies only after the data has been updated, it is set to false each time a variable is changed see above 
    }
  }, [
    selected_plot_type,
    plotTitle,
    xLable,
    yLable,
    data,
  ]);

useEffect(() => {
  if (data) {
    if (
      selected_plot_type == "bar" ||
      selected_plot_type == "line" ||
      selected_plot_type == "histogram" 

    ) {
      handlePLOT()
    }
  }


},[divider,selected_plot_type])

useEffect(() => {
  handlePLOT()
}, [divider])
  
  var handlePLOT = () => {

    var schema1 = {
      inputData: data,
      plot_type: "",
      variablesToPlot: variablesToPlot,
      plotTitle: plotTitle,
      xLable: xLable,
      yLable: yLable,
      isDark: isDarkMode,
      divider: divider,
    };


    if (selected_plot_type === "boxplot") {
      schema1.plot_type = "boxplot";
      schema1.variablesToPlot = variablesToPlot;
      setPlotSchema(schema1);


    } else if (selected_plot_type === "violin") {
      schema1.plot_type = "violin";
      schema1.variablesToPlot = variablesToPlot;
      setPlotSchema(schema1);



    } else if (selected_plot_type === "raincloud") {
      schema1.plot_type = "raincloud";
      schema1.variablesToPlot = variablesToPlot;
      setPlotSchema(schema1);


    } else if (selected_plot_type === "heatMap") {
      schema1.plot_type = "heatMap";
      schema1.variablesToPlot = variablesToPlot;
      setPlotSchema(schema1);


    } else if (selected_plot_type === "density_overlay") {
      schema1.plot_type = "density_overlay";
      schema1.variablesToPlot = variablesToPlot;
      setPlotSchema(schema1);


    } else if ((selected_plot_type === "scatter" || selected_plot_type === "linReg")) {

        schema1.plot_type = selected_plot_type;
        schema1.variablesToPlot = variablesToPlot.slice(0,3);
        setPlotSchema(schema1);


    }else{
      schema1.plot_type = selected_plot_type;
      schema1.variablesToPlot = variablesToPlot.slice(0,2) // in this slice the first variable is selectedXvar and the second is selectedYvar], this applies to single plot variables
      setPlotSchema(schema1);
    }

    // if (isNewSchema == 0) {
    //   setPlotSchema(schema1);
    // } else {
    //   var changedSchema = schema1;
    //   changedSchema.inputData = filteredData;
    //   setPlotSchema(changedSchema);
    // }
    
  };

  // FILTER OPTIONS

  const [filters, setFilters] = useState([
    { key: "", comparison: "", value: "", logicalOperator: "" },
  ]);

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      { key: "", comparison: "", value: "", logicalOperator: "AND" },
    ]);
    setFilteredData(filteredData);
  };

  const handleRemoveFilter = (index) => {
    setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
    setFilteredData(filteredData);
  };

  const handleResetFilters = () => {
    setFilters([{ key: "", comparison: "", value: "", logicalOperator: "" }]);
    setFilteredData(data);
  };

  const applyFilters = () => {
    const filteredData = data.filter((item) => {
      return filters.every((filter) => {
        const { key, comparison, value, logicalOperator } = filter;
        if (!key || !comparison || !value) {
          return true;
        }

        const itemValue = item[key];
        switch (comparison) {
          case "=":
            return itemValue === value;
          case "!=":
            return itemValue !== value;
          case "<":
            return itemValue < value;
          case ">":
            return itemValue > value;
          case "<=":
            return itemValue <= value;
          case ">=":
            return itemValue >= value;
          default:
            return true;
        }
      });
    });
    setFilteredData(filteredData);
    setIsNewSchema(+1);
  };

  // ASSAY OPTIONS

  const [checked, setChecked] = useState([]);

  const [selectedAssays, setSelectedAssays] = useState([]);
  // const [expFactors, setExpFactors] = useState([]);
  const [currentLocations, setCurrentLocations] = useState([]);
  const [locationData, setLocationData] = useState(null);

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


  const [assayDataForMap, setAssayDataForMap] = useState([])
  const [locationDataForMap, setLoctaionDataForMap] = useState([])


  const handleLocationData = async (assayIds) => {
            // Fetch locations
    const locations = await getLocations(assayIds, token.apiToken, apiEndpoint);
    // setCurrentLocations(locations);

    console.log('LOCATIONS', locations)


    var mapData = [];
    locations.forEach((instituteId) => {
if(instituteId){
  axios
  .post(
    `${apiEndpoint}/institute?instituteId=${instituteId}&token=${token.apiToken}`
  )
  .then((response) => {
    if (response.status === 200) {
      let institute_data = response.data.result.data; // Assuming structure
      mapData.push(institute_data[0]);
    } else {
      console.error("Error fetching location data:", response.statusText);
    }
  })
  .catch((error) => {
    console.error("Error fetching location data:", error);
  });

}

setLoctaionDataForMap(mapData)

var assayData = []
assays.forEach(assay => {
  if(assayIds.includes(assay.assay_identifier)){
    assayData.push({"Assay Name": assay.assay_name, "Locations" : assay.locations, "Institues" : assay.institutes, "treatments" : assay.associated_intervals, "tissuesMeasured" : assay.plant_anatomical_entities })
  }
})
setAssayDataForMap(assayData)
    });
   


  };



  const handleTraits= async (tableNames, assayIds) => {
    const response = await axios.post(
      `${apiEndpoint}/assay/traits?assayIds=${assayIds}&token=${token.apiToken}`
    );
    const response_data = response.data.result;
    setColNames(response_data);
};



const saveSelectedAssays = async (checked) => {
  try {
    // Check if any element in the array is true
    const anyTrue = checked.some((element) => element === true);

    if (anyTrue) {
      // Reset state
      setExpFactors(null);
      setData(null);
      setPlotIsToggled(false);

      // Prepare data for API requests
      const tableNames = [];
      const assayIds = [];

      const selectedAssays = assays.filter((assay, index) => checked[index]);

      selectedAssays.forEach((assay) => {
        tableNames.push(assay.assay_data_table_name);
        assayIds.push(assay.assay_identifier); // Assuming assayId is also the table name
      });

      handleLocationData(assayIds); //for the locations map
      handleTraits(tableNames, assayIds)
    }
  } catch (error) {
    console.error("Error saving selected assays:", error);
    // Optionally set error state or show an error message
  }
};

  


  // useEffect(() => {
  //   if (currentLocations) {
  //     handleLocationData(currentLocations);
  //   }
  // }, [currentLocations]);


  const TableNames = () => {
    var tableNames = [];
    assays
      .filter((assay, index) => checked[index])
      .map(
        (assay) => (
          {
            assay_name: assay.assay_name,
            assay_data_table_name: assay.assay_data_table_name,
          },
          tableNames.push(assay.assay_data_table_name)
        )
      );
    setTableNames(tableNames)
  }

  useEffect(() => {
    TableNames()
  }, [checked])

  const handleToggle = (index) => () => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    saveSelectedAssays(newChecked);
    setChecked(newChecked);
    setPlotIsToggled(false)
    setVariablesToPlot([])
    setSelectedPlotType("")
    setState({})
  };

  // const handleToggle = (index) => () => {
  //   const newChecked = new Array(assays.length).fill(false); // Reset all to false
  //   newChecked[index] = !checked[index]; // Set the clicked checkbox to its opposite value
  //   setChecked(newChecked); // Update state
  //   saveSelectedAssays(newChecked);
  //   setVariablesToPlot([])
  //   setSelectedPlotType("")
  //   setState({})
  // };



  // Handler for toggling "All" checkbox
  const handleToggleAll = (event) => {
    const newChecked = new Array(assays.length).fill(event.target.checked);
    saveSelectedAssays(newChecked);
    setChecked(newChecked);
    setVariablesToPlot([])
    setPlotIsToggled(false)
    setSelectedPlotType("")
    setState({})
  };

  const [itemsByCategory, setItemsByCategory] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);

  useEffect(() => {
    // col_names["Germplasm"] = ["line"];
    setItemsByCategory(col_names);
    var newCategoriesOrder = ["Germplasm", ...Object.keys(col_names)];
    setCategoryOrder(newCategoriesOrder);

    const new_col_names = Object.entries(col_names)
      .flatMap(([category, titles]) => {
        return titles.map((title) => ({ category, title }));
      })
      .sort((a, b) => {
        // Custom sorting function to prioritize 'Germplasm' category
        if (a.category === "Germplasm") return -1;
        if (b.category === "Germplasm") return 1;
        return 0;
      });
    // new_col_names
    setColNames2(new_col_names);
  }, [col_names]);

  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };


  const [distanceMethod, setDistanceMethod] = useState('euclidean')
  const disMethodsList = [
    // 'additiveSymmetric', 
    'avg', 
    'bhattacharyya', 
    // 'canberra', 
    'chebyshev', 
    // 'clark', 
    // 'czekanowski', 
    'dice', 
    // 'divergence', 
    'euclidean',
    'fidelity', 
    'gower',
    // 'harmonicMean'
    // ,'hellinger'
    ,'innerProduct'
    ,'intersection'
    ,'jaccard'
    ,'jeffreys'
    // ,'jensenDifference'
    // ,'jensenShannon'
    // ,'kdivergence'
    // ,'kulczynski'
    // ,'kullbackLeibler'
    // ,'kumarHassebrook'
    // ,'kumarJohnson'
    // ,'lorentzian'
    ,'manhattan'
    // ,'matusita'
    // ,'minkowski'
    // ,'motyka'
    // ,'neyman'
    ,'pearson'
    // ,'probabilisticSymmetric'
    // ,'ruzicka'
    // ,'soergel'
    // ,'sorensen'
    ,'squared'
    // ,'squaredChord'
    ,'squaredEuclidean'
    // ,'taneja'
    // ,'tanimoto'
    // ,'topsoe'
    // ,'waveHedges'
    ]

    const [selectedX, setSelectedXvar] = useState("")
    const [selectedY, setSelectedYvar] = useState("")

    const handleSelectedPcaStudy = (studyId) => {
      setSelectedPcaStudy(studyId)
      
      var resetChecked = checked.map(() => false);
      setChecked(resetChecked);
      setLocationData(null);
      setShowOntology(false)
    }
    


    const assaysLisTtest = [
      {
        name: 'Assay 1',
        locations: ['Location 1', 'Location 2'],
        treatments: ['Treatment A', 'Treatment B'],
        timeIntervals: ['10 minutes', '20 minutes'],
        tissuesMeasured: ['Tissue 1', 'Tissue 2'],
        replicates: ['Replicate 1', 'Replicate 2']
      },
      {
        name: 'Assay 2',
        locations: ['Location 3'],
        treatments: ['Treatment C'],
        timeIntervals: ['30 minutes'],
        tissuesMeasured: ['Tissue 3'],
        replicates: ['Replicate 3']
      }
    ];

    const timeIntervals = ["Time a", "Time b"];

    const handleSelection = (selectedItems) => {
      var studyId = selectedItems.study_identifier;
      handleSelectedPcaStudy(studyId);
      setStudyMetaData(selectedItems);

    };
  
  return (
    <>

    
<Grid sx={{ ml: 2, marginTop: 4, marginRight: 2, marginBottom : 2}}>
        
        <Typography variant="h8" color={'green'} fontWeight={'bold'}>Description: </Typography>

      <Typography variant="p">
        {`This tool visualizes the precomputed PCA coordinates based on the same genotypic data available for GWAS analyisis.`} For more details please see <b><a target="blind" href="https://ataulhaleem.github.io/camelina-hub-documentation/modules/Stratification/pca">documentation</a></b>
      </Typography>



      </Grid>
      {!selectedPcaStudy || (
        <div>
        {/* <Grid sx={{ mt: 2 }}>
          <Autocomplete
          size="small"
          defaultValue={studies[0].study_title}

            options={pcaStudies.map((study) => study.study_title)}
            renderInput={(params) => (
              <TextField {...params} label="Study Title" 
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: selectedPcaStudy ? 'green' : 'red',
                  },
                },
              }}
              />
            )}
            onChange={(e, value) => {
              const study = pcaStudies.find(
                (study) => study.study_title === value
              );             
              var studyId = study.study_identifier;
              handleSelectedPcaStudy(studyId);
              setStudyMetaData(study);
     
            }}
          />
        </Grid> */}

<SearchGrid  studies={pcaStudies} onSelection={handleSelection}></SearchGrid>
<Grid 
        container 
        direction={isSmallScreen ? 'column' : 'row'}  // Change direction based on screen size
        spacing={2} 
        columns={2} 
        sx={{ padding: 1 , width: isSmallScreen ? '50%' : '100%'}}
      >
        <Grid 
          item 
          sx={{ padding: 1, width: isSmallScreen ? '100%' : '50%' }}  // Change width based on screen size
        >
          <PCA studyId={selectedPcaStudy}/>
        </Grid>

        <Grid 
          item 
          sx={{ padding: 1, width: isSmallScreen ? '100%' : '50%' }}  // Change width based on screen size
        >
          {/* META DATA */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold">
                Meta Data
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box sx={{ bgcolor: 'background.paper' }}>
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
                    {/* <Tab label="Locations" {...a11yProps(1)} />
                    <Tab label="Layouts" {...a11yProps(2)} />
                    <Tab label="Protocols" {...a11yProps(3)} />
                    <Tab label="Notes" {...a11yProps(4)} /> */}
                  </Tabs>
                </AppBar>

                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <Typography color="green" variant="h6" fontWeight="bold">
                      Study Overview:
                    </Typography>

                    <StudyMetaData
                      studyMetaData={studyMetaData}
                      assays={assays.filter((assay, index) => checked[index])} // Pass only the selected assays
                    />
                  </TabPanel>

                  <TabPanel value={value} index={1} dir={theme.direction}>
                    {locationDataForMap ? (
                      <LocationMap assayData={assayDataForMap} mapData={locationDataForMap} />
                    ) : (
                      <h4>Please select an experiment</h4>
                    )}
                  </TabPanel>

                  <TabPanel value={value} index={2} dir={theme.direction}>
                    <Grid container columnGap={2} rowGap={2} direction="column">
                      <Grid item>
                        <Typography variant="h7" fontWeight="bold">
                          Assay Layouts:
                        </Typography>
                        <AssayLayout assays={assayDataForMap} />
                      </Grid>

                      <Grid item>
                        <Typography variant="h7" fontWeight="bold">
                          Experiment Layouts:
                        </Typography>
                        <Typography variant="body1">Not available</Typography>
                      </Grid>
                    </Grid>
                  </TabPanel>

                  <TabPanel value={value} index={3} dir={theme.direction}>
                    <ProtocolDisplay assayData={assayDataForMap} />
                  </TabPanel>

                  <TabPanel value={value} index={4} dir={theme.direction}>
                    <Typography>No comments available</Typography>
                  </TabPanel>
                </SwipeableViews>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
        </div>

    )}






    </>
  );
}

