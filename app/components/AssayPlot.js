'use client'
import React, { useEffect, useState } from 'react';
import { Paper, Grid, Typography } from '@mui/material';

export default function AssayPlot({ assay }) {
  // Example data

  const [timeIntervals, setTimeIntervals] = useState(['Time Point'])
  

  // useEffect(() => {

  //     if(assay.timeIntervals.length > 0){
  //       setTimeIntervals([assay.timeIntervals])
  //     }

  // },[assay])

  return (
    <div>

      {timeIntervals.length < 1 ||
            <Paper
            sx={{
              border: 1,
              borderColor: 'green',
              padding: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '600px', // or any fixed height you prefer
            }}
          >
            <Grid container columnGap={1} rowGap={1} justifyContent="center" alignItems="center">
              {timeIntervals.map((timeInterval, index) => (
                <div>
                <Grid item> 
                    <Typography variant="body1">{timeInterval}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12} // Full width on extra-small screens
                  sm={12}  // Half width on small screens and up
                  md={12}  // One-third width on medium screens and up
                  key={index}
                  sx={{
                    border: 1,
                    borderColor: 'black',
                    backgroundColor: 'lightblue',
                    // display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: `${100 / timeIntervals.length}%`, // Fixed height for each item
                    padding: 2,
                  }}
                >
    
    <Grid container columnGap={1} rowGap={1} justifyContent="center" alignItems="center">
              {assay.Locations.map((timeInterval, index) => (
                <div>
                <Grid item> 
                    <Typography variant="body1">{timeInterval}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12} // Full width on extra-small screens
                  sm={12}  // Half width on small screens and up
                  md={12}  // One-third width on medium screens and up
                  key={index}
                  sx={{
                    border: 1,
                    borderColor: 'black',
                    backgroundColor: 'lightyellow',
                    // display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: `${100 / assay.Locations.length}%`, // Fixed height for each item
                    padding: 2,
                  }}
                >
    
    
    
    
    
    
    <Grid container columnGap={1} rowGap={1} justifyContent="center" alignItems="center">
              {assay.tissuesMeasured.map((timeInterval, index) => (
                <div>
                <Grid item> 
                    <Typography variant="body1">{timeInterval}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12} // Full width on extra-small screens
                  sm={12}  // Half width on small screens and up
                  md={12}  // One-third width on medium screens and up
                  key={index}
                  sx={{
                    border: 1,
                    borderColor: 'black',
                    backgroundColor: 'lightyellow',
                    // display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: `${100 / assay.tissuesMeasured.length}%`, // Fixed height for each item
                    padding: 2,
                  }}
                >
    
    
    
    {!assay.treatments || <div>
      
      
      </div>}
    <Grid container columnGap={1} rowGap={1} justifyContent="center" alignItems="center">
              {assay.treatments.map((timeInterval, index) => (
                <div>
                <Grid item> 
                    <Typography variant="body1">{timeInterval}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12} // Full width on extra-small screens
                  sm={12}  // Half width on small screens and up
                  md={12}  // One-third width on medium screens and up
                  key={index}
                  sx={{
                    border: 1,
                    borderColor: 'black',
                    backgroundColor: 'lightyellow',
                    // display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: `${100 / assay.treatments.length}%`, // Fixed height for each item
                    padding: 2,
                  }}
                >
                </Grid>
                </div>
              ))}
            </Grid>
    
    
    
                </Grid>
                </div>
              ))}
            </Grid>
    
    
    
    
    
    
    
                </Grid>
                </div>
              ))}
            </Grid>
    
    
    
    
    
    
                </Grid>
                </div>
              ))}
    
    
    
    
    
    
    
    
    
    
    
            </Grid>
          </Paper>
      }

    </div>
  );
}

