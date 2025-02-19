'use client'
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { capitalizeFirstLetter } from "./utils";
import axios from "axios";
import { useTokenContext } from "@/contexts/TokenContext";
import { useApiContext } from "@/contexts/ApiEndPoint";

export default function StudyMetaData({studyMetaData, assays}) {
    const [assaysForStudyDescription, setAssaysForStudyDescription] = useState([])
    const { apiEndpoint } = useApiContext()

    const token = useTokenContext()

    useEffect(() => {
        if(studyMetaData.study_identifier){
            axios.post(`${apiEndpoint}/study?studyId=${studyMetaData.study_identifier}&token=${token.apiToken}`)
            .then(response => {
                setAssaysForStudyDescription(response.data.result.data)
            })
    
        }

    },[studyMetaData])


    var study_locations = []
    var study_treatments = []
    var study_intervals = []
    var study_tissues = []
    var study_institutes = []

    assaysForStudyDescription.map(assay => {
        study_locations = [...study_locations, ...assay.locations]
        study_treatments = [...study_treatments, ...assay.associated_factors]
        study_tissues = [...study_tissues, ...assay.plant_anatomical_entities]
        study_intervals = [...study_intervals, ...assay.associated_intervals]
        study_institutes = [...study_institutes, ...assay.institutes]
    })

    study_locations = [...new Set(study_locations)];
    study_treatments = [...new Set(study_treatments)];
    study_intervals = [...new Set(study_intervals)];
    study_tissues = [...new Set(study_tissues)];
    study_institutes = [...new Set(study_institutes)];



return (
<div>
    <Box
    sx={{
        mb: 2,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        borderTop : 1,
    }}
    >
    {/* <Box sx={{ mr: 7, mt: 0.5 }}>Study</Box> */}

    <table>
        <tbody style={{ verticalAlign: "top" }}>
        <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Project
            </td>
            <td className="custom-value-text">
            <Typography color='blue' fontWeight={'bold'}>{capitalizeFirstLetter(studyMetaData["investigation_identifier"])}</Typography>
            </td>
        </tr>

        <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Title
            </td>
            <td className="custom-value-text">
            {studyMetaData["study_title"]}
            </td>
        </tr>



        <tr>
        <td
            className="custom-key-text"
            style={{ paddingRight: "2px" }}
        >
            Description
        </td>
        <td className="custom-value-text"> {studyMetaData["study_description"]} </td>
        </tr>

<tr>
    <td className="custom-key-text" style={{ paddingRight: "10px" }}>
        Duration
    </td>
    <td className="custom-value-text">
        {new Date(studyMetaData["study_start_date"]).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })} 
        {" - "}
        {new Date(studyMetaData["study_end_date"]).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })}
    </td>
</tr>

        <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Species
                </td>
                <td className="custom-value-text"> Camelina ( Camelina sativa (L.) Crantz) </td>
        </tr>


        {!study_locations.filter(location => location).join(', ') || 
                <tr>
                <td
                    className="custom-key-text"
                >
                    Locations
                </td>
                <td className="custom-value-text"> {study_locations.filter(location => location).join(', ')} </td>
            </tr>
    
        }


{!study_treatments.filter(treatment => treatment).join(', ')  ||
        <tr>
        <td
            className="custom-key-text"
        >
            Treatments
        </td>
        <td className="custom-value-text"> {study_treatments.filter(treatment => treatment).join(', ') || < Typography className="custom-value-text" >No treatment applied</Typography>} </td>
        </tr>
}



{!study_tissues.filter(tissue => tissue).join(', ') ||
        <tr>
        <td
            className="custom-key-text"
            style={{ paddingRight: "10px" }}
        >
            Plant anatomical entitiy
        </td>
        <td className="custom-value-text"> {study_tissues.filter(tissue => tissue).join(', ') || < Typography className="custom-value-text" >No data available</Typography>}  </td>
        </tr>

}

        {!study_intervals.filter(interval => interval).join(', ') ||
        <tr>
        <td
            className="custom-key-text"
        >
            Time points
        </td>
        <td className="custom-value-text"> {study_intervals.filter(interval => interval).join(', ') || <Typography className="custom-value-text" >No time points measured</Typography>} </td>
        </tr>
}





{/* <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            study identifier
            </td>
            <td className="custom-value-text">
            {studyMetaData["study_identifier"]}
            </td>
        </tr> */}



        {/* <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            dbID
            </td>
            <td className="custom-value-text">
            {studyMetaData["study_identifier"]}
            </td>
        </tr> */}

        {/* <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Description
            </td>
            <td className="custom-value-text">
            {studyMetaData["study_description"]}
            </td>
        </tr> */}

        {/* <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Contact
            </td>
            <td className="custom-value-text">
            {studyMetaData["study_contact_institution"]}
            </td>
        </tr> */}

{!study_institutes.filter(intsitute => intsitute).join(', ') ||

<tr>
<td
    className="custom-key-text"
>
    Institutes involved
</td>
<td className="custom-value-text"> {study_institutes.filter(intsitute => intsitute).join(', ')} </td>
</tr>

}

{!studyMetaData.publication.authorlist ||
    <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Author List
            </td>
            <td className="custom-value-text">
            {studyMetaData["publication"]["authorlist"]}
            </td>
        </tr>
}

{!studyMetaData.publication.year ||


        <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Year
            </td>
            <td className="custom-value-text">
            {studyMetaData["publication"]["year"]}
            </td>
        </tr>
}

{!studyMetaData.publication.journal ||


        <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Journal
            </td>
            <td className="custom-value-text">
            {studyMetaData["publication"]["journal"]}
            </td>
        </tr>

}

{!studyMetaData.publication.publisher  ||

        <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Publisher
            </td>
            <td className="custom-value-text">
            {studyMetaData["publication"]["publisher"]}
            </td>
        </tr>

}
 
 
{!studyMetaData.publication.abstract ||
       <tr>
            <td className="custom-key-text" style={{ paddingRight: "10px" }}>
            Abstract
            </td>
            <td className="custom-value-text">
            {studyMetaData["publication"]["abstract"]}
            </td>
        </tr>
}









        </tbody>
    </table>

    
    </Box>
{!(assays.length > 0) || <div>

    <Typography color='green' variant="h6" fontWeight="bold">
              Selected experiments (performed as part of this study):
            </Typography>


    <div>
    {!assays ||
        assays.map((assay, index) => (
        <Box
            sx={{
            mb: 1,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            marginTop: 1, 
            borderTop : 1,
            
            }}
            key={index}
        >
            {/* <Box 
            sx={{ mr: 5, mt: 0.5 }} 
            className="numbering">
            Assay-{index + 1}
            </Box> */}
            <table>
            <tbody style={{ verticalAlign: "top" }}>
                <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    <Typography color={'blue'}>Experiment-{index + 1}</Typography> 
                    {/* Name */}
                </td>
                <td className="custom-value-text">
                <Typography color={'blue'} fontWeight={'bold'}>{capitalizeFirstLetter(assay["assay_name"])}</Typography> 
                    
                </td>
                </tr>
                <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Measurement Type
                </td>
                <td className="custom-value-text">
                    {assay["assay_measurement_type"]}
                </td>
                </tr>
                <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "5px" }}
                >
                    Technology Type
                </td>
                <td className="custom-value-text">
                    {assay["assay_technology_type"]}
                </td>
                </tr>

                {/* <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Protocols
                </td>
                <td className="custom-value-text">
                    {(assay["assay_name"])} experiment
                </td>
                </tr> */}

                {/* <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Platform
                </td>
                <td className="custom-value-text">
                    {assay["assay_technology_platform"]}
                </td>
                </tr> */}
                
                {/* <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    dbID
                </td>
                <td className="custom-value-text">
                    {assay["assay_identifier"]}
                </td>
                </tr> */}

                <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Locations
                </td>
                <td className="custom-value-text"> {assay['locations'].filter(location => location).join(', ') || < Typography className="custom-value-text" >No data available</Typography>}  </td>
                </tr>

                <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Treatments
                </td>
                <td className="custom-value-text"> {assay['associated_factors'].filter(trt => trt).join(', ') || < Typography className="custom-value-text" >No treatment applied</Typography>}  </td>
                </tr>


                <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Plant anatomical entitiy
                </td>
                <td className="custom-value-text"> {assay['plant_anatomical_entities'].filter(tissue => tissue).join(', ') || < Typography className="custom-value-text" >No data available</Typography>}  </td>
                </tr>


                <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Time points
                </td>
                <td className="custom-value-text"> {assay['associated_intervals'].filter(time_point => time_point).join(', ') || < Typography className="custom-value-text" >No data available</Typography>}  </td>
                </tr>



                <tr>
                <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                >
                    Assay identifier
                </td>
                <td className="custom-value-text"> {assay['assay_identifier'] || < Typography className="custom-value-text" >No data available</Typography>}  </td>
                </tr>


            </tbody>
            </table>
        </Box>
        ))}
    </div>



</div> }

</div>
);
}
