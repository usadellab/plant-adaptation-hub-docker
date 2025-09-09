// contexts/AppDataContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context with a default value (initial state)
const AppDataContext = createContext();

// Create a context provider component
export const AppDataContextProvider = ({ children }) => {
const [pcaData, setPCAData] = useState(null);
const [plinkResults, setPlinkResults] = useState([]);
  const [manhattanPlotData, setManhattanPlotData] = useState(null);

  const [startGWAS, setStartGwas] = useState(false);
  const [startMDS, setStartMDS] = useState(false);
  const [isGwasDone, setIsGwasDone] = useState(false);
  const [qqData, setQqData] = useState(null);
  const [qqIsDone, setQQisDone] = useState(false);
  const [manhattanIsDone, setManhattanIsDone] = useState(false);
  const [plinkGenes, setPlinkGenes] = useState([]);
  const [pValThreshold, setPValThreshold] = useState("10\u207B\u2078");
  const [annotationsDone, setAnnotationsDone] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [updateAnnotations, setUpdateAnnotations] = useState(false);
  const [chosenFile, setChosenFile] = useState("");
  const [inputFiles, setInputFiles] = useState([]);
  const [isToggled, setPlotIsToggled] = useState(false);
  const [mdsData, setMdsData] = useState(null);
  const [hweData, setHWEData] = useState([])
  const [showGenomeView, setShowGenomeView] = useState(false);
  const [gbPosition, setGbPosition] = useState(0);
  const [selectedAnnotationsWindowOption, setSelectedAnnotationsWindowOption] = useState("1 kb");



  const [hwePlotData, setHWEplotData] = useState([])
  const [hweIsDone, setHWEisDone] = useState(false)
  const [showHWEplot, setShowHWEplot] = useState(false)
  const [startSummarize, setStartSummarize] = useState(false);
  const [chromosomeData, setChromosomeData] = useState([])

  const [phenotypeStudies, setPhenotypeStudies] = useState([]);
  const [selectedPhenotypeStudy, setSelectedPhenotypeStudy] = useState("");
  const [phenotypeStudyMetaData, setPhenotypeStudyMetaData] = useState(null);
  const [phenotypeSelectedStudyAssays, setPhenotypeSelectedStudyAssays] = useState([]);
  const [phenotypeSelectedStudySelectedAssays, setPhenotypeSelectedStudySelectedAssays] = useState([]);
  const [phenotypeSelectedStudySelectedAssaysPhenotypes, setPhenotypeSelectedStudySelectedAssaysPhenotypes] = useState([]);
  const [phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype, setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype] = useState(null);
  const [variablesToPlot, setVariablesToPlot] = useState([]);
  const [phenotypeData, setPhenotypeData] = useState([]);
  const [selected_plot_type, setSelectedPlotType] = useState("");
  const [assayIds, setAssayIds] = useState([]);
  const [expFactors, setExpFactors] = useState(null);
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [divider, setDivider] = useState(null);
  const [counter, setCounter] = useState(0);
  const [assayDataForMap, setAssayDataForMap] = useState([]);
  const [locationDataForMap, setLoctaionDataForMap] = useState([]);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [k, setK] = useState(2);


  const contextValue = {
    pcaData,setPCAData,
    plinkResults,setPlinkResults,
    manhattanIsDone, setManhattanIsDone,
    manhattanPlotData, setManhattanPlotData,
    isGwasDone, setIsGwasDone,
    plinkGenes, setPlinkGenes,
    pValThreshold, setPValThreshold,
    annotationsDone, setAnnotationsDone,
    activeTab, setActiveTab,
    updateAnnotations, setUpdateAnnotations,
    showGenomeView, setShowGenomeView,
    gbPosition, setGbPosition,
    selectedAnnotationsWindowOption, setSelectedAnnotationsWindowOption,
    startGWAS, setStartGwas,
    startMDS, setStartMDS,
    qqData, setQqData,
    qqIsDone, setQQisDone,
    chosenFile, setChosenFile,
    inputFiles, setInputFiles,
    isToggled, setPlotIsToggled,
    mdsData, setMdsData,
    hweData, setHWEData,
    hwePlotData, setHWEplotData,
    hweIsDone, setHWEisDone,
    showHWEplot, setShowHWEplot,
    startSummarize, setStartSummarize,
    chromosomeData, setChromosomeData,
    phenotypeStudies, setPhenotypeStudies,
    selectedPhenotypeStudy, setSelectedPhenotypeStudy,
    phenotypeStudyMetaData, setPhenotypeStudyMetaData,
    phenotypeSelectedStudyAssays, setPhenotypeSelectedStudyAssays,
    phenotypeSelectedStudySelectedAssays, setPhenotypeSelectedStudySelectedAssays,
    phenotypeSelectedStudySelectedAssaysPhenotypes, setPhenotypeSelectedStudySelectedAssaysPhenotypes,
    phenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype, setPhenotypeSelectedStudySelectedAssaysPhenotypesSelectedPhenotype,
    variablesToPlot, setVariablesToPlot,
    phenotypeData, setPhenotypeData,
    selected_plot_type, setSelectedPlotType,
    assayIds, setAssayIds,
    expFactors, setExpFactors,
    selectedFactor, setSelectedFactor,
    divider, setDivider,
    counter, setCounter,
    assayDataForMap, setAssayDataForMap,
    locationDataForMap, setLoctaionDataForMap,
    selectedFactors, setSelectedFactors,
    k, setK
  };

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>;
};

// Custom hook to consume the context
export const useAppDataContext = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppDataContext must be used within an AppDataContextProvider');
  }
  return context;
};

