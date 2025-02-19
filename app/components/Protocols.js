'use client';
import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography, Box } from '@mui/material';


function ProtocolDisplay({ assayData }) {
  const [protocolContents, setProtocolContents] = useState({});
  const [assayNames, setAssayNames] = useState([])

  useEffect(() => {

    if(assayData.length > 0){
      console.log(assayData)
      var newAssayNames = []
      // Fetch the protocol files for each assay name
      assayData.forEach(assay => {
        const assayName = assay['Assay Name']
        const assayFileName = assay['Assay Name'].replaceAll(' ','_')

        newAssayNames.push(assayName)
        fetch(`/protocols/${assayFileName}-protocol.txt`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text();
          })
          .then(text => {
            setProtocolContents(prev => ({
              ...prev,
              [assayName]: text
            }));
          })
          .catch(error => {
            console.error('Error loading protocol:', error);
            setProtocolContents(prev => ({
              ...prev,
              [assayName]: 'No protocol available.'
            }));
          });
      });

      setAssayNames(newAssayNames)
  
    }

  }, [assayData]);

  return (

<>
{assayData.length < 1 ? <Typography>Please select an assay</Typography>  : <div>
      
      <div>
      {assayNames.map(assayName => (

        <Box sx={{mt:1, ml : -2}} >
        <Accordion  key={assayName}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${assayName}-content`}
            id={`${assayName}-header`}
          >
            <Typography variant="h7">
              <b>{assayName}</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            
            <Typography sx={{ mb: 2 }} color='blue' variant="h8" component="div">
              Protocol:
            </Typography>

            <Typography variant="body1" component="div" style={{ whiteSpace: 'pre-wrap' }}>
              {protocolContents[assayName] || 'Loading...'}
            </Typography>

          </AccordionDetails>
          <AccordionActions>
            {/* Add any action buttons if needed */}
          </AccordionActions>
        </Accordion>

        </Box>

      ))}
    </div>
    
    </div>}

</>



    // <div>
    //   <h1>under construction</h1>
    // </div>


    
  );
}

export default ProtocolDisplay;
