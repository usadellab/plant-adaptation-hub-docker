import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { linReg, createHeatmapTrace, isNumber } from "./utils";
import { index } from "d3";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import HeatmapPlot from "./HeatMap";
import { titleize } from "i/lib/methods";
import Cookies from "js-cookie";
import { useAppDataContext } from "@/contexts/AppDataContext";
import BoxPlot from "./plots/boxplot";
import BarPlot from "./plots/barplot";
import LinePlot from "./plots/lineplot";
import RegressionAnalysis from "./stats/RegressionAnalysis";
import HistogramPlot from "./plots/histogram";
import SwipeableViews from 'react-swipeable-views'; // Import SwipeableViews
import { autoPlay } from 'react-swipeable-views-utils'; // For autoplay (optional)

import { Grid, IconButton } from '@mui/material'; // Import IconButton

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'; // Import left arrow icon
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Import right arrow icon


const AutoPlaySwipeableViews = autoPlay(SwipeableViews); // Create auto-playing version (optional)

const DEFAULT_PLOTLY_COLORS = [
    "rgb(31, 119, 180)",
    "rgb(255, 127, 14)",
    "rgb(44, 160, 44)",
    "rgb(214, 39, 40)",
    "rgb(148, 103, 189)",
    "rgb(140, 86, 75)",
    "rgb(227, 119, 194)",
    "rgb(127, 127, 127)",
    "rgb(188, 189, 34)",
    "rgb(23, 190, 207)",
    "rgb(188, 67, 67)",
    "rgb(67, 188, 67)",
    "rgb(67, 67, 188)",
    "rgb(240, 98, 146)",
    "rgb(98, 240, 146)",
    "rgb(146, 98, 240)",
    "rgb(255, 193, 37)",
    "rgb(193, 255, 37)",
    "rgb(37, 255, 193)",
    "rgb(0, 128, 128)"];

const PlotlyPlots = (props) => {

    const [index, setIndex] = React.useState(0); // State for current slide index

    const handleChangeIndex = (index) => {
        setIndex(index);
    };

    const handlePrev = () => {
        setIndex(prevIndex => (prevIndex === 0 ? 3 : prevIndex - 1)); // Wrap around
      };
    
      const handleNext = () => {
        setIndex(prevIndex => (prevIndex === 3 ? 0 : prevIndex + 1)); // Wrap around
      };

    
const {isSmallScreen} = useAppDataContext()
var plotType = props.plotSchema.plot_type || 'bar';
var inputData = props.plotSchema.inputData || [];
var selectedVars = props.plotSchema.variablesToPlot ;
var plotTitle = props.plotSchema.plotTitle || 'add plot title here';
var xLable = props.plotSchema.xLable || "";
var yLable = props.plotSchema.yLable || "";
var isDark = props.plotSchema.isDark || false;
var textColor = isDark ? '#FFFFFF' : '#000000'
var divider = props.plotSchema.divider || null
var plotSize = props.plotSchema.plotSize || '70%' 

var primaryLayout = {

    width: (plotSize * 2) * 5,
    height: (plotSize *2) * 5,
    hovermode: "closest",
    font: { color: textColor },
    xaxis: {
        // zeroline : false,
        "title" : '', 
        font: {
            color: textColor
        },
        tickfont: { color: textColor }
    },
    yaxis: {
        showgrid: true,
        "title" : '', 
        // zeroline : false,
    
        font: {
            color: textColor
        },
        tickfont: { color: textColor }
    
    },
    };

primaryLayout["title"] = plotTitle;
primaryLayout["plot_bgcolor"] = isDark ? '#000000' : '#FFFFFF'
primaryLayout["paper_bgcolor"] = isDark ? '#000000' : '#FFFFFF'

const [plotData, setPlotData] = useState([]);
const [plotLayout, setPlotLayout] = useState({});


useEffect(() => {

if(inputData.length > 0 && selectedVars.length > 0){
    // The 'line' is here hardcoded at the moment. It is always present in the data
    handlePlotData(['line', ...selectedVars], plotType, inputData);
}else if(inputData.length > 1 && selectedVars.length > 1){
    // The 'line' is here hardcoded at the moment. It is always present in the data
    handlePlotData(selectedVars, plotType, inputData);
}
}, [plotType, selectedVars, divider, plotTitle, xLable, yLable, plotSize]);

var handlePlotData = (selectedVars, plotType, inputData) => {
    var xdata = [];
    var ydata = [];

    var x = selectedVars[0];
    var y = selectedVars[1];

    var tracesData = {}

    const getTracesData = (y) => {
        var tracesData = {}
        const trimmedY = y.trim();
            const filteredObjects = inputData.filter(obj => obj.variable === trimmedY);
            // console.log('FILTERED OBJECTS', filteredObjects)
            function groupBy(list, key) {
                return list.reduce((accumulator, current) => {
                    // Extract the value of the specified key from the current object
                    const keyValue = current[key];
            
                    // If the key value already exists in the accumulator, push the current object to its array
                    if (accumulator[keyValue]) {
                        accumulator[keyValue].push(current);
                    } else {
                        // Otherwise, create a new array with the current object
                        accumulator[keyValue] = [current];
                    }
                    return accumulator;
                }, {});
            }
            const groupedDivider = groupBy(filteredObjects, divider);
            // const tissues = Object.keys(groupedDivider)
        
            const groupedObjects = groupBy(filteredObjects, 'subject');
        
        
            var plotData = {}
            Object.entries(groupedObjects).forEach(([accession, obj]) => {
                var newData = {    
                }
                obj.map(item => {
                    try{
                        newData[item[divider]].push(item.value)
                    }catch{
                        newData[item[divider]] = []
                        newData[item[divider]].push(item.value)
                    }
                })
                plotData[accession] = newData
            })
            const averages = {};
            Object.keys(plotData).forEach(key => {
            averages[key] = {};
            Object.keys(plotData[key]).forEach(subKey => {
                const values = plotData[key][subKey].map(parseFloat); // Convert strings to numbers
                const sum = values.reduce((acc, val) => acc + val, 0);
                const avg = sum / values.length;
                averages[key][subKey] = avg;
            });
            });
            
            const first = Object.keys(averages)[0]
        
        
            Object.entries(averages).map((value) => {
                var accession = value[0]
                var vals = value[1]
                Object.entries(vals).map((value) => {
                    // console.log('LOOK AT THIS',value)
                    let tissue = value[0]
                    let mean = value[1]
                    try{
                        tracesData[tissue][accession] = mean
                    }catch{
                        let obj  = {accession : mean}
                        tracesData[tissue] = {}
                        tracesData[tissue][accession] = mean
                    }
                })
            })

            return tracesData
    }

    if(divider){    
        // if(selectedVars.length < 3){
        if(plotType == 'bar' || plotType == 'histogram' || plotType == 'line' ){
            tracesData = getTracesData(y)
        }else{
            var all_traces = {}
            selectedVars.map(key => {
                tracesData = getTracesData(key)
                all_traces[key] = tracesData
            });
            tracesData = all_traces
            delete all_traces['line'];    // temporary fix, pleae update when possible
        }
    }else{
        for (let i = 0; i < inputData.length; i++) {
        var obj = inputData[i];
        xdata.push(obj.subject);
        ydata.push(obj.value);
        }
    }

    var accessions = []
    inputData.map(obj => {
        accessions.push(obj.line)
    })


//////////////////////////// Now for plot types

    if (plotType == "bar") {

        if(divider){
            var traces = []
            Object.entries(tracesData).map((items => {
        
                let key = items[0]
                let value = items[1]
        
                var trace = {
                    x: Object.keys(value),
                    y: Object.values(value),
                    name: key,
                    type: 'bar'
                };
                traces.push(trace)
            }))
            var plotData = traces
            var plotLayout = primaryLayout;
            plotLayout.xaxis.title = xLable || x;
            plotLayout.yaxis.title = yLable || y;
            plotLayout["barmode"] = "group";
            // plotLayout.showlegend = false;
            plotLayout.annotations = {};    
        }else{
            var plotData = [{ type: "bar", x: xdata, y: ydata }];
            var plotLayout = primaryLayout;
            plotLayout.xaxis.title = xLable || x;
            plotLayout.yaxis.title = yLable || y;
            plotLayout["boxmode"] = "group";
            plotLayout.showlegend = false;
            plotLayout.annotations = {};    
        }
    } else if (plotType == "line") {
        if(divider){
            var traces = []
            Object.entries(tracesData).map((items => {
        
                let key = items[0]
                let value = items[1]
        
                var trace = {
                    x: Object.keys(value),
                    y: Object.values(value),
                    name: key,
                    // type: 'bar'
                    mode : 'lines',
                    // name : key
        
                };
                traces.push(trace)
            }))
            var plotData = traces
            var plotLayout = primaryLayout;
            plotLayout.xaxis["title"] = xLable || 'Accessions';
            plotLayout.yaxis["title"] = yLable || selectedVars[1];
            plotLayout.annotations = {};
            plotLayout.showlegend = true;
        
        
        }else{
        var plotData = [{ type: "scatter", mode:"lines+markers", x: xdata, y : ydata }];
        var plotLayout = primaryLayout;
        plotLayout.xaxis["title"] = xLable || 'Accessions';
        plotLayout.yaxis["title"] = yLable || 'add label to y axis';
        plotLayout.annotations = {};
        plotLayout.showlegend = false;
        }
    } else if (plotType == "histogram") {
        if(divider){
            var traces = []
            Object.entries(tracesData).map(((items, index) => {
        
                let key = items[0]
                let value = items[1]    
                var trace = {
                    x: Object.values(value),
                    name: key,
                    // type: 'bar'
                    type: "histogram",
                    opacity: 0.6,
                    marker: {
                        color: DEFAULT_PLOTLY_COLORS[index],
                    },
        
                };
                traces.push(trace)
            }))
            var plotData = traces

            var plotLayout = primaryLayout;
            plotLayout['barmode'] = "overlay";

            plotLayout["xaxis"] = {};
            plotLayout.xaxis["title"] = xLable || selectedVars[1];
            plotLayout["yaxis"] = {};
            plotLayout.yaxis["title"] = yLable || 'add label to y axis';
            // plotLayout.showlegend = false;
            plotLayout.annotations = {};
        
        }else{
            var plotData = [{ type: "histogram", mode:'markers', x: ydata }];
            var plotLayout = primaryLayout;
            plotLayout["xaxis"] = {};
            plotLayout.xaxis["title"] = xLable || selectedVars[1];
            plotLayout["yaxis"] = {};
            plotLayout.yaxis["title"] = yLable || 'add label to y axis';
            plotLayout.showlegend = false;
            plotLayout.annotations = {};
        
        }
    } else if (plotType == "scatter") {
        if(divider){
            try {
                const x_name = Object.keys(tracesData)[0]
                var y_name = Object.keys(tracesData)[1]
                if(y_name == undefined){
                    y_name = x_name
                }
                if(x_name && y_name){
                    const categories = Object.keys(tracesData[x_name])
                    var traces = []
                    categories.map(category => {
                        traces.push({
                            x : Object.values(tracesData[x_name][category]),
                            y : Object.values(tracesData[y_name][category]),
                            text: Object.keys(tracesData[y_name][category]),
                            mode: 'markers',
                            name : category,
                            hovertemplate: '<b>Cultivar: %{text}</b><br>' + '<b><i>y</i></b>: %{y:.2f}' + '<br><b>X</b>: %{x}<br><extra></extra>',
                        })
                    })

                var plotData = traces
                var plotLayout = primaryLayout
                plotLayout["xaxis"] = {};
                plotLayout["yaxis"] = {};
                plotLayout.xaxis["title"] = xLable || selectedVars[0];
                plotLayout.yaxis["title"] = yLable || selectedVars[1];
                plotLayout.annotations = {};
                }

            } catch (error) {
                console.log('') // console.log('do nothing') temporary fix
                
            }
            

        }else{
        var x = []
        var y = []
        var metaX = []
        var metaY = []
        let firstVariable = null;
        let secondVariable = null;
        inputData.forEach(record => {
            if (firstVariable === null) {
            firstVariable = record.variable;
            } else if (secondVariable === null && record.variable !== firstVariable) {
            secondVariable = record.variable;
            }
        
            if (record.variable === firstVariable) {
                
            x.push(parseFloat(record.value));
            metaX.push(record)
            } else if (record.variable === secondVariable) {
            y.push(parseFloat(record.value));
            metaY.push(record)
            }
        });
        const validIndices = [];
        for (let i = 0; i < x.length; i++) {
            if (isNumber(x[i]) && isNumber(y[i])) {
                validIndices.push(i);
            }
            }
        x = validIndices.map(i => x[i]);
        y = validIndices.map(i => y[i]);
        var uniqueLabels = validIndices.map(i => metaX[i].Location)
        uniqueLabels = [...new Set(uniqueLabels)]

    // Create a color map for the labels
        const colorMap = {};
        uniqueLabels.forEach((label, index) => {
            colorMap[label] = DEFAULT_PLOTLY_COLORS[index];
        });

        // Apply colors to the data points based on their labels
        const markerColors = validIndices.map(i => colorMap[metaX[i].Location]);
        
        const textData = validIndices.map(i => {
            const metaXRecord = metaX[i];
            const metaYRecord = metaY[i];

            return `<b>Cultivar: </b> ${metaXRecord.subject} </br>`
                    +
                    // `<b>x-variable name: </b> ${metaXRecord.variable} </br>` +
                    `<b>x: </b> ${metaYRecord.value} </br>` 
                    +
                    // `<b>y-variable name: </b> ${metaYRecord.variable} </br>` +
                    `<b>y: </b> ${metaYRecord.value} </br>` 
                    +
                    `<b>Location: </b> ${metaYRecord.Location ? metaYRecord.Location : 'None'} </br>` 
                    +
                    `<b>Tissue: </b> ${metaYRecord.Tissue ? metaYRecord.Tissue : 'None'} </br>` 
                    +
                    `<b>Treatment: </b> ${metaYRecord.Treatment ? metaYRecord.Treatment : 'None'} </br>`
                    +
                    `<b>Provider: </b> ${metaYRecord.Institute ? metaYRecord.Institute : 'None'} </br>` 
                    +
                    `<b>Study ID: </b> ${metaYRecord.study_identifier ? metaYRecord.study_identifier : 'None'} </br>` 
                    +
                    `<b>Sample ID: </b> ${metaYRecord.sample_identifier ? metaYRecord.sample_identifier : 'None'} </br>` 
        });
        
        var plotData = [
            {
                type: "scattergl",
                mode: "markers",
                x: x,
                y: y,
                text: textData,
                hoverinfo: 'text',
                hovertemplate: '%{text}<br><extra></extra>',
                showlegend: true,
                name : uniqueLabels,
                marker: {
                    color: markerColors
                },
                showlegend: false
            }
        ];

        var plotLayout = primaryLayout;
        plotLayout["xaxis"] = {};
        plotLayout["yaxis"] = {};
        plotLayout.xaxis["title"] = xLable || selectedVars[0];
        plotLayout.yaxis["title"] = yLable || selectedVars[1];
        plotLayout.annotations = {};
        }
    } else if (plotType == "box") {
        if(divider){

            // var divider_levels = Object.keys(tracesData[Object.keys(tracesData)[0]])
            var traces = []
            var x_var = []
            var c = 0
            Object.keys(tracesData).map(key => {
                var trait_data = tracesData[key]
                var y = []
                Object.keys(trait_data).map(key1 => {
                    if(c < 1){
                        x_var.push(...Array(Object.keys(trait_data[key1]).length).fill(key1))
                    }
                    y.push(...Object.values(trait_data[key1]))
                })
                c = c + 1
                traces.push({
                    x: x_var,
                    y : y,
                    name: key,
                    marker: {color: DEFAULT_PLOTLY_COLORS[c]},
                    type: 'box'
                })
            })
            var plotData = traces
            var plotLayout = primaryLayout;
            plotLayout["xaxis"] = {};
            plotLayout["yaxis"] = {};
            plotLayout.annotations = {};
            plotLayout["boxmode"] = 'group'
            plotLayout["title"] =  plotTitle || "add plot title";
            plotLayout.yaxis["title"] = yLable || "add label to y axis";
            plotLayout.xaxis["title"] = xLable || "add label to x axis";


        }else{
            // Group data by variable
            const groupedData = {};
            inputData.forEach(item => {
              if (!groupedData[item.variable]) {
                groupedData[item.variable] = [];
              }
              groupedData[item.variable].push(parseFloat(item.value));
            });
        
            // Prepare the data for Plotly
            var plotData = Object.keys(groupedData).map(variable => {
              return {
                y: groupedData[variable],
                type: 'box',
                name: variable
              };
            });

        var plotLayout = primaryLayout;
        plotLayout["xaxis"] = 
    //     { 
    //         showticklabels: true,
    //         autotick: false,
    //         tickangle: 'auto',
    //         ticks: 'outside', 
    //         tick0: 0,
    //         dtick: 0.25,
    //         ticklen: 8,
    //         tickwidth: 4,
    // } //
        {showticklabels: false, showline:false};
        plotLayout.showlegend = true;
        // plotLayout.width = 1400
        plotLayout["yaxis"] = {};
        plotLayout.annotations = {};
        // plotLayout["boxmode"] = 'group'
        plotLayout["title"] =  plotTitle || "add plot title";
        plotLayout.yaxis["title"] = yLable || "add label to y axis";
        plotLayout.xaxis["title"] = xLable || "add label to x axis";
    }
    } else if (plotType == "density_overlay") {
        var input_Obj = {};
        selectedVars.map((key) => {
        var Y = [];
        input_Obj[key] = { x: Y,
        type: 'violin',
        side: 'positive',
        opacity: 0.5,
            y0 : ' ',
        name: key,
        };
        });
        for (let i = 0; i < inputData.length; i++) {
        var obj = inputData[i];
        selectedVars.map((key) => {
            input_Obj[key].x.push(obj[key]);
            input_Obj[key]["hovertemplate"] = `<b>${obj.Accessions}</b><br> <i>y</i>: %{y:.2f}<br><extra></extra>`
        });
        }
        var plotData = Object.values(input_Obj);
        var plotLayout = primaryLayout;
        plotLayout["xaxis"] =
    {showticklabels: false, showline:false};

        plotLayout["yaxis"] = {};
        plotLayout.xaxis["title"] = xLable || 'add label to x axis';
        // plotLayout.xaxis.title["standoff"] = 40;
        plotLayout.yaxis["title"] = yLable || 'add label to y axis';
        plotLayout.showlegend = true;
        plotLayout.annotations = {};
        plotLayout.width = 800;
        plotLayout.height = 600




    } else if (plotType == "violin") {

        if(divider){
            const varsToPlot = Object.keys(tracesData)
            if(varsToPlot.length <= 2){
                const divider_levels = Object.keys(tracesData[varsToPlot[0]])       
                var plotData = [];
                var color_idx = 0;
                
                // Use forEach instead of map since we are not using the returned array
                divider_levels.forEach(divider => {
                    var X_data = [];
                    var Y_data = [];
                    
                    Object.keys(tracesData).forEach(key => {
                       
                        const y_data = Object.values(tracesData[key][divider]);
                        
                        Y_data.push(...y_data);
                        
                        // Fill X_data for each value in y_data
                        const arr = Array(y_data.length).fill(key);
                        X_data.push(...arr);
                    });
                    
                    var trace = {
                        type: 'violin',
                        x: X_data,
                        y: Y_data,
                        legendgroup: divider,
                        scalegroup: divider,
                        name: divider,
                        box: {
                            visible: true
                        },
                        line: {
                            color: DEFAULT_PLOTLY_COLORS[color_idx],
                            width: 2
                        },
                        meanline: {
                            visible: true
                        }
                    };
                    
                    color_idx++;
                    plotData.push(trace);
                });
                
        
                var plotLayout = primaryLayout;
                plotLayout["xaxis"] = {zeroline : false};
                plotLayout["yaxis"] = {
                    zeroline: false
                  },
                plotLayout.xaxis["title"] =  xLable || "add label to x axis";
                plotLayout.yaxis["title"] = yLable || "add label to y axis";
                plotLayout.showlegend = true;
                plotLayout.annotations = {};
                plotLayout["violinmode"] = 'group'
        
        
            }else{
const divider_levels = Object.keys(tracesData[varsToPlot[0]]);


var plotData = [];
var color_idx = 0;

// Use forEach instead of map since we are not using the returned array
divider_levels.forEach(divider => {
    var X_data = [];
    var Y_data = [];
    
    Object.keys(tracesData).forEach(key => {
        const y_data = Object.values(tracesData[key][divider]);
        Y_data.push(...y_data);
        // Fill X_data for each value in y_data
        const arr = Array(y_data.length).fill(key);
        X_data.push(...arr);
    });
    
    var trace = {
        type: 'violin',
        y: X_data,  // Swap x and y for horizontal orientation
        x: Y_data,  // Swap x and y for horizontal orientation
        legendgroup: divider,
        scalegroup: divider,
        name: divider,
        box: {
            visible: true
        },
        line: {
            color: DEFAULT_PLOTLY_COLORS[color_idx],
            width: 2
        },
        meanline: {
            visible: true
        },
        orientation: 'h'  // Set orientation to horizontal
    };
    
    color_idx++;
    plotData.push(trace);
});

var plotLayout = primaryLayout;
plotLayout["xaxis"] = {zeroline: false, title: yLable || "add label to y axis"};  // Update axis titles
plotLayout["yaxis"] = {zeroline: false, title: xLable || "add label to x axis"};  // Update axis titles
plotLayout.showlegend = true;
plotLayout.annotations = {};
plotLayout["violinmode"] = 'group';
            }
        }else{
            const groupedData = {};
    inputData.forEach(item => {
      if (!groupedData[item.variable]) {
        groupedData[item.variable] = [];
      }
      groupedData[item.variable].push(parseFloat(item.value));
    });

    // Prepare the data for Plotly
    var plotData = Object.keys(groupedData).map(variable => {
      return {
        y: groupedData[variable],
        type: 'violin',
        name: variable,
        box: {
          visible: true
        },
        meanline: {
          visible: true
        }
      };
    });

    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = {zeroline : false};
    plotLayout["yaxis"] = {
        zeroline: false
      },
    plotLayout.xaxis["title"] =  xLable || "add label to x axis";
    plotLayout.yaxis["title"] = yLable || "add label to y axis";
    plotLayout.showlegend = true;
    plotLayout.annotations = {};

        }

    } else if (plotType == "raincloud") {
        // var plotLayout = primaryLayout;
        // var input_Obj = {};
        // var cnt = 0;
        // var N = selectedVars.length;
        // var chunk = 1 / N;
        // var a = 0;
        // var b = chunk;
        // selectedVars.map((key) => {
        // var Y = [];
        // var y_axis;
        // if (cnt == 0) {
        //     y_axis = "yaxis";
        //     a = b;
        //     b = b + chunk;
        // } else if (cnt == 1) {
        //     y_axis = "yaxis2";
        //     plotLayout[y_axis] = [];
        //     plotLayout[y_axis]["domain"] = [a, b];
        //     a = b;
        //     b = b + chunk;
        // } else {
        //     y_axis = `yaxis${cnt + 1}`;
        //     plotLayout[y_axis] = [];
        //     plotLayout[y_axis]["domain"] = [a, b];
        //     a = b;
        //     b = b + chunk;
        // }
        // input_Obj[key] = [
        //     {
        //     x: Y,
        //     name: key,
        //     yaxis: y_axis,
        //     type: "violin",
        //     side: "positive",
        //     hoverinfo: "x", // Specify hover information
        //     line: { width: 0.75 }, //color : 'green',
        //     jitter : 1,
        //     hoveron: "violins+points+kde",

        //     },
        //     {
        //     x: Y,
        //     name: key,
        //     showlegend: false,
        //     type: "box",
        //     opacity: 0.4,
        //     // points : "all",
        //     boxpoints: "all",
        //     hoveron: "violins+points+kde",

        //     jitter: 1,
        //     whiskerwidth: 0.3,
        //     width: 0.15,
        //     fillcolor: "orange",
        //     yaxis: y_axis,
        //     boxmean: "sd",
        //     marker: {
        //         color: "green",
        //         opacity: 1,
        //         size: 4,
        //         outliercolor: "red",
        //         Symbol: "diamond",
        //     },
        //     line: { color: "red", width: 2 },
        //     },
            
        // ];
        // cnt = cnt + 1;
        // });
        // for (let i = 0; i < inputData.length; i++) {
        // var obj = inputData[i];
        // selectedVars.map((key) => {
        //     input_Obj[key][0].x.push(obj[key]);
        //     input_Obj[key][1]["hovertemplate"] = `<b>Accession: </b>${obj.Accessions}<br> <b>value:</b>${obj[key]} <extra></extra>`;

        // });
        // }
        // var plotData = [];
        // Object.values(input_Obj).map((item) => {
        // item.map((trace) => {
        //     plotData.push(trace);
        // });
        // });

        // plotLayout["xaxis"] = {};
        // plotLayout["yaxis"] = { showticklabels: false, showline:false };
        // plotLayout.xaxis["title"] = xLable || "add label to x axis";
        // plotLayout.yaxis["title"] = yLable || "add label to y axis";
        // plotLayout.showlegend = true;
        // plotLayout.annotations = {};
        if(divider){
            const varsToPlot = Object.keys(tracesData);
            const divider_levels = Object.keys(tracesData[varsToPlot[0]]);
    
            var plotData = [];
            var color_idx = 0;
    
    // Use forEach instead of map since we are not using the returned array
    divider_levels.forEach(divider => {
        var X_data = [];
        var Y_data = [];
        Object.keys(tracesData).forEach(key => {
            const y_data = Object.values(tracesData[key][divider]);
            Y_data.push(...y_data);
            // Fill X_data for each value in y_data
            const arr = Array(y_data.length).fill(key);
            X_data.push(...arr);
        });
        
        var violin_trace = {
            type: 'violin',
            y: X_data,  // Swap x and y for horizontal orientation
            x: Y_data,  // Swap x and y for horizontal orientation
            legendgroup: divider,
            scalegroup: divider,
            name: divider,
            box: {
                visible: true
            },
            line: {
                color: DEFAULT_PLOTLY_COLORS[color_idx],
                width: 2
            },
            meanline: {
                visible: true
            },
            side: "positive",
            hoverinfo: "y",
            jitter: 1,
            hoveron: "violins+points+kde",
            orientation: 'h'  // Set orientation to horizontal
        };
    
        var box_trace = {
            type: 'box',
            y: X_data,  // Swap x and y for horizontal orientation
            x: Y_data,  // Swap x and y for horizontal orientation
            name: divider,
            showlegend: false,
            opacity: 0.4,
            boxpoints: "all",
            jitter: 1,
            whiskerwidth: 0.3,
            width: 0.15,
            fillcolor: "orange",
            yaxis: 'y',
            boxmean: "sd",
            marker: {
                color: DEFAULT_PLOTLY_COLORS[color_idx],
                opacity: 1,
                size: 4,
                outliercolor: "red",
                symbol: "diamond",
            },
            line: {
                color: "red",
                width: 2
            },
            hovertemplate: `<b>Divider: </b>${divider}<br><b>Value:</b> %{x}<extra></extra>`,  // Update hovertemplate for horizontal plot
            orientation: 'h'  // Set orientation to horizontal
        };
        
        color_idx++;
        plotData.push(violin_trace, box_trace);
    });
    
    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = {zeroline: false, title: yLable || "add label to y axis"};  // Update axis titles
    plotLayout["yaxis"] = {title: xLable || "add label to x axis"};  // Update axis titles
    plotLayout.showlegend = true;
    plotLayout.annotations = {};
    plotLayout["violinmode"] = 'group';
    
    
        }else{
    const groupDataByVariable = (data) => {
        const groupedData = {};
        data.forEach(item => {
          if (!groupedData[item.variable]) {
            groupedData[item.variable] = [];
          }
          groupedData[item.variable].push(parseFloat(item.value));
        });
        return groupedData;
      };
      var groupedData = groupDataByVariable(inputData)
      var plotData = Object.keys(groupedData).map((variable, index) => {
        const color = DEFAULT_PLOTLY_COLORS[index]; 
        return {
          x: groupedData[variable], // Use x instead of y for horizontal orientation
          type: 'violin',
          name: variable,
          box: {
            visible: true,
            width: 0.5, // Adjust box width as needed
            fillcolor: color // Set box fill color
          },
          meanline: {
            visible: true,
            width: 1, // Adjust mean line width as needed
            color: color // Set mean line color
          },
          line: {
            color: color, // Set violin outline color
            width: 2 // Adjust violin outline width as needed
          },
          points: 'all',
          pointpos: -1, // Show points below the violin
          boxpoints: 'outliers', // Display outliers
          jitter: 0.7, // Adjust jitter value as needed
          side: 'positive', // Show only the negative side of the violin
          orientation: 'h', // Set orientation to horizontal
          scalemode: 'width' // Scale violins by width
        };
      });
    
      // Plot layout configuration
      var plotLayout = {
        ...primaryLayout,
        xaxis: {
          zeroline: false,
          title: xLable || 'Add label to x axis'
        },
        yaxis: {
          zeroline: false,
          title: yLable || 'Add label to y axis',
          showticklabels : false
        },
        showlegend: true,
        annotations: {}
      };


        }
    } else if (plotType == "linear regression") {
        var x = []
        var y = []

        let firstVariable = null;
        let secondVariable = null;

        inputData.forEach(record => {
            if (firstVariable === null) {
            firstVariable = record.variable;
            } else if (secondVariable === null && record.variable !== firstVariable) {
            secondVariable = record.variable;
            }


        
            if (record.variable === firstVariable) {
            x.push(parseFloat(record.value));
            } else if (record.variable === secondVariable) {
            y.push(parseFloat(record.value));
            }
        });

        if(y.length == 0){
            // Fix if the user selects the same variable twice, this will still render the plot
            y=x
        }

        const validIndices = [];
        for (let i = 0; i < x.length; i++) {
        if (isNumber(x[i]) && isNumber(y[i])) {
            validIndices.push(i);
        }
        }


        x = validIndices.map(i => x[i]);
        y = validIndices.map(i => y[i]);

        var regLineData = linReg(x, y);
        var xAnnotPos = Math.min(...x) 
        var yAnnotPos = Math.max(...y) 

        if(xAnnotPos <= 1){
            xAnnotPos = xAnnotPos + 0.15
            // yAnnotPos = yAnnotPos - 0.01
            
        }
        // console.log('x', xAnnotPos, 'y', yAnnotPos)
        var plotData = [
        { type: "scattergl", 
        mode: "markers",
        x: x, 
        y: y,   
        // text: [`R\u00B2: ${regLineData.text}`], 
        // textposition: 'bottom right', 
        // textfont: {
        //     family: 'sans serif',
        //     size: 18,
        //     color: 'blue'
        //   }, 
        text : accessions , 
        hovertemplate: '<b>%{text}</b><br>' + '<b><i>y</i></b>: %{y:.2f}' + '<br><b>X</b>: %{x}<br><extra></extra>',
        showlegend: false
        },
        regLineData,
        ];
        var plotLayout = primaryLayout;
        plotLayout["xaxis"] = {zeroline: true};
        plotLayout["yaxis"] = {zeroline: true},
        plotLayout.xaxis["title"] = xLable || x;
        plotLayout.yaxis["title"] = yLable || y;
        plotLayout.showlegend = false;
        plotLayout.annotations = 
        [{
            x: xAnnotPos,
            y: yAnnotPos,
            xref: 'x',
            yref: 'y',
            text: `R\u00B2: ${regLineData.text}`,
            showarrow: false,
            // ax: 10,
        //   ay: -40
            font: {
                family: 'sans serif',
                size: 18,
                color: 'blue'
            }, 
            bordercoloheatMapr: 'black', //'#c7c7c7',
        borderwidth: 1,
        borderpad: 4,
        bgcolor: 'lightyellow',
        opacity: 0.8
            }]
    } else if (plotType == "heatmap") {
        var heatMapData =  createHeatmapTrace(selectedVars, inputData)
        var xValues = heatMapData.x;
        var yValues = heatMapData.y;
        var zValues = heatMapData.z;

        var colorscaleValue = [
        [0, '#3D9970'],
        [1, '#001f3f']
        ];
        var data = [{
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'heatmap',
        colorscale: colorscaleValue,
        showscale: true,
            coloraxis: 'coloraxis'
        }];
        var layout = {
        annotations: [],
        title : plotTitle,
        xaxis: {
            ticks: '',
            side: 'bottom',
            automargin: true,
            title : xLable || x
        },
        yaxis: {
            ticks: '',
            ticksuffix: ' ',
            automargin: true,
            title : yLable || y,
        width: 700,
        height: 700,
        autosize: false,
            side: 'right'


        },
            coloraxis: {
            colorbar: {
            x: -0.1, // Adjust the x position (0.5 means centered horizontally)
            y: 1, // Adjust the y position (1.15 means above the plot)
            xanchor: 'center',
            yanchor: 'top',
            },
        },

            margin : {1:200}
        };
        for ( var i = 0; i < yValues.length; i++ ) {
        for ( var j = 0; j < xValues.length; j++ ) {
            var currentValue = zValues[i][j];
            if (currentValue != 0.0) {
            var textColor = 'white';
            }else{
            var textColor = 'black';
            }
            var result = {
            xref: 'x1',
            yref: 'y1',
            x: xValues[j],
            y: yValues[i],
            text: zValues[i][j],
            font: {
                family: 'Arial',
                size: 12,
                color: 'rgb(50, 171, 96)'
            },
            showarrow: false,
            font: {
                color: textColor
            }
            };
            layout.annotations.push(result);
        }
        }
        var plotLayout = layout;

        var plotData = data;
        plotLayout.height = 1000
        plotLayout.width = 1000

    } else if (plotType == "mds") {
        var traces = [];
        var clusterLegends = new Set(); // To keep track of unique cluster legends
        var maxX = 0;
        var maxY = 0;
        var indicesToHide = [];
        var originCountries = [];

        inputData.forEach((obj, index) => {
        if (obj.FID && obj.C1 && obj.C2 && obj.SOL && obj.IID) {
            if (obj.C1 > maxX) {
            maxX = obj.C1;
            }

            if (obj.C2 > maxY) {
            maxY = obj.C2;
            }

            var trace = {
            type: "scattergl",
            mode: "markers",
            x: [obj.C1], // Single data point x-coordinate
            y: [obj.C2], // Single data point y-coordinate
            // text: `Sample: ${obj.IID} <br>Cluster: ${obj.ORIGIN}`,
            hovertemplate: `Sample ID: ${obj.IID} <br>Cluster  ID: \t${obj.SOL}`,
            marker: {
                color: DEFAULT_PLOTLY_COLORS[obj.SOL],
                size: 10, // Adjust the marker size as needed
            },
            name: `Cluster ${obj.SOL}`,
            SampleID: `${obj.IID}`,
            };

            if (trace.x.length > 0 && trace.y.length > 0) {
            traces.push(trace);
            clusterLegends.add(`Cluster ${obj.SOL}`);
            }
        }
        if (!originCountries.includes(obj.SOL)) {
            originCountries.push(obj.SOL);
        } else {
            indicesToHide.push(index);
        }
        });

        var plotData = traces;

        var plotLayout = primaryLayout;
        plotLayout['width'] = 800,
        plotLayout['height'] = 800,
        plotLayout["xaxis"] = {};
        plotLayout["yaxis"] = {};
        plotLayout.xaxis["title"] = xLable || x;
        plotLayout.yaxis["title"] = yLable || y;
        // plotLayout.xaxis['range'] = [0, maxX + 0.1]; // Adjust the range as needed
        // plotLayout.yaxis['range'] = [0, maxY + 0.1]; // Adjust the range as needed
        // plotLayout.xaxis['range'] = [-maxX -0.2, maxX + 0.2 ]; // Adjust the range as needed
        // plotLayout.yaxis['range'] = [-maxY -0.2, maxY + 0.2 ]; // Adjust the range as needed

        plotLayout.showlegend = true; // Hide the default legend
        plotLayout["annotations"] = {};

        // Add a marker text annotation for each data point
        var markerTextAnnotations = traces.map((trace) => ({
        x: trace.x[0],
        y: trace.y[0],
        text: trace.SampleID, // Display IID as marker text
        xref: "x",
        yref: "y",
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -10, // Adjust the position of the marker text
        }));

        // legend annotations

        plotLayout.annotations = markerTextAnnotations;

        plotLayout["legend"] = {};
        plotLayout.legend["traceorder"] = "normal"; // Preserve the order of other legend items
        plotLayout.legend["title"] = { text: "IBS clusters" };

        traces.forEach((trace, index) => {
        if (indicesToHide.includes(index)) {
            trace.showlegend = false;
        }
        });
    } else if (plotType == "pca") {
        var c = 0
        var traces = [];
        var clusterLegends = new Set(); // To keep track of unique cluster legends
        var maxX = 0;
        var maxY = 0;
        var indicesToHide = [];
        var originCountries = [];
        var COV1 = selectedVars[0]
        var COV2 = selectedVars[1]


        inputData.forEach((obj, index) => {
        if (obj.COV1 && obj.COV2 && obj.FID && obj.IID) {

            if (COV1 > maxX) {
            maxX = COV1;
            }

            if (COV2 > maxY) {
            maxY = COV2;
            }

            var trace = {
            type: "scattergl",
            mode: "markers",
            x: [obj.COV1], // Single data point x-coordinate
            y: [obj.COV2], // Single data point y-coordinate
            // text: `Sample: ${obj.IID} <br>Cluster: ${obj.ORIGIN}`,
            hovertemplate: `Sample: ${obj.IID} <br>Origin: ${obj.ORIGIN}<extra></extra>`,
            marker: {
                color: DEFAULT_PLOTLY_COLORS[obj.ORIGIN_ID],
                size: 10, // Adjust the marker size as needed
            },
            name: `${obj.ORIGIN}`,
            sampleID: `${obj.IID}`, // we can add as many attributes as we want to map different variables
            };

            c = c +1

            traces.push(trace);
            clusterLegends.add(`${obj.ORIGIN}`);

            if (!originCountries.includes(obj.ORIGIN)) {
                originCountries.push(obj.ORIGIN);
            } else {
                indicesToHide.push(index);
            }
        }
        });

        var plotData = traces;

        var plotLayout = primaryLayout;
        // plotLayout['width'] = 650,
        plotLayout['height'] = 750,
        plotLayout.xaxis.title = xLable || x;
        plotLayout.yaxis.title = yLable || y;
        // plotLayout.xaxis['range'] = [0, maxX + 0.1]; // Adjust the range as needed
        // plotLayout.yaxis['range'] = [0, maxY + 0.1]; // Adjust the range as needed
        // plotLayout.xaxis['range'] = [-maxX, maxX]; // Adjust the range as needed
        // plotLayout.yaxis['range'] = [-maxY, maxY ]; // Adjust the range as needed

        plotLayout.showlegend = true; // Hide the default legend
        plotLayout["annotations"] = {};

        // Add a marker text annotation for each data point
        var markerTextAnnotations = traces.map((trace) => ({
        x: trace.x[0],
        y: trace.y[0],
        text: trace.sampleID, // Display IID as marker text
        xref: "x",
        yref: "y",
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -10, // Adjust the position of the marker text
        }));

        // legend annotations

        plotLayout.annotations = markerTextAnnotations;

        plotLayout["legend"] = {};
        plotLayout.legend["traceorder"] = "normal"; // Preserve the order of other legend items
        plotLayout.legend["title"] = { text: "Geographic origin" };

        traces.forEach((trace, index) => {
        if (indicesToHide.includes(index)) {
            trace.showlegend = false;
        }
        });
    } else if (plotType == "qqplot") {

        const expectedQuantiles = inputData.map(item => {return item.expectedQuantiles})
        const sortedPValues = inputData.map(item => {return item.sortedPValues})

        var plotData = [
        { type: "scattergl", mode: "markers", x: expectedQuantiles, y: sortedPValues },
        { x: sortedPValues, y: sortedPValues, mode: "line", color: "grey" },
        ];

        var plotLayout = primaryLayout;
        plotLayout["xaxis"] = {};
        plotLayout["yaxis"] = {};
        plotLayout.xaxis["title"] = xLable;
        plotLayout.yaxis["title"] = yLable;
        plotLayout.showlegend = false;
        plotLayout.width = 600;
        plotLayout.height = 600;
        plotLayout.annotations = {};
    } else {
        console.log("Please choose a valid plot type");
    }
    setPlotData(plotData);
    setPlotLayout(plotLayout);
};

// return <div id="plot-container"><Plot sx={{ p: 10, m: 1 }} data={plotData} layout={plotLayout}  
// config={{ 'displaylogo': false, modeBarButtonsToRemove: ['toImage', 'zoom2d', 'toggleSpikelines','hoverClosestCartesian','hoverCompareCartesian', 'select2d', 'pan2d', 'autoScale2d', 'lasso2d'] }} /></div>

return <>

<div style={{ position: 'relative' }}> 
<SwipeableViews // AutoPlaySwipeableViews is also imported
    index={index}
    onChangeIndex={handleChangeIndex}
    enableMouseEvents 
    style={{ height: '600px' }} 
>
<div style={{ padding: 16, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>        
    <BarPlot
            plotType="bar"
            inputData={inputData}
            selectedVars={selectedVars}
            plotTitle={plotTitle}
            xLable={xLable}
            yLable={yLable}
            isDark={false}
            textColor="#000000"
            divider={divider}
            plotSize={plotSize}
        />
    </div>
<div style={{ padding: 16, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>        <BoxPlot
            plotType="box"
            inputData={inputData}
            selectedVars={selectedVars}
            plotTitle={plotTitle}
            xLable={divider}
            yLable={selectedVars[0]}
            isDark={false}
            textColor="#000000"
            divider={divider}
            plotSize={50}
        />
    </div>
    <div style={{ padding: 16, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>        <LinePlot
            plotType="line"
            inputData={inputData}
            selectedVars={selectedVars}
            plotTitle={plotTitle}
            xLable="Accessions"
            yLable={selectedVars[0]}
            isDark={false}
            textColor="#000000"
            divider={divider}
            plotSize={50}
        />
    </div>
    <div style={{ padding: 16, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>        <HistogramPlot
            plotType="histogram"
            inputData={inputData}
            selectedVars={selectedVars}
            plotTitle={plotTitle}
            xLable={selectedVars[0]}
            yLable="Counts"
            isDark={false}
            textColor="#000000"
            divider={divider}
            plotSize={50}
        />
    </div>
</SwipeableViews>




{/* for the navigation with arrows */}
<IconButton
                onClick={handlePrev}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',  // Adjust position as needed
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                    color: 'white',
                    zIndex: 1, // Ensure it's on top
                }}
            >
                <ArrowBackIosIcon />
            </IconButton>

            <IconButton
                onClick={handleNext}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px', // Adjust position as needed
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    zIndex: 1,
                }}
            >
                <ArrowForwardIosIcon />
            </IconButton>

            </div>

{/* Optional: Navigation controls (dots or buttons) */}
<div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
    {Array.from(Array(4)).map((_, i) => ( // Assuming 4 plots
        <div
            key={i}
            style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: i === index ? 'blue' : 'gray',
                margin: '0 4px',
                cursor: 'pointer',
            }}
            onClick={() => handleChangeIndex(i)}
        />
    ))}
</div>


</>


};

export default PlotlyPlots;

