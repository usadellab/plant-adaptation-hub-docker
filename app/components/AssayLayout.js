import React from 'react';
import Plot from 'react-plotly.js';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import AssayPlot from './AssayPlot';


// Main Component to handle multiple assays with Accordion
export default function AssayAccordion({ assays }) {
  return (
    <div>
      {assays.length < 1 ? <Typography>Please select an assay</Typography>  : <div>
        
        {assays.map((assay, index) => (
        <Accordion key={index} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography variant="h6">{assay['Assay Name']}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AssayPlot assay={assay} />
          </AccordionDetails>
        </Accordion>
      ))}

        </div>}
    </div>
  );
}
