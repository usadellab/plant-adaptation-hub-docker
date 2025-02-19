// import React, { useState, useEffect } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Box, TextField, Typography, Grid, InputAdornment } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';

// const SearchGrid = ({ studies, onSelection }) => {
//   const [selectedStudy, setSelectedStudy] = useState(studies[0] || null);
//   const [filteredStudies, setFilteredStudies] = useState(studies);
//   const [selectionModel, setSelectionModel] = useState(
//     studies.length > 0 ? [0] : [] // Pre-select the first record by default
//   );
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     if (studies.length > 0) {
//       setSelectedStudy(studies[0]);
//       setSelectionModel([0]); // Highlight the first row on initial render
//     }
//   }, [studies]);

//   const columns = [
//     { field: 'study_title', headerName: 'Study Title', minWidth: 400 },
//     { field: 'biological_material_organisms', headerName: 'Species', minWidth: 200 },
//     { field: 'sample_associated_factor', headerName: 'Biological Condition', minWidth: 200 },
//     { field: 'plant_anatomical_entity', headerName: 'Plant Anatomical Entity', minWidth: 200 },
//     { field: 'sample_institute', headerName: 'Institutes Involved', minWidth: 200 },
//     { field: 'investigation_identifier', headerName: 'Project', minWidth: 200 },
//   ];

//   const rows = filteredStudies.map((study, index) => ({
//     id: index,
//     study_title: study.study_title,
//     biological_material_organisms: study.biological_material_organisms || 'N/A',
//     sample_associated_factor: study.sample_associated_factor || 'N/A',
//     plant_anatomical_entity: study.plant_anatomical_entity || 'N/A',
//     sample_institute: study.sample_institute || 'N/A',
//     investigation_identifier: study.investigation_identifier || 'N/A',
//   }));

//   const handleSearch = (e) => {
//     const query = e.target.value.trim().toLowerCase();
//     setSearchQuery(query);

//     if (!query) {
//       setFilteredStudies(studies); // Reset filter when query is empty
//       return;
//     }

//     const isAndOperator = query.includes('+');
//     const isOrOperator = query.includes('|');

//     const terms = query.split(isAndOperator ? '+' : isOrOperator ? '|' : ' ').map((term) => term.trim());

//     const filtered = studies.filter((study) => {
//       const studyFields = Object.values(study).map((value) =>
//         value ? value.toString().toLowerCase() : ''
//       );

//       if (isAndOperator) {
//         return terms.every((term) => studyFields.some((field) => field.includes(term)));
//       } else if (isOrOperator) {
//         return terms.some((term) => studyFields.some((field) => field.includes(term)));
//       } else {
//         // Default to AND behavior for space-separated terms
//         return terms.every((term) => studyFields.some((field) => field.includes(term)));
//       }
//     });

//     setFilteredStudies(filtered);
//   };

//   const handleRowSelection = (params) => {
//     const selectedId = params.id; // Get the selected row's id
//     setSelectionModel([selectedId]);
//     const newSelectedStudy = studies[selectedId];
//     setSelectedStudy(newSelectedStudy);
//     onSelection(newSelectedStudy);
//   };

//   return (
//     <Box
//       sx={{
//         p: 2,
//         mb: 2,
//         mt:2,
//         borderRadius: '12px',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//         backgroundColor: '#e8f6f3', //'#eafaf1', //'#fff',
//         '&:hover': {
//           boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
//         },
//       }}
//     >
//       <Grid
//         container
//         columnGap={2}
//         direction="row"
//         sx={{
//           justifyContent: "flex-start",
//           alignItems: "center",
//           mb: 2,
//         }}
//       >
//         <Grid item>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
//             Search Studies
//           </Typography>
//         </Grid>

//         <Grid item xs={12} sm={8} md={6}>
//           <TextField
//             size="small"
//             variant="outlined"
//             placeholder="Search (e.g., stressful + drought | seed)"
//             fullWidth
//             value={searchQuery}
//             onChange={handleSearch}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon color="action" />
//                 </InputAdornment>
//               ),
//               sx: {
//                 borderRadius: '20px',
//                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#ddd',
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#6200ea',
//                 },
//               },
//             }}
//             sx={{
//               '& .MuiInputBase-root': {
//                 backgroundColor: '#f9f9f9',
//               },
//             }}
//           />
//         </Grid>
//       </Grid>

//       <DataGrid
//         columns={columns}
//         rows={rows}
//         pageSize={5}
//         checkboxSelection={false}
//         selectionModel={selectionModel}
//         onRowClick={handleRowSelection}
//         rowSelectionModel={selectionModel}
//         isRowSelectable={() => true}
//         hideFooterSelectedRowCount={true}
//         disableAutosize={true}
//         sx={{
//           '& .MuiDataGrid-columnHeader': {
//             color: '#641e16',
//             fontWeight: 'bold',
//             fontSize: '16px',
//             borderBottom: '2px solid #ffffff',
//           },
//           '& .MuiDataGrid-cell': {
//             fontSize: '14px',
//             fontWeight: 500,
//             color: '#333',
//             border: 0,
//             '&:hover': {
//               backgroundColor: '#f7dc6f',
//             },
//           },
//           '& .MuiDataGrid-row': {
//             transition: 'background-color 0.2s ease-in-out',
//             '&:hover': {
//               backgroundColor: '#f7dc6f',
//               border: 1,
//             },
//             '&.Mui-selected': {
//               backgroundColor: '#a9dfbf',
//               border: 3,
//               borderColor: 'green',
//               '&:hover': {
//                 backgroundColor: '#82e0aa',
//               },
//             },
//           },
//           '& .MuiDataGrid-footerContainer': {
//             borderTop: '2px solid #ddd',
//             backgroundColor: '#fafafa',
//           },
//         }}
//       />
//     </Box>
//   );
// };

// export default SearchGrid;


import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Typography, Grid, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchGrid = ({ studies, onSelection }) => {
  const [selectedStudy, setSelectedStudy] = useState(studies[0] || null);
  const [filteredStudies, setFilteredStudies] = useState(studies);
  const [selectionModel, setSelectionModel] = useState(
    studies.length > 0 ? [0] : [] // Pre-select the first record by default
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (studies.length > 0) {
      setSelectedStudy(studies[0]);
      setSelectionModel([0]); // Highlight the first row on initial render
    }
  }, [studies]);

  const columns = [
    { field: 'study_title', headerName: 'Study Title', minWidth: 600 },
    { field: 'biological_material_organisms', headerName: 'Species', minWidth: 200 },
    { field: 'sample_associated_factor', headerName: 'Biological Condition', minWidth: 200 },
    { field: 'plant_anatomical_entity', headerName: 'Plant Anatomical Entity', minWidth: 200 },
    { field: 'sample_institute', headerName: 'Institutes Involved', minWidth: 200 },
    { field: 'investigation_identifier', headerName: 'Project', minWidth: 200 },
    { field: 'study_identifier', headerName: 'Study ID', minWidth: 200 },

  ];

  const rows = filteredStudies.map((study, index) => ({
    id: index,
    study_title: study.study_title,
    biological_material_organisms: study.biological_material_organisms || 'N/A',
    sample_associated_factor: study.sample_associated_factor || 'N/A',
    plant_anatomical_entity: study.plant_anatomical_entity || 'N/A',
    sample_institute: study.sample_institute || 'N/A',
    investigation_identifier: study.investigation_identifier || 'N/A',
    study_identifier: study.study_identifier || 'N/A',

  }));

  // const handleSearch = (e) => {
  //   const query = e.target.value; // Capture the raw query without trimming
  //   setSearchQuery(query); // Update the state with the exact query
  
  //   const trimmedQuery = query.trim().toLowerCase();
  
  //   if (!trimmedQuery) {
  //     setFilteredStudies(studies); // Reset filter when query is empty
  //     return;
  //   }
  
  //   const isAndOperator = trimmedQuery.includes('+') || trimmedQuery.includes(' and ');
  //   const isOrOperator = trimmedQuery.includes('|') || trimmedQuery.includes(' or ');
  
  //   const terms = trimmedQuery
  //     .split(isAndOperator ? /(?:\+| and )/ : isOrOperator ? /(?:\|| or )/ : ' ')
  //     .map((term) => term.trim())
  //     .filter((term) => term); // Remove empty terms caused by multiple spaces
  
  //   const filtered = studies.filter((study) => {
  //     const studyFields = Object.values(study).map((value) =>
  //       value ? value.toString().toLowerCase() : ''
  //     );
  
  //     if (isAndOperator) {
  //       return terms.every((term) => studyFields.some((field) => field.includes(term)));
  //     } else if (isOrOperator) {
  //       return terms.some((term) => studyFields.some((field) => field.includes(term)));
  //     } else {
  //       // Default to AND behavior for space-separated terms
  //       return terms.every((term) => studyFields.some((field) => field.includes(term)));
  //     }
  //   });
  
  //   setFilteredStudies(filtered);
  // };
  

  const handleSearch = (e) => {
    const query = e.target.value; // Capture the raw query without trimming
    setSearchQuery(query); // Update the state with the exact query
  
    const trimmedQuery = query.trim().toLowerCase();
  
    if (!trimmedQuery) {
      setFilteredStudies(studies); // Reset filter when query is empty
      return;
    }
  
    // Split by OR first (lowest precedence), then handle AND within each OR group
    const orGroups = trimmedQuery.split(/(?:\sor\s|\|)/).map((group) => group.trim());
    
    const filtered = studies.filter((study) => {
      const studyFields = Object.values(study).map((value) =>
        value ? value.toString().toLowerCase() : ''
      );
  
      // Check if any OR group matches
      return orGroups.some((group) => {
        const andTerms = group.split(/(?:\sand\s|\+)/).map((term) => term.trim());
        
        // Check if all AND terms within this group match
        return andTerms.every((term) => studyFields.some((field) => field.includes(term)));
      });
    });
  
    setFilteredStudies(filtered);
  };
  

  const handleRowSelection = (params) => {
    const selectedId = params.id; // Get the selected row's id
    setSelectionModel([selectedId]);
    const newSelectedStudy = studies[selectedId];
    setSelectedStudy(newSelectedStudy);
    onSelection(newSelectedStudy);
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        mt: 2,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#e8f6f3', //'#eafaf1', //'#fff',
        '&:hover': {
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Grid
        container
        columnGap={2}
        direction="row"
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Search Studies
          </Typography>
        </Grid>

        <Grid item xs={12} sm={8} md={6}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search (e.g., stressful + drought | seed and leaves or leaf or leaflet)"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ddd',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6200ea',
                },
              },
            }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#f9f9f9',
              },
            }}
          />
        </Grid>
      </Grid>

      <DataGrid
  columns={columns}
  rows={rows}
  rowHeight={35}
  columnHeaderHeight={40}
  checkboxSelection={false}
  selectionModel={selectionModel}
  initialState={{
    pagination: { paginationModel: { pageSize: 5 } },
  }}
  pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
  onRowClick={handleRowSelection}
  rowSelectionModel={selectionModel}
  isRowSelectable={() => true}
  hideFooterSelectedRowCount={true}
  disableAutosize={true}
  sx={{
    /* Header Styling */
    '& .MuiDataGrid-columnHeader': {
      color: '#641e16', // Text color for header
      fontWeight: 'bold', // Bold text
      fontSize: '16px', // Larger font size
      borderBottom: '2px solid #ffffff', // White border for separation
      backgroundImage: 'linear-gradient(to right, #aeb6bf, #f9ebea)', // Gradient background
      textTransform: 'uppercase', // Uppercase headers
      transition: 'background-color 0.3s ease', // Smooth transition on hover
      '&:hover': {
        backgroundColor: '#f5b7b1', // Slightly darker on hover
      },
    },

    /* Cell Styling */
    '& .MuiDataGrid-cell': {
      fontSize: '14px', // Font size for cell text
      fontWeight: 500, // Medium weight for better readability
      color: '#333', // Text color
      border: 0, // No borders between cells
      '&:hover': {
        backgroundColor: '#f7dc6f', // Highlight on hover
      }
    },

    /* Row Styling */
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
        backgroundColor: '#f7dc6f', // Highlight pagination buttons on hover
      },
    },
  }}
/>

    </Box>
  );
};

export default SearchGrid;
