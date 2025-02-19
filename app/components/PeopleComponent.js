import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useTokenContext } from "../../contexts/TokenContext";
import { useApiContext } from '@/contexts/ApiEndPoint';

const PeopleComponent = ({ studyId }) => {
  const [peopleData, setPeopleData] = useState([]);
  const token = useTokenContext();
  const { apiEndpoint } = useApiContext();

  useEffect(() => {
    // Fetch data from API when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiEndpoint}/people?studyId=${studyId}&token=${token.apiToken}`
        );
        const sortedData = response.data.result.data.sort((a, b) => {
          const nameA = `${a.people_firstname} ${a.people_lastname}`.toLowerCase();
          const nameB = `${b.people_firstname} ${b.people_lastname}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        setPeopleData(sortedData);
      } catch (error) {
        console.error('Error fetching people data:', error);
      }
    };

    fetchData();
  }, [studyId]);

  // Helper function to handle missing or empty data
  const getDisplayValue = (value) => (value && value.trim() ? value : "N/A");

  return (
    <Box sx={{ paddingLeft: 1}}>
      {peopleData.length > 0 ? (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.dark' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Affiliation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {peopleData.map((person) => (
                <TableRow key={person.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.100' } }}>
                  <TableCell>{getDisplayValue(`${person.people_firstname} ${person.people_lastname}`)}</TableCell>
                  <TableCell>{getDisplayValue(person.people_role)}</TableCell>
                  <TableCell>{getDisplayValue(person.people_affiliation)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            marginTop: 4,
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          No records found.
        </Typography>
      )}
    </Box>
  );
};

export default PeopleComponent;
