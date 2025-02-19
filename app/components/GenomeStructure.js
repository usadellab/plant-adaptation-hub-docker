
'use client'

import React, { useEffect, useState } from 'react'
import { Typography, Grid, Autocomplete, TextField } from '@mui/material'
import axios from 'axios'
import { useApiContext } from '@/contexts/ApiEndPoint'
import { useTokenContext } from '@/contexts/TokenContext'
import ComputeSynteny from './ComputeSyntenyPlot'



const annotationTypes = {
  INS: "Insertion in query",
  DEL: "Deletion in query",
  SYN: "Syntenic region",
  SYNAL: "Alignment in syntenic region",
  INV: "Inverted region",
  INVAL: "Alignment in inverted region",
  TRANS: "Translocated region",
  TRANSAL: "Alignment in translocated region",
  INVTR: "Inverted translocated region",
  INVTRAL: "Alignment in inverted translocated region",
  DUP: "Duplicated region",
  DUPAL: "Alignment in duplicated region",
  INVDP: "Inverted duplicated region",
  INVDPAL: "Alignment in inverted duplicated region",
  NOTAL: "Un-aligned region",
  SNP: "Single nucleotide polymorphism",
  CPG: "Copy gain in query",
  CPL: "Copy loss in query",
  HDR: "Highly diverged regions",
  TDM: "Tandem repeat"
};




export default function GenomeStructure() {
  const [selectedAnnotation, setSelectedAnnotation] = useState("Syntenic region");
  const [assembliesData, setAssembliesData] = useState(null)
  const {apiEndpoint} = useApiContext();
  const token = useTokenContext();

  const [plotData, setPlotData] = useState(null)


  const [g1, setG1] = useState('')
  const [g2, setG2] = useState('')
  
  const handleG1 = (e, value) => {
    setG1(value)
  }
  
  const handleG2 = (e, value) => {
    setG2(value)
  }


  const handleAnnotationType = (e, value) => {
    const selectedKey = Object.keys(annotationTypes).find(key => annotationTypes[key] === value);
    setSelectedAnnotation(selectedKey);
    SyriVisualizer(selectedKey)
  };


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


  
  const SyriVisualizer = (selectedKey) => {
    const parsedData = parseSyriData(syriData);
    const filteredData = parsedData.filter(d => d.annotationType === selectedKey);
    setPlotData(filteredData)

  }


  const syriData = `
  Chr20   1       738     -       -       -       -       -       NOTAL1  -       NOTAL   -
  Chr20   739     12014303        -       -       Chr20   99257   12029827        SYN1    -       SYN     -
  Chr20   739     8977    -       -       Chr20   99257   107493  SYNAL1  SYN1    SYNAL   -
  Chr20   1116    1116    C       T       Chr20   99634   99634   SNP62   SYN1    SNP     -
  Chr20   2109    2109    A       AT      Chr20   100627  100628  INS63   SYN1    INS     -
  Chr20   4404    4404    T       C       Chr20   102923  102923  SNP64   SYN1    SNP     -
  Chr20   4649    4653    ACACG   A       Chr20   103168  103168  DEL65   SYN1    DEL     -
  Chr20   5103    5103    C       G       Chr20   103618  103618  SNP66   SYN1    SNP     -
  Chr20   5197    5197    A       G       Chr20   103712  103712  SNP67   SYN1    SNP     -
  Chr20   5262    5262    C       G       Chr20   103777  103777  SNP68   SYN1    SNP     -
  Chr20   5273    5273    G       A       Chr20   103788  103788  SNP69   SYN1    SNP     -
  Chr20   5373    5373    A       G       Chr20   103888  103888  SNP70   SYN1    SNP     -
  Chr20   5430    5430    C       A       Chr20   103945  103945  SNP71   SYN1    SNP     -
  Chr20   5755    5755    A       T       Chr20   104270  104270  SNP72   SYN1    SNP     -
  Chr20   6578    6578    G       GA      Chr20   105093  105094  INS73   SYN1    INS     -
  Chr20   7377    7377    G       C       Chr20   105893  105893  SNP74   SYN1    SNP     -
  Chr20   8604    8604    A       G       Chr20   107120  107120  SNP75   SYN1    SNP     -
  Chr20   8977    9018    -       -       Chr20   107493  107519  HDR1    SYN1    HDR     -
  Chr20   9019    572507  -       -       Chr20   107520  671031  SYNAL2  SYN1    SYNAL   -
  Chr20   9601    9601    C       CTTTT   Chr20   108102  108106  INS76   SYN1    INS     -
  Chr20   11671   11671   C       T       Chr20   110176  110176  SNP77   SYN1    SNP     -
  Chr20   11697   11697   G       T       Chr20   110202  110202  SNP78   SYN1    SNP     -
  Chr20   11703   11703   T       C       Chr20   110208  110208  SNP79   SYN1    SNP     -
  Chr20   11720   11720   A       G       Chr20   110225  110225  SNP80   SYN1    SNP     -
  Chr20   11747   11747   A       G       Chr20   110252  110252  SNP81   SYN1    SNP     -
  `;
  
  const parseSyriData = (data) => {
    return data.trim().split('\n').map(line => {
      const columns = line.split('\t');
      return {
        refChr: columns[0],
        refStart: +columns[1],
        refEnd: +columns[2],
        refSeq: columns[3],
        qrySeq: columns[4],
        qryChr: columns[5],
        qryStart: +columns[6],
        qryEnd: +columns[7],
        uniqueId: columns[8],
        parentId: columns[9],
        annotationType: columns[10],
        copyStatus: columns[11]
      };
    });
  };





  return (

    
    <div>
      {!assembliesData ? <Typography> Loading .. </Typography> : 
      <Grid 
      sx={{ ml: 2, marginTop: 4, marginRight: 2, marginBottom : 2}}>
        
      <Typography variant="h8" color={'green'} fontWeight={'bold'}>Description: </Typography>

      <Grid container spacing={2} direction={'column'}>

<Grid item> 
<Autocomplete
fullWidth
sx={{ mt: 2}}
            size="small"
            options={assembliesData}
            getOptionLabel={(assembly) => assembly.assemblyinfo_assemblyname_}
            renderOption={(props, assembly) => (
              <li {...props}>
                <span>{assembly.assemblyinfo_assemblyname_}</span>
                <span style={{ color: "green", marginLeft: 8 }}>
                  ( Cultivar:{" "}
                  {assembly.organism_infraspecificnames_cultivar_ || "unknown"},
                  Ecotype:{" "}
                  {assembly.organism_infraspecificnames_ecotype_ || "unknown"} ,
                  Accession: {assembly.accession_ || "unknown"} )
                </span>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select source genome assembly"
                variant="outlined"
              />
            )}
            onChange={handleG1}
          />
                        </Grid>

<Grid item> 
<Autocomplete
            size="small"
            fullWidth
                        options={assembliesData}
            getOptionLabel={(assembly) => assembly.assemblyinfo_assemblyname_}
            renderOption={(props, assembly) => (
              <li {...props}>
                <span>{assembly.assemblyinfo_assemblyname_}</span>
                <span style={{ color: "green", marginLeft: 8 }}>
                  ( Cultivar:{" "}
                  {assembly.organism_infraspecificnames_cultivar_ || "unknown"},
                  Ecotype:{" "}
                  {assembly.organism_infraspecificnames_ecotype_ || "unknown"} ,
                  Accession: {assembly.accession_ || "unknown"} )
                </span>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select query genome assembly"
                variant="outlined"
              />
            )}
            onChange={handleG2}
          /></Grid>

<Grid item> 
<Autocomplete
                          fullWidth
                          size="smalll"
                          options={Object.values(annotationTypes)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Genomic structure"
                              variant="outlined"
                            />
                          )}
                          onChange={handleAnnotationType}
                        />
</Grid>


</Grid>

    

{!plotData || 

<div>
{!(selectedAnnotation == "SYN") ||   <ComputeSynteny genomes={assembliesData} syntenyBlocks={plotData} width={1000} height={1000} ></ComputeSynteny>}


</div>

}

{/* <ComputeSynteny width={800} height={800} /> */}






        </Grid>}
    </div>

  )
}
