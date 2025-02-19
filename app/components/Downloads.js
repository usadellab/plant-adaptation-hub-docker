"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Checkbox,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTokenContext } from "@/contexts/TokenContext";
import { useApiContext } from "@/contexts/ApiEndPoint";
import { capitalizeFirstLetter } from "./utils";

export default function Downloads({ studyId }) {
  const { apiEndpoint } = useApiContext();
  const { apiToken } = useTokenContext();
  const [assayData, setAssayData] = useState([]);
  const [assayNames, setAssayNames] = useState([]);
  const [selectedAssay, setSelectedAssay] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    axios
      .post(`${apiEndpoint}/assays?studyId=${[studyId]}&token=${apiToken}`)
      .then((response) => {
        let data = response.data.result.data;
        setAssayData(data);
        let assayNames = data.map((assay) => assay.assay_name);
        setAssayNames(assayNames);
      });
  }, [studyId, apiEndpoint, apiToken]);

  const handleCardClick = (assayName) => {
    setSelectedAssay(assayName);
    setSelectedItems([]);
  };

  const handleCheckboxChange = (itemName) => {
    const selectedIndex = selectedItems.indexOf(itemName);
    let newSelectedItems = [...selectedItems];

    if (selectedIndex === -1) {
      newSelectedItems.push(itemName);
    } else {
      newSelectedItems.splice(selectedIndex, 1);
    }

    setSelectedItems(newSelectedItems);
  };

  const handleDownloadClick = (downloadFormat) => {
    axios({
        method: 'post',
        url: `${apiEndpoint}/download/assay?assayId=${selectedItems}&downloadFormat=${downloadFormat}&token=${apiToken}`,
        responseType: 'blob'  // Use 'blob' for both TSV and ZIP downloads
    })
    .then((response) => {
        // Generate a URL for the blob directly from the response data
        const url = window.URL.createObjectURL(response.data);

        // Create an anchor element and trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `data.${downloadFormat === 'tsv' ? 'zip' : 'zip'}`;
        document.body.appendChild(a);
        a.click();

        // Clean up the URL object and remove the anchor element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // console.log(`Downloaded ${downloadFormat} for assay ID: ${selectedItems}`);
    })
    .catch((error) => {
        console.error(`Error downloading ${downloadFormat} for assay ID: ${selectedItems}`, error);
    });
};

  const renderAssayCard = (selectedAssay, index) => {
    const assay = assayData.filter(
      (assay) => assay.assay_identifier === selectedAssay
    )[0];

    return (
      <Grid key={index} item>
        <Box
          sx={{ width: 500 }}
          onClick={() => {
            handleCardClick(assay.assay_name);
          }}
        >
          <table>
            <tbody style={{ verticalAlign: "top" }}>
              <tr>
                <td className="custom-key-text" style={{ paddingRight: "2px" }}>
                  <Typography color={"blue"}>Experiment-{index + 1}</Typography>
                  {/* Name */}
                </td>
                <td className="custom-value-text">
                  <Typography color={"blue"} fontWeight={"bold"}>
                    {capitalizeFirstLetter(assay["assay_name"])}
                  </Typography>
                </td>
              </tr>
              {!assay["assay_measurement_type"] || (
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
              )}

              {!assay["assay_technology_type"] || (
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
              )}

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
              {!assay["locations"] || (
                <tr>
                  <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                  >
                    Locations
                  </td>
                  <td className="custom-value-text">
                    {" "}
                    {assay["locations"]
                      .filter((location) => location)
                      .join(", ") || (
                      <Typography className="custom-value-text">
                        No data available
                      </Typography>
                    )}{" "}
                  </td>
                </tr>
              )}

              {!assay["associated_factors"] || (
                <tr>
                  <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                  >
                    Treatments
                  </td>
                  <td className="custom-value-text">
                    {" "}
                    {assay["associated_factors"]
                      .filter((trt) => trt)
                      .join(", ") || (
                      <Typography className="custom-value-text">
                        No treatment applied
                      </Typography>
                    )}{" "}
                  </td>
                </tr>
              )}

              {!assay["plant_anatomical_entities"] || (
                <tr>
                  <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                  >
                    Plant anatomical entitiy
                  </td>
                  <td className="custom-value-text">
                    {" "}
                    {assay["plant_anatomical_entities"]
                      .filter((tissue) => tissue)
                      .join(", ") || (
                      <Typography className="custom-value-text">
                        No data available
                      </Typography>
                    )}{" "}
                  </td>
                </tr>
              )}

              {!assay["associated_intervals"] || (
                <tr>
                  <td
                    className="custom-key-text"
                    style={{ paddingRight: "2px" }}
                  >
                    Time points
                  </td>
                  <td className="custom-value-text">
                    {" "}
                    {assay["associated_intervals"]
                      .filter((time_point) => time_point)
                      .join(", ") || (
                      <Typography className="custom-value-text">
                        No data available
                      </Typography>
                    )}{" "}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Grid>
    );
  };

  const renderItems = () => {
    const columns = [
      {
        field: "checkbox",
        headerName: "Select",
        width: 50,
        renderCell: (params) => (
          <Checkbox
            checked={selectedItems.includes(params.row.name)}
            onChange={() => handleCheckboxChange(params.row.name)}
          />
        ),
      },
      {
        field: "name",
        headerName: "Assay",
        width: 500,
        renderCell: (params) => (
          <div> {renderAssayCard(params.row.name, params.row.id)} </div>
        ),
      },
    ];

    const rows = assayData.map((assay, index) => ({
      id: index,
      name: assay.assay_identifier,
    }));

    return (
      <div>
        {rows.length > 0 ? (
          <DataGrid
            rows={rows}
            getRowHeight={() => "auto"}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        ) : (
          <Typography>No data is available under this category</Typography>
        )}
      </div>
    );
  };




  return (
    <div>
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", textAlign: "left" }}
      ></Box>

      {!assayData.length > 0 || (
        <div>
          {renderItems()}

          <Grid container spacing={2}>
    <Grid
        sx={{ mt: 2, mr: 1, fontWeight: "bold", color: "green" }}
        item
    >
        Download Selected Items:
    </Grid>

    <Grid item>
        <Button
            size="small"
            sx={{ mt: 1 }}
            variant="contained"
            disabled={selectedItems.length === 0}
            onClick={() => handleDownloadClick('tsv')}
        >
            tsv
        </Button>
    </Grid>
    <Grid item>
        <Button
            size="small"
            sx={{ mt: 1 }}
            variant="contained"
            disabled={selectedItems.length === 0}
            onClick={() => handleDownloadClick('arc-ro-crate')}
        >
            ARC-RO-CRATE
        </Button>
    </Grid>
</Grid>

        </div>
      )}
    </div>
  );
}
