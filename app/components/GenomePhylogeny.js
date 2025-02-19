'use client'

import React, { useEffect, useState } from 'react'
import GenomeMetadataVisualizer from './GenomeMetadataVisualizer'
import { Typography, Grid } from '@mui/material'
import axios from 'axios'
import { useApiContext } from '@/contexts/ApiEndPoint'
import { useTokenContext } from '@/contexts/TokenContext'

export default function GenomePhylogeny() {
  const [assembliesData, setAssembliesData] = useState(null)
  const {apiEndpoint} = useApiContext();
  const token = useTokenContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiEndpoint}/get_genomes_metadata`,
          { token: token.apiToken },  // Send data as object in request body
          { headers: { 'Content-Type': 'application/json' } } // Set Content-Type header
        );
        setAssembliesData(response.data);
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    };
  
    fetchData();
  }, []);


  return (
    <div>
      {!assembliesData ? <Typography> Loading .. </Typography> : 
      <Grid sx={{ ml: 2, marginTop: 4, marginRight: 2, marginBottom : 2}}>
        
      <Typography variant="h8" color={'green'} fontWeight={'bold'}>Description: </Typography>
      <Typography variant="p">
        {`A tool for the basic comparative analysis of the currently available genomes of the selected spp.`}
      </Typography>
        <GenomeMetadataVisualizer data={assembliesData} /> 
        </Grid>}
    </div>

  )
}




