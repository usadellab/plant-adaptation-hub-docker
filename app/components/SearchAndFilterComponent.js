import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { DataGrid } from '@mui/x-data-grid'
import { none } from 'ol/centerconstraint'
import { useAppDataContext } from '@/contexts/AppDataContext'


const SearchAndFilterComponent = ({ data, onSelection, tableName }) => {

    const {
      selectedPhenotypeStudy,
      setSelectedPhenotypeStudy,
      phenotypeStudyMetaData,
      setPhenotypeStudyMetaData,
      phenotypeSelectedStudyAssays,
      setPhenotypeSelectedStudyAssays,
      phenotypeSelectedStudySelectedAssays,
      setPhenotypeSelectedStudySelectedAssays,
      phenotypeSelectedStudySelectedAssaysPhenotypes,
      setPhenotypeSelectedStudySelectedAssaysPhenotypes,
      phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype,
      setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype,
      variablesToPlot,
      setVariablesToPlot,
    } = useAppDataContext()


  const [filters, setFilters] = useState({})
  const [filteredData, setFilteredData] = useState(data)
  const [searchQuery, setSearchQuery] = useState('')
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])

  // Determine columns to use as filter criteria
  const filterOptions = React.useMemo(() => {
    if (data) {
      var removableFilters = []

      if (tableName === 'investigation' || tableName === 'study') {
        removableFilters.push('investigation_identifier')
      } else if (tableName === 'assay') {
        removableFilters.push('study_identifier')
      } else if (tableName === 'sample') {
        removableFilters.push(
          'study_identifier',
          'assay_identifier',
          'sample_institute',
          'development_stage',
          'anatomical_entity',
          'country',
          'Treatment',
          'intervals'
        )
      } else if (tableName === 'institute') {
        removableFilters.push('institute_city', 'institute_country')
      } else if (tableName === 'genome') {
        removableFilters.push(
          'NCBI Bioproject ID',
          'Cultivar',
          'Organism name',
          'Submitter'
        )
      } else if (tableName === 'passport') {
        removableFilters.push(
          'Genus',
          'Species',
          'Full Taxa',
          'Origin',
          'Institute code'
        )
      } else if (tableName === 'people') {
        removableFilters.push('Affiliation')
      } else if (tableName === 'taxonomy_profile') {
        removableFilters.push('Scientific Name')
      } else if (tableName === 'variable') {
        removableFilters.push(
          'assay_identifier',
          'study_identifier',
          'type',
          'subtype'
        )
      }

      const options = {}
      const uniqueCounts = {}
      data.forEach(item => {
        Object.keys(item).forEach(key => {
          if (removableFilters.includes(key)) {
            uniqueCounts[key] = uniqueCounts[key] || new Set()
            uniqueCounts[key].add(item[key])
          }
        })
      })
      Object.entries(uniqueCounts).forEach(([key, values]) => {
        if (values.size > 1) {
          options[key] = [...values]
        }
      })
      return options
    }
  }, [data, tableName])

  const handleFilterChange = (filterCategory, term) => {
    setFilters(prev => ({
      ...prev,
      [filterCategory]: prev[filterCategory]?.includes(term)
        ? prev[filterCategory].filter(t => t !== term)
        : [...(prev[filterCategory] || []), term]
    }))
  }

  const resetFilters = () => {
    setFilters({})
    setFilteredData(data)
  }

  useEffect(() => {
    // Filter data based on selected filters
    let filtered = data
    Object.keys(filters).forEach(filterCategory => {
      if (filters[filterCategory]?.length) {
        filtered = filtered.filter(item =>
          filters[filterCategory].includes(item[filterCategory])
        )
      }
    })
    setFilteredData(filtered)
  }, [filters, data])


  const excludeFields = ['synonyms', 'measurement_units', 'ontology_url', 'cross_ref', 'data_table_name'];


  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      // Split the query into OR groups based on "or" or "|"
      const orGroups = query.split(/(?:\s+or\s+|\|)/).map((group) => group.trim());

      // Filter the data based on OR and AND logic
      const filtered = filteredData.filter((item) => {
        const itemFields = Object.values(item).map((value) =>
          value ? value.toString().toLowerCase() : ''
        );

        // Check if any OR group matches
        return orGroups.some((group) => {
          // Split by AND operator (either "and" or "+")
          const andTerms = group.split(/(?:\s+and\s+|\+)/).map((term) => term.trim());

          // Check if all AND terms within this group match
          return andTerms.every((term) => itemFields.some((field) => field.includes(term)));
        });
      });

      // Set the filtered data
      setRows(filtered);
    } else {
      setRows(filteredData); // Reset to original filtered data if the query is empty
    }
  }, [searchQuery, filteredData]);





  useEffect(() => {
    // Generate columns dynamically with specific column order
    if (data.length > 0) {
      const priorityFields = [
        'Assembly name',
        'Cultivar',
        'Organism name',
        'BUSCO completeness',
        'Submitter',
        'Release date',
        'NCBI Taxid',
        'NCBI Accession ID',
        'NCBI Bioproject ID',
        'NCBI Biosample ID',
        'Name', 'Full Taxa',  'Genus', 'Species', 'Origin', 'Institute code', 'Accession Number',
        'Scientific Name', 'Taxonomy ID', 'Common Name', 'Encyclopedia of life', 'Global biodiversity information facility', 'Wikipedia',
        'institute_name', 
        'institute_identifier',
        'institute_city',
        'institute_country', 
        'institute_lat', 
        'institute_lng',
        'institute_logourl', 
        'institute_weburl',
        'Treatment',
        'anatomical_entity',
        'intervals', 
        'development_stage',
        'institute', 'country',
        'variable_name', 'type', 'subtype', 'ontology_type', 'definition', 'assay_name', 'assay_technology_platform', 'assay_measurement_type', 'assay_technology_type', 'study_title', 'study_description', 
        'investigation_title', 
        'investigation_description',
        'investigation_identifier',
        'study_identifier',
        'assay_identifier']; // Define the priority fields

      const allFields = Object.keys(data[0]);

      const filteredFields = allFields.filter(field => !excludeFields.includes(field));

      // Sort fields by priority, ensuring priority fields appear first
      const orderedFields = [
        ...priorityFields.filter(field => filteredFields.includes(field)), // Add priority fields that exist in data
        ...filteredFields.filter(field => !priorityFields.includes(field)), // Add the rest of the fields
      ];

      // Map ordered fields to column definitions
      setColumns(
        orderedFields.map(key => ({
          field: key,
          headerName: key.replace(/_/g, ' ').toUpperCase(), // Format header name
          flex: 1, // Adjust column width flexibly
        }))
      );
    }
  }, [data]);


  const [selectionModel, setSelectionModel] = useState(
    data.length > 0 ? [0] : [] // Pre-select the first record by default
  )

  const[selectedRowData, setSelectedRowData] = useState(null)

  const handleRowSelection = params => {
    let rowData = params['row']
    setSelectedRowData(rowData)
    if (rowData.study_identifier != selectedPhenotypeStudy){
      setSelectedPhenotypeStudy(rowData.study_identifier)      
    }
    const selectedId = params.id // Get the selected row's id
    setSelectionModel([selectedId])
    onSelection(params)
  }

  // useEffect(() => {
  //   if(selectedRowData){
  //     let newChecked = new Array(
  //       phenotypeSelectedStudySelectedAssays.length,
  //     ).fill(false)
  //     const indexFromAssay = parseInt(selectedRowData.assay_identifier.split('A')[1]) - 1
  //     if (
  //       isNaN(indexFromAssay) ||
  //       indexFromAssay < 0 ||
  //       indexFromAssay >= phenotypeSelectedStudySelectedAssays.length
  //     ) {
  //       console.error(
  //         'Invalid assay identifier or index out of bounds:',
  //         selectedRowData.assay_identifier,
  //       )
  //       return
  //     }
  //     newChecked[indexFromAssay] = true
  //     setPhenotypeSelectedStudySelectedAssays(newChecked)
      
  
  //   }
  // },[selectedPhenotypeStudy])


  // useEffect(() => {

  //   if(selectedRowData){
  //     let defaultPhenotype = {
  //       category: selectedRowData.data_table_name,
  //       title: selectedRowData.variable_name,
  //       study_identifier: selectedRowData.study_identifier,
  //     }
  
  //     // setPhenotypeSelectedStudySelectedAssays(data.assay_identifier)
  //     setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype(
  //       defaultPhenotype,
  //     )
  //     setVariablesToPlot([defaultPhenotype])
  
  //   }


  // },[phenotypeSelectedStudyAssays])


  return (
    <Box sx={{ display: 'flex', gap: 3, p: 4 }}>
      {/* Left Filter Panel */}
      <Box
        sx={{
          width: '300px',
          borderRight: '2px solid #ddd',
          pr: 3,
          bgcolor: 'transparent', // Background color is overridden by backgroundImage
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: 1,
          backgroundImage: 'linear-gradient(90deg, #fdedec 0%, #f7f7f7 100%)' // Gradient
        }}
      >
        <Typography
          variant='h5'
          gutterBottom
          sx={{
            textAlign: 'center',
            color: '#555',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Filters
        </Typography>
        {Object.keys(filterOptions).map(filterCategory => (
          <Accordion
            key={filterCategory}
            sx={{ mb: 2, border: 1, backgroundColor: 'transparent' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  textTransform: 'capitalize'
                }}
              >
                {filterCategory.replace(/_/g, ' ')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {filterOptions[filterCategory].map(term => (
                  <FormControlLabel
                    key={term}
                    control={
                      <Checkbox
                        checked={
                          filters[filterCategory]?.includes(term) || false
                        }
                        onChange={() =>
                          handleFilterChange(filterCategory, term)
                        }
                        sx={{ color: '#1976d2' }}
                      />
                    }
                    label={term}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
        <Button
          variant='contained'
          color='primary'
          onClick={resetFilters}
          sx={{
            mt: 2,
            width: '100%',
            textTransform: 'none',
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#145da0'
            }
          }}
        >
          Reset Filters
        </Button>
      </Box>

      {/* Right Table with Search */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'white',
          p: 3,
          borderRadius: '8px',
          backgroundImage: 'linear-gradient(90deg, #fdedec 0%, #f7f7f7 100%)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically if needed
            mb: 2, // Add margin-bottom for spacing
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth // Occupy full width
            sx={{
              maxWidth: '800px', // Optional: Limit the maximum width
            }}
            onChange={e => setSearchQuery(e.target.value)} // Update search query state
          />
        </Box>


        <DataGrid
          rows={rows.map((row, index) => ({ id: index, ...row }))}
          columns={columns}
          rowHeight={30}
          columnHeaderHeight={40}
          checkboxSelection={false}
          selectionModel={selectionModel}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
          onRowClick={handleRowSelection}
          rowSelectionModel={selectionModel}
          isRowSelectable={() => true}
          hideFooterSelectedRowCount={true}
          disableAutosize={true}
          sx={{
            height: '400px', // Set a consistent height for the grid
            '& .MuiDataGrid-columnHeader': {
              color: '#641e16', // Text color for header
              fontWeight: 'bold', // Bold text
              fontSize: '16px', // Larger font size
              borderBottom: '2px solid #ffffff', // White border for separation
              backgroundImage: 'linear-gradient(to right, #aeb6bf, #f9ebea)', // Gradient background
              textTransform: 'uppercase', // Uppercase headers
              transition: 'background-color 0.3s ease', // Smooth transition on hover
              '&:hover': {
                backgroundColor: '#f5b7b1' // Slightly darker on hover
              }
            },
            '& .MuiDataGrid-cell': {
              fontSize: '14px',
              fontWeight: 500,
              color: '#333',
              border: 0,
              '&:hover': {
                backgroundColor: '#f7dc6f'
              }
            },

            '& .MuiDataGrid-row': {
              transition: 'background-color 0.2s ease-in-out', // Smooth background change
              '&:hover': {
                backgroundColor: '#f7dc6f', // Highlight on hover
                border: 1,
              },
              '&.Mui-selected': {
                backgroundColor: '#a9dfbf', // Selection background
                border: 2,
                borderColor: '#f1c40f', // Border color for selected rows
                fontWeight: 'bold', // Make all text bold in selected rows
                '& .MuiDataGrid-cell': {
                  fontWeight: 'bold', // Apply bold styling specifically to cell text
                },
                '&:hover': {
                  backgroundColor: '#82e0aa', // Darker green on hover for selected rows
                },
              },
            },

            /* Footer Styling */
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #ddd', // Border to separate footer
              // backgroundImage: 'linear-gradient(to right, #fafafa, #f0f0f0)', // Gradient background
backgroundColor : 'linear-gradient(to right, #fafafa, #f0f0f0)',
              height: 45, // Footer height
              minHeight: 45, // Ensure minimum height
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#555', // Footer text color
            },

            /* Pagination Button Hover */
            '& .MuiDataGrid-pagination .MuiButtonBase-root': {
              transition: 'background-color 0.3s ease', // Smooth transition
              '&:hover': {
                backgroundColor: '#f7dc6f' // Highlight pagination buttons on hover
              }
            }
          }}

        />
      </Box>
    </Box>
  )
}

export default SearchAndFilterComponent
