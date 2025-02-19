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

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

import { useAppDataContext } from "@/contexts/AppDataContext";

import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import StudyMetaData from "./StudyMetaData";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import PeopleComponent from "./PeopleComponent";
import GeoLocator from "./GeoLocator";
import SearchGrid from "./Search";

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

export default function Provenience() {
  const { studies, setStudies } = useAppDataContext();
  const [selectedStudy, setSelectedStudy] = useState(null);
  const { isSmallScreen } = useAppDataContext();


  useEffect(() => {
    if (studies.length > 0) {
      let first_study = studies[0];
      setSelectedStudy(first_study);
    }
  }, [studies]);

  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleSelection = (selectedItems) => {
    setSelectedStudy(selectedItems)

  };


  return (
    <>
      {!selectedStudy || (
        <div >

            <Typography variant="h8" color={"green"} fontWeight={"bold"}>
              Description:
            </Typography>

            <Typography variant="p">
              {` Find germplasm used within a seleted study. For more details please see`} <b><a target="blind" href="https://ataulhaleem.github.io/camelina-hub-documentation/modules/geographic_map">documentation</a></b>
            </Typography>

            <SearchGrid  studies={studies} onSelection={handleSelection}></SearchGrid>

<Grid
            container
            direction="row"
            spacing={2}
            columns={2}
            sx={{ padding: 1 , width: isSmallScreen ? '50%' : '100%'}}

          >

            <Grid item           sx={{ padding: 1, width: isSmallScreen ? '100%' : '50%' }}  // Change width based on screen size
            >
              <GeoLocator studyId={selectedStudy.study_identifier} width="100%" height={800} />

            </Grid>

            <Grid item           sx={{ padding: 1, width: isSmallScreen ? '100%' : '50%' }}  // Change width based on screen size
            >
              {/* META DATA */}
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

                      </Tabs>
                    </AppBar>

                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        <Typography
                          color="green"
                          variant="h6"
                          fontWeight="bold"
                        >
                          Study Overview
                        </Typography>

                        <StudyMetaData
                          studyMetaData={selectedStudy}
                          assays={[]} //pass only the selected assays
                        />
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
