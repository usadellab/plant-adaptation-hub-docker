'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTokenContext } from '@/contexts/TokenContext';
import { useApiContext } from '@/contexts/ApiEndPoint';
import SearchAndFilterComponent from './SearchAndFilterComponent';
import { Typography } from '@mui/material';
import JsonDataViewer from './JsonDataViewer';
import { useAppDataContext } from '@/contexts/AppDataContext'


const DatabaseExplorer = () => {
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

  const router = useRouter();

  
  const searchParams = useSearchParams();

  const component = searchParams.get('component');
  const tableName = searchParams.get('tableName');
  const pageTitle = searchParams.get('pageTitle')
  const filterLabel = searchParams.get('dtype') ;

  const[tableData, setTableData] = useState(null)
  const { apiEndpoint } = useApiContext();
  const { apiToken, setApiToken } = useTokenContext();
  const[rowData, setRowData] = useState(null)


  const getPstgresTable = async (tableName) => {
    try {
      const response = await axios.post(`${apiEndpoint}/postgres`, {
        tableName, // Passed in the body as JSON
        token: apiToken, // Passed in the body as JSON
      });

      return response.data.result; // Assuming `result` is the key in your backend response
    } catch (error) {
      console.error("Error fetching data:", error.response || error.message);
      throw error; // Re-throw error if needed
    }
  };

  // Fetch table data when `tableName` changes
  useEffect(() => {
    const fetchData = async () => {
      if (tableName) {
        try {
          const data = await getPstgresTable(tableName);
          if(filterLabel){
            const filteredData = data.filter(record => 
              record.type === filterLabel || record.subtype === filterLabel
            );
            setTableData(filteredData);
          }else{
            setTableData(data); // Update state with fetched data
          }
        } catch (error) {
          console.error("Error in fetching table data:", error.message);
        }
      }
    };

    fetchData();
    setRowData(null)
  }, [tableName, filterLabel]); // Re-run effect when `tableName` changes

  //   setSelectedTable(value);

  //   // Fetch columns and first 60 rows for the selected table
  //   const response = await axios.get(`/api/table/${value}`);
  //   setTableColumns(response.data.columns);
  //   setTableData(response.data.rows);
  // };

  const handleSelection = (params) => {
    setRowData(params['row'])

    let selectedRowData = params['row']
    let newChecked = new Array(
      phenotypeSelectedStudySelectedAssays.length,
    ).fill(false)
    let indexFromAssay = parseInt(selectedRowData.assay_identifier.split('A')[1]) - 1
    newChecked[indexFromAssay] = true
    setPhenotypeSelectedStudySelectedAssays(newChecked)

  }


  useEffect(() => {
    if(rowData){
      let defaultPhenotype = {
        category: rowData.data_table_name,
        title: rowData.variable_name,
        study_identifier: rowData.study_identifier,
      }
    
      // setPhenotypeSelectedStudySelectedAssays(data.assay_identifier)
      setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype(
        defaultPhenotype,
      )
      setVariablesToPlot([defaultPhenotype])
  
    }

  },[phenotypeSelectedStudySelectedAssaysPhenotypes])
  return (
    <div>

<Typography 
      variant="h3" 
      align="center" 
      sx={{
        pt:1,
        pb: -1,
        color: '#2e7d32', // Stylish color
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)', // Slight shadow for elegance
      }}
    >
      List of {pageTitle}
    </Typography>


      {!tableData || 
            <SearchAndFilterComponent data={tableData} onSelection={handleSelection} tableName={tableName} />

      }
    {!rowData || <JsonDataViewer data={rowData} depth={1}/>}
      
    </div>
  );
};

export default DatabaseExplorer;
