import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Grid
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { capitalizeFirstLetter } from "./utils";

import { useTokenContext } from "@/contexts/TokenContext";
import { useApiContext } from "@/contexts/ApiEndPoint";





const BioPortalAnnotator = ({ termsToSearch }) => {


  const { apiEndpoint } = useApiContext();


  const { apiToken, setApiToken } = useTokenContext();


  const [annotationsList, setAnnotationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  

  useEffect(() => {
    const fetchAnnotations = async () => {
      setLoading(true);
      setError(null);
      setAnnotationsList([]);

      // try {
        // for (const term of termsToSearch) {
        //   const response = await axios.post(
        //     "http://data.bioontology.org/recommender",
        //     { input: term.replace(/\s*\(.*?\)\s*/g, '') },
        //     {
        //       headers: {
        //         Authorization: `apikey token=fd3ac62b-1d51-4f77-9d4b-513883f518e1`,
        //         "Content-Type": "application/json",
        //       },
        //     }
        //   );

        //   const objects = response.data;
        //   const maxEvaluationObject = objects.reduce((max, obj) => {
        //     return obj.evaluationScore > max.evaluationScore ? obj : max;
        //   }, objects[0]);

        //   const bestOntologyId = maxEvaluationObject.ontologies[0].acronym;

        //   const responseAnnotator = await axios.post(
        //     `http://data.bioontology.org/annotator?ontologies=${bestOntologyId}`,
        //     { text: term, longest_only: true },
        //     {
        //       headers: {
        //         Authorization: `apikey token=fd3ac62b-1d51-4f77-9d4b-513883f518e1`,
        //         "Content-Type": "application/json",
        //       },
        //     }
        //   );

        //   const findMaxDifferenceObject = (data) => {
        //     let maxDiff = -Infinity;
        //     let resultObject = null;

        //     data.forEach((obj) => {
        //       obj.annotations.forEach((annotation) => {
        //         const diff = Math.abs(annotation.to - annotation.from);
        //         if (diff > maxDiff) {
        //           maxDiff = diff;
        //           resultObject = obj;
        //         }
        //       });
        //     });

        //     return resultObject;
        //   };

        //   const maxDiffObject = findMaxDifferenceObject(responseAnnotator.data);

        //   const newRecord = {
        //     term,
        //     bestOntology: bestOntologyId,
        //     score: maxEvaluationObject.evaluationScore,
        //     referenceId: maxDiffObject
        //       ? maxDiffObject["annotatedClass"]["@id"].split("/").pop()
        //       : "",
        //     referenceLink: maxDiffObject
        //       ? maxDiffObject["annotatedClass"].links.ui
        //       : "",
        //   };

        //   // Avoid adding duplicate records
        //   setAnnotationsList((prevList) => {
        //     const exists = prevList.some(record => record.term === term);
        //     if (exists) {
        //       return prevList;
        //     }
        //     return [...prevList, newRecord];
        //   });

        //   // Wait for 1.5 seconds before proceeding to the next request
        //   await new Promise((resolve) => setTimeout(resolve, 1500));
        // }

        try {
          const response = await axios.post(`${apiEndpoint}/get_ontologies`, {
            token: apiToken,
            terms: termsToSearch
          });
      
          console.log('response.data', response.data)
          setAnnotationsList(response.data)
      
     


      } catch (err) {
        console.error("Error details:", err.response || err.message || err);
        setError(
          "An error occurred while fetching annotations. Please check the console for details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (termsToSearch.length > 0) {
      fetchAnnotations();
    }
  }, [termsToSearch]);

  return (
    <div>
      {loading && 
      <Grid container columnGap={15} >
        <Typography variant="h6" fontWeight="bold">Fetching ontologies</Typography>
      <CircularProgress color="secondary" />
      </Grid>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {annotationsList.length > 0 && (
          <div>
            <Typography color='green' variant="h6" fontWeight="bold" 
            // sx={{borderBottom : 1, borderColor : 'Black' }}
            >
              Ontology for terms in the selected experiment:
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                marginTop: 1, 
                border : 1
              }}
            >
              <Table>
                <TableBody>
                  <TableRow sx={{ backgroundColor: 'white' }}>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight : "bold", color : 'blue'}}>
                        Terms
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color='blue' variant="subtitle1" fontWeight="bold">
                        Ontology
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography color='blue' variant="subtitle1" fontWeight="bold">
                        Synonyms
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography color='blue' variant="subtitle1" fontWeight="bold">
                      Definitions
                      </Typography>
                    </TableCell>



                    {/* <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Evaluation Score
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Reference ID
                      </Typography>
                    </TableCell> */}

                  </TableRow>
                  {annotationsList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography>{capitalizeFirstLetter(item.search_term)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                        <a href={item.best_match.class_id} target="_blank" >{item.best_match.source}</a>
                          </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>
                        {item.best_match.synonyms}
                          </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>
                        {item.best_match.definitions}
                          </Typography>
                      </TableCell>

                      {/* <TableCell>
                        <Typography>{item.score}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>
                          <a href={item.referenceLink} target="_blank" >{item.referenceId}</a>
                        </Typography>
                      </TableCell> */}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default BioPortalAnnotator;


