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

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";

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

import BioPortalAnnotator from "./BioPortalAnnotator";
import { capitalizeFirstLetter } from "./utils";
import AssayLayout from "./AssayLayout";
import GWAS from "./GWAS";
import { generatePlinkFam, generatePlinkFamWithBLUPs } from "./utils";
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

export default function PerformGWAS() {

  const token = useTokenContext();
  const {apiEndpoint} = useApiContext();
  // const { studies, setStudies } = useAppDataContext();
  const {gwasStudies, setGwasStudies} = useAppDataContext();
  const {selectedGwasStudy, setSelectedGwasStudy} = useAppDataContext();
  const {gwasStudyMetaData, setGwasStudyMetaData} = useAppDataContext();
  const { gwasAssays, setGwasAssays } = useAppDataContext();
  const {selectedGwasAssays, setSelectedGwasAssays} = useAppDataContext();
  const {gwasTraits, setGwasTraits} = useAppDataContext();
  const {selectedGwasTrait, setSelectedGwasTrait} =  useAppDataContext();



  const [showOntology, setShowOntology] = useState(false)
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();
  const [data, setData] = useState([]);

  // VisPehno
  // const [col_names, setColNames] = useState([]);
  // const [col_names2, setColNames2] = useState([]);

  const [variablesToPlot, setVariablesToPlot] = useState([])


  const [expFactors, setExpFactors] = useState(null);
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [divider, setDivider] = useState(null);

  const handleFactorCheckboxChange = (factor) => {
    var newFactor = factor ? factor : null 
    setDivider(newFactor);
    setSelectedFactor(newFactor);
  };

  const {famString, setFamString} = useAppDataContext();

  // const fetch_trait_data = (trait) => {


  //   const newTraitList = [
  //     { tableName : trait['category'], 
  //       variableName :  trait['title'], 
  //       study_identifier : trait['study_identifier']}
  //   ]
  //   axios
  //   .post(`${apiEndpoint}/assay/trait/data`,  // Endpoint URL without query parameters
  //     { // Passing data in the request body
  //       token: token.apiToken, 
  //       traitList: newTraitList  // Pass the trait_list directly, no need to stringify or encode it
  //     },
  //     {
  //       headers: {
  //         'Content-Type': 'application/json'  // Correct Content-Type header
  //       }
  //     }
  //   )
  //     .then((response) => {
  //       var data = JSON.parse(response.data.result.data);
  //       setData(data);
  //       const famString = generatePlinkFam(data) 
  //       setFamString(famString)
  //       setShowOntology(true)
  //     });

  // }

  // useEffect(() => {
  //   if(selectedGwasTrait){
  //     console.log('SELECTED TRAIT', selectedGwasTrait)

  //     fetch_trait_data(selectedGwasTrait)

  //   }
  // }, [selectedGwasTrait])

  const [tableNames, setTableNames] = useState([])

// const handleVarsToPlot =  (vars) => {

//   console.log('selectedValue', selectedValue)
//   // setShowOntology(false)
//   // setVariablesToPlot(vars)
//   // fetch_trait_data(tableNames,vars, token )

//   // setCounter(counter + 1)
//   setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype(selectedValue);


// }

  function getTrueKeys(obj) {
    let result = [];
    for (let key in obj) {
        if (obj[key] === true) {
            result.push(key);
        }
    }
    return result;
}


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


  const [assayDataForMap, setAssayDataForMap] = useState([])
  const [locationDataForMap, setLoctaionDataForMap] = useState([])


  const handleLocationData = async (assayIds) => {
            // Fetch locations
    const locations = await getLocations(assayIds, token.apiToken, apiEndpoint);
    // setCurrentLocations(locations);
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
gwasAssays.forEach(assay => {
  if(assayIds.includes(assay.assay_identifier)){
    assayData.push({"Assay Name": assay.assay_name, "Locations" : assay.locations, "Institues" : assay.institutes, "treatments" : assay.associated_intervals, "tissuesMeasured" : assay.plant_anatomical_entities })
  }
})
setAssayDataForMap(assayData)
    });
   


  };






  const TableNames = () => {
    var tableNames = [];
    gwasAssays
      .filter((assay, index) => selectedGwasAssays[index])
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


  // useEffect(() => {
  //   const selectedAssays = gwasAssays.filter((assay, index) => selectedGwasAssays[index]);
  //   handleTraits(tableNames, selectedAssays.map(assay => assay.assay_identifier))

  // }, [tableNames])

  useEffect(() => {
    TableNames()
  }, [selectedGwasAssays])

  const handleToggle = (index) => () => {
    const newChecked = [...selectedGwasAssays];
    newChecked[index] = !newChecked[index];
    // saveSelectedAssays(newChecked);
    setSelectedGwasAssays(newChecked);
    // setVariablesToPlot([])
  };

  // Handler for toggling "All" checkbox
  const handleToggleAll = (event) => {
    const newChecked = new Array(gwasAssays.length).fill(event.target.checked);
    // saveSelectedAssays(newChecked);
    setSelectedGwasAssays(newChecked);
    // setVariablesToPlot([])
  };

  // useEffect(() => {
  //   const new_col_names = Object.entries(col_names)
  //     .flatMap(([category, titles]) => {
  //       return titles.map((title) => ({ category, title }));
  //     })
  //     .sort((a, b) => {
  //       // Custom sorting function to prioritize 'Germplasm' category
  //       if (a.category === "Germplasm") return -1;
  //       if (b.category === "Germplasm") return 1;
  //       return 0;
  //     });
  //   // new_col_names
  //   setColNames2(new_col_names);
  // }, [col_names]);

  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };


    const handleSelectedGwasStudy = (study) => {
      // console.log(study)
      setSelectedGwasStudy(study)
      var resetChecked = selectedGwasAssays.map(() => false);
      resetChecked[0] = true;
      setSelectedGwasAssays(resetChecked);
      setShowOntology(false)
    }
    

const handlePhenotype = (selectedValue) => {
  // console.log('selectedValue', selectedValue)
  setSelectedGwasTrait(selectedValue);
  // fetch_trait_data(selectedValue)
}


const handleSelection = (selectedItems) => {
  var studyId = selectedItems.study_identifier;
  handleSelectedGwasStudy(selectedItems);
  setGwasStudyMetaData(selectedItems);     
  // console.log('selectedItems', selectedItems)

};

  return (
    <>

    
      <Grid >
      <Grid sx={{ ml: 2, marginTop: 4, marginRight: 2, marginBottom : 2}}>
        
      <Typography variant="h8" color={'green'} fontWeight={'bold'}>Description: </Typography>

          <Typography variant="p">
            {'This tool allows to perform GWAS analyses on the GWAS datasets available as part of the selected study. The SNP markers are prefiltered for minor allele frequency (>= 0.05), Missingness per SNP ( < 0.1), quality score at SNP site ( >= 20) and a min depth ( >= 3). For more details please see '} <b><a target="blind" href="https://ataulhaleem.github.io/camelina-hub-documentation/modules/GWAS/Analysis">documentation</a></b>
          </Typography>
        </Grid>






      </Grid>

      {!selectedGwasStudy || (

        <div>

{/* <Grid sx={{ ml: 2 }}>

          <Autocomplete
          defaultValue={selectedGwasStudy.study_title}

          size="small"
            options={gwasStudies.map((study) => study.study_title)}
            renderInput={(params) => (
              <TextField {...params} label="Study Title" 
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: selectedGwasStudy ? 'green' : 'red',
                  },
                },
              }}
              />
            )}
            onChange={(e, value) => {
              const study = gwasStudies.find(
                (study) => study.study_title === value
              );             
              var studyId = study.study_identifier;
              handleSelectedGwasStudy(study);
              setGwasStudyMetaData(study);     
            }}
          />
        </Grid>*/}

<SearchGrid  studies={gwasStudies} onSelection={handleSelection}></SearchGrid>


        <Grid container sx={{ padding: 1 }}>
          <Grid item xs={6}>

            <div>
              <Grid sx={{ ml: 1, marginRight: 2 }}>



                <Accordion sx={{ mb: 2}} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h7" fontWeight="bold">
                      Experiments
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <Box display="flex" flexDirection="column" sx={{ mt: -2, ml : 1 }}>
                      <FormControlLabel
                        sx={{mt : -1}}
                          control={
                            <Checkbox
                              checked={selectedGwasAssays.every(Boolean)}
                              onClick={handleToggleAll}
                              disableRipple
                            />
                          }
                          label="All"
                          onChange={handleToggleAll} // Add onChange event for the "All" checkbox
                        /> 

                        {gwasAssays.map((assay, index) => (
                          <FormControlLabel
                          sx={{mt : -1}}
                            key={index}
                            control={
                              <Checkbox
                                checked={selectedGwasAssays[index]}
                                onClick={handleToggle(index)}
                                disableRipple
                              />
                            }
                            label={capitalizeFirstLetter(assay.assay_name)}
                            // label={assay.assay_name}
                          />
                        ))}

                      </Box>
                    </div>
                  </AccordionDetails>
                </Accordion>

                {!selectedGwasAssays.some((x) => x == true) || (

                  <div>


  
{!selectedGwasTrait || 

<div>
<Autocomplete
  id="grouped-demo"
  defaultValue={selectedGwasTrait}  // Use 'value' instead of 'defaultValue' to ensure controlled behavior
  value={selectedGwasTrait}
  options={gwasTraits}
  groupBy={(option) => option.category}
  getOptionLabel={(option) => option.title}  // Display the 'title' in the dropdown
  sx={{ width: 300 }}
  size="small"
  renderInput={(params) => (
    <TextField {...params} label="select variable" />
  )}
  renderGroup={(params) => (
    <li key={params.key} style={{ marginBottom: "1.5rem" }}>
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
      <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
        {params.children}
      </ul>
    </li>
  )}


//   onInputChange={(event, selectedValue) => {
//     fetch_trait_data(selectedGwasTrait)
// }}

  onChange={(event, selectedValue) => {
    // console.log(selectedValue)
    // if (selectedValue) {
      handlePhenotype(selectedValue);
    // }
  }}


/>

{!famString ? <div>Problem fetching data. please select a different assay. </div> : <GWAS phenotype={selectedGwasTrait} famString={famString}/> } 

</div>

}






                  </div>
                )}

              </Grid>
            </div>






          </Grid>










{/* META DATA */}

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
                    <TabPanel value={value} index={0} dir={theme.direction}>

                    <Typography color='green' variant="h6" fontWeight="bold">
                    Study Overview:
            </Typography>

            <StudyMetaData               

                        studyMetaData={gwasStudyMetaData}
                        assays={gwasAssays.filter((assay, index) => selectedGwasAssays[index])}  //pass only the selected assays
                      />

                    {/* { !showOntology || <BioPortalAnnotator 
                    termsToSearch={[
                      ...variablesToPlot.filter(item => item !== 'line'),
                      ...assays.filter((assay, index) => checked[index]).map(assay => assay.assay_name)
                    ]} 
                    />} 
         */}



                    </TabPanel>

                    <TabPanel value={value} index={1} dir={theme.direction}>
                      {locationDataForMap ? <LocationMap assayData={assayDataForMap} mapData={locationDataForMap} /> :  <h4>Please select an experiment</h4> }

                    </TabPanel>

                    <TabPanel value={value} index={2} dir={theme.direction}>                   

                    <Grid container columnGap={2} rowGap={2} direction="column">

                    <Grid item>
                    <Typography variant="h7" fontWeight={'bold'}>Assay Layouts:</Typography>
                    <AssayLayout assays={assayDataForMap} />

                    </Grid>
                    
                    <Grid item>
                    <Typography variant="h7" fontWeight={'bold'}>Experiment Layouts:</Typography>
                    <Typography variant="body1" >Not available</Typography>

                    </Grid>
                    </Grid>
                  
                    </TabPanel>


                    <TabPanel value={value} index={3} dir={theme.direction}>
                    {/* { showOntology ? <BioPortalAnnotator termsToSearch={variablesToPlot} /> : <Typography>Please Select a trait</Typography>} */}
                    <ProtocolDisplay assayData={assayDataForMap}/>
                    </TabPanel>

                    <TabPanel value={value} index={4} dir={theme.direction}>
                      <Typography>No comments available</Typography>
                    </TabPanel>

                  </SwipeableViews>
                </Box>

  </AccordionDetails>
</Accordion>

              </Box>
            </div>
          </Grid>

          {/* <Grid item>
          {!famString || <GWAS phenotype={variablesToPlot[1]} famString={famString}/> } 

          </Grid> */}

        </Grid>
        </div>

      )}

    </>
  );
}
