'use client'
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import worldGeoJson from "/public/worldgeo.json"; 
import * as d3 from 'd3';
import axios from "axios";
import { useTokenContext } from "@/contexts/TokenContext";
import { useApiContext } from "@/contexts/ApiEndPoint";
import '../globals.css';
import { Typography } from '@mui/material';

const LocationMap = ({assayData, mapData}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [germplasmData, setGermplasmData] = useState([]);
  const [popupPosition, setPopupPosition] = useState([0, 0]);
  const [plotLayout, setPlotLayout] = useState({
    showlegend: false,
    width: '100%',  // Set width to 100% to fill the container
    height: 800,    // Maintain your desired height
    geo: {
        showcountries: true,
        showland: true,
        showocean: true,
        oceancolor: "#f0f0f0",
        showcoastlines: true,
        coastlinecolor: '#d3d3d3',
        landcolor: '#e0e0e0',
        projection: {
            type: 'mercator',
            scale: 2,
        },
        center: {
            lat: 40,
            lon: 50,
        },
    },
    margin: {
        l: 0,  
        r: 0,  
        t: 0,  
        b: 0,  
    },
    // Optional title configuration if you want to include it later
    // title: {
    //     text: 'Crop Locations in Asia and Europe',
    //     x: 0.5,
    //     xanchor: 'center',
    //     font: {
    //         size: 16,
    //         family: 'Arial, sans-serif',
    //         color: 'black',
    //     }
    // },
});


  const valuesToRemove = [
    "biological_material_city",
    "id",
    "investigation_identifier",
    "study_identifier",
  ];


  useEffect(() => {
    const getCountryData = () => {
      const countries = worldGeoJson.features;
      return countries.map((country) => {
        const centroid = d3.geoCentroid(country);
        return {
          name: country.properties.name,
          lat: centroid[1],
          lon: centroid[0],
        };
      });
    };

    setCountryData(getCountryData());
  }, []);

  // Handle marker click
  const handleClick = (event) => {
    const pointIndex = event.points[0].pointIndex;
    const clickedMarker = germplasmData[pointIndex];
    setSelectedMarker(clickedMarker);
    // setPopupPosition([clickedMarker.biological_material_latitude, clickedMarker.biological_material_longitude]);
    setPopupPosition([172, 280]);
  };

  // Store the zoom level before re-rendering
  const handleRelayout = (layoutUpdate) => {
    if (layoutUpdate && layoutUpdate['geo.center'] && layoutUpdate['geo.projection.scale']) {
      setPlotLayout((prevLayout) => ({
        ...prevLayout,
        geo: {
          ...prevLayout.geo,
          center: layoutUpdate['geo.center'],   // Preserve map center
          projection: {
            ...prevLayout.geo.projection,
            scale: layoutUpdate['geo.projection.scale'],  // Preserve zoom level
          },
        },
      }));
    }
  };


  
  return (
    <div style={{ width: '100%', height: '100%' }}> {/* Ensure container is responsive */}

       {assayData.length < 1 ? <Typography>Please select an assay</Typography> : 
         <div>
           {assayData.map((assay, index) => (
             <div style={{ marginTop: 1, marginBottom: 5 }} key={index}>
               <Typography color={"blue"}>
                 Assay {index + 1}. : {assay["Assay Name"]}
               </Typography>
               <Typography>
                 Locations: {assay["Locations"].filter(Boolean).join(", ")}
              </Typography>
              <Typography>
                 Institutes: {assay["Institutes"].filter(Boolean).join(", ")}
               </Typography>
             </div>))
           }
                    </div>

       }

      {!mapData.length > 0 || (
        <Plot
  data={[
    {
      type: 'scattergeo',
      mode: 'markers',
      lat: mapData.map((d) => d.institute_lat),
      lon: mapData.map((d) => d.institute_lng),
      marker: {
        symbol: "triangle-down",
        size: 16,
        color: '#DE3163',
        opacity: 0.8,
      },
      // Formatting text for hover using hovertemplate (without HTML)
      hovertemplate: mapData.map((d) =>
        `<b>Institute:</b> ${d.institute_name}<br>` +
        `<b>City:</b> ${d.institute_city}<br>` +
        `<b>Country:</b> ${d.institute_country}<br>` +
        `<b>Latitude:</b> ${d.institute_lat}<br>` +
        `<b>Longitude:</b> ${d.institute_lng}<br>` +
        `<b>Website:</b> <a href="${d.institute_weburl}" target="_blank">${d.institute_weburl}</a><br>` +
        `<extra></extra>`
      ),
      hoverinfo: 'text',
      hoverlabel: {
        align: "auto", 
        bordercolor: '#34495e',
        bgcolor: '#f5b7b1',
        font: {
          size: 14, 
          color: '#2c3e50' // Default text color
        }
      }

    },
    {
      type: 'scattergeo',
      mode: 'text',
      text: countryData.map((d) => d.name),
      lat: countryData.map((d) => d.lat),
      lon: countryData.map((d) => d.lon),
      textfont: {
        size: 10,
        color: 'black',
        family: 'Arial, sans-serif',
      },
      hoverinfo: 'none',
    },
  ]}
  layout={plotLayout}
  onClick={handleClick}
  onRelayout={handleRelayout}
/>
      )}
      {selectedMarker && (
        <div
          style={{
            position: 'absolute',
            top: `${popupPosition[0]}px`,
            left: `${popupPosition[1]}px`,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 10000,
          }}
          onClick={(e) => e.stopPropagation()}  // Prevent closing the popup when clicking inside
        >
          <button
            onClick={() => setSelectedMarker(null)}  // Close the popup when clicked
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            &times; {/* The 'X' symbol */}
          </button>

          <h2>Germplasm Info</h2>
          <table>
            <tbody>
              {Object.keys(selectedMarker).map((key, index) => (
                <tr key={index}>
                  <td className="custom-key-text">
                    {key.replace('biological_material_', '').replace('_', ' ').replace(/^./, str => str.toUpperCase())}:
                  </td>
                  <td className="custom-value-text">
                    {selectedMarker[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LocationMap;





