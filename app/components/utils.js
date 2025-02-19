export function  linReg(x,y){
    var xArray = []
    var yArray = []
    var x_,y_;
    var xSum = 0;
    var ySum = 0;
    var xxSum = 0;
    var xySum = 0;
    var yySum = 0
    var r2;
    for (var i = 0; i < x.length-1; i ++) {
        x_ = parseFloat(x[i]);
        y_ = parseFloat(y[i]);
        xSum += x_
        ySum += y_
        xArray.push(x_);
        yArray.push(y_);
        xxSum += x_ * x_;
        xySum += x_ * y_;
        yySum += y_ * y_;
    }
    var count = xArray.length;
    var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
    var intercept = (ySum / count) - (slope * xSum) / count;
    // Generate values
    var xMax = Math.max(...xArray);
    var xMin = Math.min(...xArray);

    var xValues = [];
    var yValues = [];

    var increment = xMax/xArray.length;
    // if(xMax >= 1){
    //     increment = 0.5
    // }else{
    //     increment = 1
    // }

    for (var x = xMin; x <= xMax; x += increment) {
    xValues.push(x);
    yValues.push(x * slope + intercept);
    }
    r2 = (Math.pow((count*xySum - xSum*ySum)/Math.sqrt((count*xxSum-xSum*xSum)*(count*yySum-ySum*ySum)),2)).toFixed(3);

    if(isNaN(r2)){
        return {x:null, y:null, mode:"text" , text: `Regression cannot be performed. Too many missing values`, } 

    }else{
        return {x:xValues, y:yValues, type : 'scatter', mode:"lines" ,//mode:"lines+text" ,
         text: `${r2} <br> y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)} `, 
         xMin : xMin,
         xMax : xMax,
         
        //  textposition: 'top right', textfont: {
        //     family: 'sans serif',
        //     size: 18,
        //     color: 'blue'
        //   }, 

    }
}

}

// Function to check if a value is a float or an integer
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}


function manhattanDistanceBetweenKeys(objects) {
  // Initialize an empty result array to store distances
  const distances = [];

  // Iterate through each pair of objects
  for (let i = 0; i < objects.length; i++) {
    const obj1 = objects[i];

    for (let j = i + 1; j < objects.length; j++) {
      const obj2 = objects[j];

      // Initialize the distance array for this pair of objects
      const distanceArray = [];

      // Calculate Manhattan distance between all keys in obj1 and obj2
      for (const key1 in obj1) {
        for (const key2 in obj2) {
          // Calculate the absolute difference between values for each key
          const value1 = obj1[key1];
          const value2 = obj2[key2];
          const keyDistance = Math.abs(value1 - value2);

          // Add the distance to the distance array
          distanceArray.push(keyDistance);
        }
      }

      // Store the distance array for this pair of objects
      distances.push(distanceArray);
    }
  }

  return distances;
}

export function createHeatmapTrace(selectedVars, inputData) {
  // Calculate the Manhattan distances only among the selected variables
  const distances = [];
  
  for (let i = 0; i < selectedVars.length; i++) {
    const row = [];
    for (let j = 0; j < selectedVars.length; j++) {
      const var1 = selectedVars[i];
      const var2 = selectedVars[j];
      let distance = 0;
      
      for (let k = 0; k < inputData.length; k++) {
        const obj = inputData[k];
        distance += Math.abs(obj[var1] - obj[var2]);
      }
      
      row.push(distance.toFixed(2));
    }
    distances.push(row);
  }

  // Create annotations for the heatmap
  const annotationText = selectedVars.map(variable => ({
    x: variable,
    y: variable,
    text: variable,
    showarrow: false,
  }));

  // Create the heatmap trace
  const heatmapTrace = {
    x: selectedVars,
    y: selectedVars,
    z: distances,
    type: 'heatmap',
    colorscale: 'Viridis',
    showscale: true,
    colorbar: {
      title: 'Distance',
      titleside: 'right',
    },
    annotations: annotationText,
  };

  return heatmapTrace;
}

export function capitalizeFirstLetter(string) {
  if (typeof string !== 'string' || string.length === 0) {
    return ''; // handle undefined or empty string
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generatePlinkFam(data) {
  // Aggregate data by subject and calculate the mean value
  const subjectData = {};

  data.forEach(entry => {
    // Filter out invalid values
    const value = parseFloat(entry.value);
    if (typeof value === 'number' && !isNaN(value)) {
      let subject = '';
      if (entry.subject.length === 4) { // tmp fix for fam phenotype please go back to db
        subject = entry.subject.replace('UNT', 'UNT_00');
      } else {
        subject = entry.subject.replace('UNT', 'UNT_0');
      }
      if (!subjectData[subject]) {
        subjectData[subject] = [];
      }
      subjectData[subject].push(value);
    }
  });

  // Calculate the mean for each subject and sort by subject
  const result = Object.entries(subjectData)
    .map(([subject, values]) => {
      const meanValue = values.reduce((sum, val) => sum + val, 0) / values.length;
      return `0 ${subject} 0 0 0 ${meanValue}`;
    })
    .sort((a, b) => {
      // Extract the second column (subject) for sorting
      const subjectA = a.split(' ')[1];
      const subjectB = b.split('  ')[1];
      return subjectA.localeCompare(subjectB);
    });

  // Join the result into a single string with new lines between each row
  return result.join('\n');
}


// export function generatePlinkFamWithBLUPs(data) {
//   // Aggregate data by subject and initialize variables for fixed effect (overall mean) calculation
//   const subjectData = {};
//   let overallSum = 0;
//   let overallCount = 0;

//   // Step 1: Group values by subject and compute the overall sum and count
//   data.forEach(entry => {
//     const value = parseFloat(entry.value);
//     if (!isNaN(value)) {
//       let subject = '';
//       if (entry.subject.length === 4) { // tmp fix for fam phenotype please go back to db
//         subject = entry.subject.replace('UNT', 'UNT_00');
//       } else {
//         subject = entry.subject.replace('UNT', 'UNT_0');
//       }

//       // Initialize subject array if it doesn't exist
//       if (!subjectData[subject]) {
//         subjectData[subject] = [];
//       }
//       subjectData[subject].push(value);

//       // Update overall sum and count for fixed effect calculation
//       overallSum += value;
//       overallCount++;
//     }
//   });

//   // Step 2: Calculate the overall mean (fixed effect)
//   const overallMean = overallSum / overallCount;

//   // Step 3: Calculate BLUPs for each subject
//   const result = Object.entries(subjectData)
//     .map(([subject, values]) => {
//       // Calculate subject mean (random effect within the subject)
//       const subjectMean = values.reduce((sum, val) => sum + val, 0) / values.length;

//       // BLUP approximation: fixed effect + deviation from overall mean
//       const blup = overallMean + (subjectMean - overallMean);

//       // Format output in FAM format: "0 subject_id 0 0 0 blup_value"
//       return `0\t${subject}\t0\t0\t0\t${blup.toFixed(6)}`; // Rounded for consistency
//     })
//     // Step 4: Sort output by subject ID for consistency
//     .sort((a, b) => {
//       const subjectA = a.split('\t')[1];
//       const subjectB = b.split('\t')[1];
//       return subjectA.localeCompare(subjectB);
//     });

//   // Step 5: Join results into a single string with each row on a new line
//   return result.join('\n');
// }


export function generatePlinkFamWithBLUPs(data) {
  // Step 1: Aggregate data by subject
  const subjectData = {};
  let overallSum = 0;
  let overallCount = 0;

  // Group data by subject and calculate the overall sum and count for fixed effect
  data.forEach(entry => {
    const value = parseFloat(entry.value);
    if (!isNaN(value)) {
      let subject = '';
      if (entry.subject.length === 4) { // tmp fix for fam phenotype please go back to db
        subject = entry.subject.replace('UNT', 'UNT_00');
      } else {
        subject = entry.subject.replace('UNT', 'UNT_0');
      }

      // Initialize subject data array if it doesn't exist
      if (!subjectData[subject]) {
        subjectData[subject] = [];
      }
      subjectData[subject].push(value);

      // Update overall sum and count for overall mean calculation
      overallSum += value;
      overallCount++;
    }
  });

  // Calculate overall mean (fixed effect)
  const overallMean = overallSum / overallCount;

  // Step 2: Calculate BLUPs for each subject (subject mean adjusted by the overall mean)
  const result = Object.entries(subjectData)
    .map(([subject, values]) => {
      // Calculate the mean value for this subject
      const subjectMean = values.reduce((sum, val) => sum + val, 0) / values.length;

      // Calculate the BLUP as just the subject mean, as a simpler random effect model
      const blup = subjectMean;

      // Format the output to PLINK FAM structure with BLUP as the phenotype
      return `0\t${subject}\t0\t0\t0\t${blup.toFixed(6)}`;
    })
    // Step 3: Sort results by subject ID
    .sort((a, b) => {
      const subjectA = a.split('\t')[1];
      const subjectB = b.split('\t')[1];
      return subjectA.localeCompare(subjectB);
    });

  // Step 4: Join the results into a single string, with each row on a new line
  return result.join('\n');
}


export function capitalizeAndInsertSpaces(str) {
    return str
      .split(/(?=[A-Z](?![A-Z]))/g)
      .map(word => word.length <= 4 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }