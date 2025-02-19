import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Paper, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'

const JsonDataViewer = ({ data }) => {
  const [renderButton, setRenderButton] = useState(false)

  const allowedTypes = ['agronomic', 'metabolite', 'Isotope', 'Fluorescence']

  const router = useRouter()

  // Utility function to format keys (capitalize first letter and replace _ with spaces)
  const formatKey = (key) => {
    return key
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize the first letter
  }

  // Filter out entries with "N/A", empty strings, or 'id' key
  const filteredEntries = Object.entries(data).filter(
    ([key, value]) =>
      value !== 'N/A' &&
      value !== '' &&
      key !== 'id' &&
      key !== 'ontology_url' &&
      key !== 'ontology_type',
  )

  // Effect to determine if the button should be shown
  useEffect(() => {
    setRenderButton(allowedTypes.includes(data?.type))
  }, [data])

  // Render primitive values
  if (typeof data !== 'object' || data === null) {
    return (
      <Typography
        sx={{
          fontSize: '14px',
          color: '#34495e',
          padding: 2,
          whiteSpace: 'nowrap',
        }}
      >
        {String(data)}
      </Typography>
    )
  }

  const handleClick = () => {
    router.push('/router?component=vispheno')
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Paper
        sx={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          boxShadow: 3,
          border: '1px solid #e0e0e0', // Added border for enhanced card look
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ position: 'relative' }}>
            
          {renderButton && (
  <Box 
    sx={{ 
      position: 'absolute', 
      top: 16, 
      right: 16, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2 // Adds spacing between buttons
    }}
  >
    <Button
      variant="outlined"
      color="primary"
      sx={{
        fontSize: '14px',
        padding: '8px 16px',
        borderRadius: '8px',
      }}
      onClick={handleClick}
    >
      Plot
    </Button>

    {/* Add the new Ontology Search button */}
    {data.ontology_url && (
      <Button
        variant="outlined"
        color="secondary"
        sx={{
          fontSize: '14px',
          padding: '8px 16px',
          borderRadius: '8px',
        }}
        onClick={() => window.open(data.ontology_url, '_blank', 'noopener,noreferrer')}
      >
        Ontology Search
      </Button>
    )}
  </Box>
)}


          </Grid>
  
          <Grid item xs={12}>
            <Box sx={{ paddingLeft: '16px' }}>
              {filteredEntries.map(([key, value], index) => (
                <Box key={index} sx={{ marginTop: '12px' }}>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#34495e',
                      marginBottom: '4px',
                    }}
                  >
                    {formatKey(key)}:
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#7f8c8d' }}>
                    {String(value)}
                  </Typography>
                </Box>
              ))}
  
              {/* Check for ontology_type and display information */}
              {data.ontology_type && (
                <Box sx={{ marginTop: '12px' }}>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#34495e',
                      marginBottom: '4px',
                    }}
                  >
                    Ontology Type:
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#7f8c8d' }}>
                    {data.ontology_type}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
  
}

export default JsonDataViewer
