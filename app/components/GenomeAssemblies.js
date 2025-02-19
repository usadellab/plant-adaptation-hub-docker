'use client'
import * as React from 'react'
import Box from '@mui/material/Box'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  TextField,
  Slider
} from '@mui/material'
import { Button } from '@mui/material'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import PlotlyPlots from './PlotlyPlots2'
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

import { useTokenContext } from '../../contexts/TokenContext'
import { useApiContext } from '@/contexts/ApiEndPoint'
import { useAppDataContext } from '@/contexts/AppDataContext'

import SwipeableViews from 'react-swipeable-views'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import LocationMap from './LocationMap'
import ProtocolDisplay from './Protocols'
import StudyMetaData from './StudyMetaData'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import HeatmapPlot from './HeatMap'
import BioPortalAnnotator from './BioPortalAnnotator'
import { capitalizeFirstLetter } from './utils'
import AssayLayout from './AssayLayout'
import Cookies from 'js-cookie'
import DownloadTerms from './DownloadTerms'

// import htmlToImage from 'html-to-image';
import * as htmlToImage from 'html-to-image'
import { jsPDF } from 'jspdf'
import VariableSelectionDialog from './VariableSelectionDialog'
import SearchGrid from './Search'
import GenomeMetadataVisualizer from './GenomeMetadataVisualizer'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
}))

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
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
  )
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export default function GenomeAssemblies () {
  const token = useTokenContext()
  const { apiEndpoint } = useApiContext()
  const { genomeStudies, setGenomeStudies } = useAppDataContext()
  const { selectedGenomeStudy, setSelectedgenomeStudy } = useAppDataContext()
  const { selectedGenomeStudyMetaData, setSelectedgenomeStudyMetaData } =
    useAppDataContext()
  const { genomeAssays, setGenomeAssays } = useAppDataContext()
  const { selectedGenomeAssays, setSelecteGenomeAssays } = useAppDataContext()
  const { genomeAssemblies, setGenomeAssemblies } = useAppDataContext()
  const { selectedGenomeAssemblies, setSelectedGenomeAssemblies } =
    useAppDataContext()
  const { selectedAssembliesStats, setSelectedAssembliesStats } =
    useAppDataContext()

  const { selectedGenomeAssaysPhenotypes, setSelecteGenomeAssaysPhenotypes } =
    useAppDataContext()
  const {
    selectedGenomeAssaysPhenotypesSelectedPhenotype,
    setSelecteGenomeAssaysPhenotypesSelectedPhenotype
  } = useAppDataContext()
  const { variablesToPlot, setVariablesToPlot } = useAppDataContext()
  const { phenotypeData, setPhenotypeData } = useAppDataContext()
  const { selected_plot_type, setSelectedPlotType } = useAppDataContext()
  const { assayIds, setAssayIds } = useAppDataContext()
  const { expFactors, setExpFactors } = useAppDataContext()
  const { selectedFactor, setSelectedFactor } = useAppDataContext()
  const { divider, setDivider } = useAppDataContext()
  const { counter, setCounter } = useAppDataContext()
  const { assayDataForMap, setAssayDataForMap } = useAppDataContext()
  const { locationDataForMap, setLoctaionDataForMap } = useAppDataContext()

  const handleselectedGenomeStudy = studyId => {
    setSelectedgenomeStudy(studyId)
  }

  const [showOntology, setShowOntology] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const darkModeValue = Cookies.get('isDarkMode')
      setIsDarkMode(darkModeValue === 'true')
    }, 1) // Check every second

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [])

  // VisPehno
  const [plotSize, setPlotSize] = useState(60)

  const [open, setOpen] = useState(false)
  const [isToggled, setPlotIsToggled] = useState(false)
  const [plotSchema, setPlotSchema] = useState({})
  const [plotTitle, setPlotTitle] = useState('')
  const [xLable, setXlable] = useState('')
  const [yLable, setYlable] = useState('')
  const [isMultiTrace, setIsMultiTrace] = useState(false)
  const [state, setState] = useState({})

  const handleFactorCheckboxChange = factor => {
    var newFactor = factor ? factor : null
    setDivider(newFactor)
    setSelectedFactor(newFactor)
  }

  const handleVarsToPlot = selectedValue => {
    setCounter(counter + 1)
    setSelecteGenomeAssaysPhenotypesSelectedPhenotype(selectedValue)

    // setPhenotypeData([])

    // setShowOntology(false);
    setVariablesToPlot([selectedValue])
    // setPhenotypeData([])
  }

  function getTrueKeys (obj) {
    let result = []
    for (let key in obj) {
      if (obj[key] === true) {
        result.push(key)
      }
    }
    return result
  }

  const handleStateChange = event => {
    var newState = {
      ...state,
      [event.target.name]: event.target.checked
    }
    setState(newState)
  }

  useEffect(() => {
    if (
      selected_plot_type == 'box' ||
      // selected_plot_type == "line" ||
      selected_plot_type == 'violin' ||
      selected_plot_type == 'raincloud' ||
      selected_plot_type == 'heatmap' ||
      selected_plot_type == 'density_overlay'
    ) {
      setIsMultiTrace(true)
      setOpen(true)
      // var newState = {};
      // setState(newState);
    } else {
      setIsMultiTrace(false)
    }
  }, [selected_plot_type])

  useEffect(() => {
    if (phenotypeData.length > 0) {
      handlePLOT()
      setShowOntology(true) // this place is crucial, to update the ontologies only after the data has been updated, it is set to false each time a variable is changed see above
    }
  }, [
    selected_plot_type,
    plotTitle,
    xLable,
    yLable,
    phenotypeData,
    isDarkMode,
    plotSize,
    selectedGenomeAssaysPhenotypesSelectedPhenotype
  ])

  useEffect(() => {
    if (divider) {
      if (phenotypeData.length > 0) {
        if (
          selected_plot_type == 'bar' ||
          selected_plot_type == 'line' ||
          selected_plot_type == 'histogram'
        ) {
          handlePLOT()
        }
      }
    }
  }, [divider])

  var handlePLOT = () => {
    setPlotIsToggled(true)
    var schema1 = {
      inputData: phenotypeData,
      plot_type: '',
      variablesToPlot: variablesToPlot.map(variable => variable.title),
      plotTitle: plotTitle,
      xLable: xLable,
      yLable: yLable,
      isDark: isDarkMode,
      divider: divider,
      plotSize: plotSize
    }
    if (selected_plot_type === 'box') {
      schema1.plot_type = 'box'
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title)
    } else if (selected_plot_type === 'violin') {
      schema1.plot_type = 'violin'
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title)
    } else if (selected_plot_type === 'raincloud') {
      schema1.plot_type = 'raincloud'
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title)
      // } else if (selected_plot_type === "heatmap") {
      //   schema1.plot_type = "heatmap";
      //   schema1.variablesToPlot = variablesToPlot;
      //   setPlotSchema(schema1);
    } else if (selected_plot_type === 'density_overlay') {
      schema1.plot_type = 'density_overlay'
      schema1.variablesToPlot = variablesToPlot.map(variable => variable.title)
    } else if (
      selected_plot_type === 'scatter' ||
      selected_plot_type === 'linear regression'
    ) {
      schema1.plot_type = selected_plot_type
      schema1.variablesToPlot = variablesToPlot
        .map(variable => variable.title)
        .slice(0, 2)
    } else {
      schema1.plot_type = selected_plot_type
      schema1.variablesToPlot = variablesToPlot
        .map(variable => variable.title)
        .slice(0, 2) // in this slice the first variable is selectedXvar and the second is selectedYvar], this applies to single plot variables
    }
    schema1.plotSize = plotSize
    setPlotSchema(schema1)
  }

  // ASSAY OPTIONS

  async function getLocations (assayIds, token, apiEndpoint) {
    var newLocations = []
    for (const assayId of assayIds) {
      const response = await axios.post(
        `${apiEndpoint}/samples?assayId=${assayId}&token=${token}`
      )
      const response_data = response.data.result.data
      response_data.map(obj => {
        newLocations.push(obj.sample_institute)
      }) // sample_institute is the institute_identifier used in the institutes table
    }
    return [...new Set(newLocations)]
  }

  const handleLocationData = async assayIds => {
    try {
      // Fetch locations
      const locations = await getLocations(
        assayIds,
        token.apiToken,
        apiEndpoint
      )

      let mapData = []
      let assayData = []

      // Use Promise.all to handle asynchronous requests in parallel
      const locationPromises = locations.map(async instituteId => {
        if (instituteId) {
          try {
            const response = await axios.post(
              `${apiEndpoint}/institute?instituteId=${instituteId}&token=${token.apiToken}`
            )
            if (response.status === 200) {
              let institute_data = response.data.result.data // Assuming structure
              mapData.push(institute_data[0])
            } else {
              console.error(
                'Error fetching location data:',
                response.statusText
              )
            }
          } catch (error) {
            console.error('Error fetching location data:', error)
          }
        }
      })

      // Wait for all location requests to resolve
      await Promise.all(locationPromises)

      // Populate assayData after location requests are done
      genomeAssays.forEach(assay => {
        if (assayIds.includes(assay.assay_identifier)) {
          assayData.push({
            'Assay Name': assay.assay_name,
            Locations: assay.locations,
            Institutes: assay.institutes,
            treatments: assay.associated_intervals,
            tissuesMeasured: assay.plant_anatomical_entities
          })
        }
      })

      // Update state only after all data is collected
      setLoctaionDataForMap(mapData)
      setAssayDataForMap(assayData)
    } catch (error) {
      console.error('Error handling location data:', error)
    }
  }

  useEffect(() => {
    if (assayIds.length > 0) {
      handleLocationData(assayIds)
    }
  }, [assayIds])

  const handleToggle = index => () => {
    const newChecked = [...selectedGenomeAssays]
    newChecked[index] = !newChecked[index]
    setSelecteGenomeAssays(newChecked)
    setPlotIsToggled(false)
    setVariablesToPlot([])
    setState({})

    var assayIds = []
    if (genomeAssays.length > 0) {
      genomeAssays
        .filter((assay, index) => newChecked[index])
        .map(assay => {
          assayIds.push(assay.assay_identifier)
        })
    }

    handleLocationData(assayIds)
  }

  const handleToggleAll = event => {
    const allTrue = selectedGenomeAssays.every(item => item === true)
    const newChecked = new Array(selectedGenomeAssays.length).fill(!allTrue)
    setSelecteGenomeAssays(newChecked)
    setVariablesToPlot([])
    setState({})

    var assayIds = []
    if (genomeAssays.length > 0) {
      genomeAssays
        .filter((assay, index) => newChecked[index])
        .map(assay => {
          assayIds.push(assay.assay_identifier)
        })
    }
    handleLocationData(assayIds)
  }

  // selectedGenomeAssemblies, setSelectedGenomeAssemblies,

  const handleToggleSelectedAssemblies = index => () => {
    const newChecked = [...selectedGenomeAssemblies]
    newChecked[index] = !newChecked[index]
    setSelectedGenomeAssemblies(newChecked)

    // var assayIds = [];
    // if (genomeAssays.length > 0) {
    //     genomeAssays
    //         .filter((assay, index) => newChecked[index])
    //         .map((assay) => {
    //             assayIds.push(assay.assay_identifier);
    //         });
    // }

    // handleLocationData(assayIds)
  }

  const handleToggleAllSelectedAssemblies = event => {
    const allTrue = selectedGenomeAssemblies.every(item => item === true)
    const newChecked = new Array(selectedGenomeAssemblies.length).fill(!allTrue)
    setSelectedGenomeAssemblies(newChecked)

    // var assayIds = [];
    // if (genomeAssays.length > 0) {
    //     genomeAssays
    //         .filter((assay, index) => newChecked[index])
    //         .map((assay) => {
    //             assayIds.push(assay.assay_identifier);
    //         });
    // }
    // handleLocationData(assayIds)
  }

  const [itemsByCategory, setItemsByCategory] = useState({})
  const [categoryOrder, setCategoryOrder] = useState([])

  // useEffect(() => {
  //     const items_ByCategory = selectedGenomeAssaysPhenotypes.reduce((acc, cur) => {
  //         const { category, title } = cur;
  //         if (!acc[category]) {
  //             acc[category] = [];
  //         }
  //         acc[category].push(title);
  //         return acc;
  //     }, {});

  //     setItemsByCategory(items_ByCategory);
  //     var newCategoriesOrder = Object.keys(items_ByCategory) // customize order ["Germplasm", ...Object.keys(items_ByCategory)];
  //     setCategoryOrder(newCategoriesOrder);

  // }, [selectedGenomeAssaysPhenotypes]);

  const theme = useTheme()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = index => {
    setValue(index)
  }

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
    ,
    // 'harmonicMean'
    // ,'hellinger'
    'innerProduct',
    'intersection',
    'jaccard',
    'jeffreys',
    // ,'jensenDifference'
    // ,'jensenShannon'
    // ,'kdivergence'
    // ,'kulczynski'
    // ,'kullbackLeibler'
    // ,'kumarHassebrook'
    // ,'kumarJohnson'
    // ,'lorentzian'
    'manhattan',
    // ,'matusita'
    // ,'minkowski'
    // ,'motyka'
    // ,'neyman'
    'pearson',
    // ,'probabilisticSymmetric'
    // ,'ruzicka'
    // ,'soergel'
    // ,'sorensen'
    // ,'squared'
    // ,'squaredChord'
    'squaredEuclidean'
    // ,'taneja'
    // ,'tanimoto'
    // ,'topsoe'
    // ,'waveHedges'
  ]

  const [showTerms, setShowTerms] = useState(false)
  const [imageFormat, setImageFormat] = useState(null)

  const handleTermsAccepted = value => {
    if (value) {
      // if the user accepts the terms download the plot else not, value = boolean
      handleImageDownload(imageFormat)
    }
  }

  const handleImageDownload = format => {
    // Ensure a format is selected
    const plotElement = document.getElementById('plot-container') // The container holding the plotly plot

    if (!plotElement) {
      console.error('Plot container not found!')
      return
    }

    if (format === 'jpg' || format === 'svg') {
      // Convert the plot to an image
      htmlToImage
        .toBlob(plotElement, { type: `image/${format}` })
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `plot.${format}`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(error => {
          console.error('Failed to download image:', error)
        })
    } else if (format === 'pdf') {
      // Convert the plot to a PDF
      htmlToImage
        .toCanvas(plotElement)
        .then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg')
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
          })
          pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height)
          pdf.save('plot.pdf')
        })
        .catch(error => {
          console.error('Failed to download PDF:', error)
        })
    } else {
      console.error('Unsupported format selected')
    }
  }

  const handleSelection = selectedItems => {
    setVariablesToPlot(selectedItems)
  }

  const handleClose = () => {
    setOpen(false)

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
}

const handleSelection2 = selectedItems => {
    handleselectedGenomeStudy(selectedItems)
    setSelectedgenomeStudyMetaData(selectedItems)
}

return (
    <>
    <Grid sx={{ ml: 2, marginTop: 4, marginRight: 2, marginBottom: 2 }}>
    <Typography variant='h8' color={'green'} fontWeight={'bold'}>
        Description:{' '}
    </Typography>

    <Typography variant='p'>
        {`This tool allows to visualize phenotypes collected as part of untwist project. Phenotypes are available using the drop downs in the Plotting Options menu. Users can also perform queries to filter the data based on any combination of phenotypes collected.`}{' '}
        For more details please see{' '}
        <b>
        <a
            target='blind'
            href='https://ataulhaleem.github.io/camelina-hub-documentation/modules/Phenology/vispheno'
        >
            documentation
        </a>
        </b>
    </Typography>
    </Grid>

    {!selectedGenomeStudy || (
    <div>
        <SearchGrid
        studies={genomeStudies}
        onSelection={handleSelection2}
        ></SearchGrid>

<Grid
      container
      spacing={2}
      sx={{
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* Left Column */}
      <Grid item xs={12} sm={6}>
        <Grid
          container
          direction="column"
          spacing={2}
          sx={{
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          {/* Genome Assemblies */}
          <Grid item>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h7" fontWeight="bold">
                  Genomes
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{ mt: -2, ml: 1 }}
                >
                  {genomeAssemblies.map((assembly, index) => (
                    <FormControlLabel
                      sx={{ mt: -1 }}
                      key={index}
                      control={
                        <Checkbox
                          checked={selectedGenomeAssemblies[index]}
                          onClick={handleToggleSelectedAssemblies(index)}
                          disableRipple
                        />
                      }
                      label={assembly.assemblyinfo_assemblyname_}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Genome Metadata Visualizer */}
          <Grid item>
            {selectedAssembliesStats.length > 0 && (
              <GenomeMetadataVisualizer data={selectedAssembliesStats} />
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} sm={6} padding={1}>
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
                  <Tab label="Description" />
                  <Tab label="Locations" />
                  <Tab label="Layouts" />
                  <Tab label="Protocols" />
                  <Tab label="Notes" />
                </Tabs>
              </AppBar>

              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={value}
                onChangeIndex={handleChangeIndex}
              >
                {/* Tab 1: Description */}
                <div>
                  <Typography
                    color="green"
                    variant="h6"
                    fontWeight="bold"
                    mt={2}
                    ml={2}
                  >
                    Study Overview:
                  </Typography>
                  <StudyMetaData
                    studyMetaData={selectedGenomeStudyMetaData}
                    assays={genomeAssays.filter(
                      (assay, index) => selectedGenomeAssays[index]
                    )}
                  />
                </div>

                {/* Tab 2: Locations */}
                <div>
                  {locationDataForMap ? (
                    <LocationMap
                      assayData={assayDataForMap}
                      mapData={locationDataForMap}
                    />
                  ) : (
                    <Typography>
                      Please select an experiment
                    </Typography>
                  )}
                </div>

                {/* Tab 3: Layouts */}
                <div>
                  <Typography>Coming soon...</Typography>
                  <ProtocolDisplay assayData={assayDataForMap} />
                </div>

                {/* Tab 4: Notes */}
                <div>
                  <Typography>No comments available</Typography>
                </div>
              </SwipeableViews>
            </Box>
          </AccordionDetails>
        </Accordion>
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
                direction='row'
                sx={{
                justifyContent: 'flex-end',
                alignItems: 'center'
                }}
            >
                <Grid item>
                <Button
                    variant={'outlined'}
                    onClick={(e, v) => {
                    setShowTerms(!showTerms)
                    handleTermsAccepted(true)
                    }}
                >
                    Accept
                </Button>
                </Grid>
                <Grid item>
                <Button
                    variant={'outlined'}
                    onClick={(e, v) => {
                    setShowTerms(!showTerms)
                    handleTermsAccepted(false)
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
)
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centeredContent: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    zIndex: 10000
  },
  messageBox: {
    // height: 240, // Fixed height for the message box
    overflow: 'hidden', // Hide overflow content
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    textAlign: 'center',
    margin: '0 auto'
  }
}
