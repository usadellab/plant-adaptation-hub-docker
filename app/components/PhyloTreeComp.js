// 'use client'
// import React from 'react';
// import { useRef, useEffect } from 'react';
// // import PhyloTree from './PhyloTree';
// // import Tree from 'react-phylotree';

// import Tree from 'phylotree';

// const PhyloTreeComp = () => {

// const treeRef = useRef(null);

// useEffect(() => {

// const newickString = "(C:2,((A:2,B:3):3,(D:2,E:1):2):2);"
// if (treeRef.current) {
//     treeRef.current.newick = newickString;
// }
// }, []);

// return (
// <div style={{ width: '100%', height: '400px' }}>
//     <h2>Phylogenetic Tree</h2>
//     <Tree ref={treeRef} width={600} height={400} />
// </div>
// );
// };

// export default PhyloTreeComp;



// import React, { useRef, useEffect } from 'react';
// import Phylocanvas from 'phylocanvas';

// const PhyloTreeComp = () => {
//   const treeRef = useRef(null);

//   useEffect(() => {
//     const newickString = "(C:2,((A:2,B:3):3,(D:2,E:1):2):2);";
//     if (treeRef.current) {
//         const phylocanvas = Phylocanvas.create(treeRef.current, {
//             dimensions: {
//                 width: 600,
//                 height: 400
//             }
//         });
//         phylocanvas.load(newickString);
//     }
//   }, []);

//   return (
//     <div style={{ width: '100%', height: '400px' }}>
//         <h2>Phylogenetic Tree</h2>
//         <div ref={treeRef}></div>
//     </div>
//   );
// };

// export default PhyloTreeComp;

// import React from 'react'
// // import Tree from 'react-phylotree';
// import { useRef, useEffect } from 'react';



// export default function PhyloTreeComp() {
//     // console.log(Tree)

//     const newickString = "(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5,(F:0.3,G:0.4,(H:0.2,I:0.3)J:0.5)K:0.6)L;";


//     return (
//       <div>
//         <h2>Phylogenetic Tree</h2>
//         {/* <Tree newick={newickString} /> */}
//       </div>
//     );
//   };
  


// Use client
import React, { useState, useRef, useEffect } from 'react';
import Tree from 'react-phylotree';

const PhyloTreeComp = ({ data, options = {} }) => {
  const [treeOptions, setTreeOptions] = useState({
    treeType: 'circular', // Default tree type
    distance: 'default', // Default distance metric
    // Add other options as needed (e.g., branch colors, node labels)
  });

  const treeRef = useRef(null);

  const handleOptionChange = (event) => {
    setTreeOptions({
      ...treeOptions,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (data && treeRef.current) {
      // Convert data to Newick format (replace with your logic)
      const newickString = processDataToNewick(data);
      treeRef.current.newick = newickString;

      // Update tree options based on selected values
      treeRef.current.options = {
        ...treeRef.current.options,
        // Update options based on treeOptions state (e.g., treeType, distance)
        treeType: treeOptions.treeType,
        distance: treeOptions.distance,
        // Update other options as needed
      };
    }
  }, [data, treeOptions]);


  
  // Function to process data to Newick format (replace with your implementation)
  const processDataToNewick = (data) => {
    // Implement logic to convert your data structure to Newick format
    // based on the requirements of react-phylotree
    const newickString = '(((A:0.1,B:0.2),C:0.3)D:0.4);'; // Placeholder example
    return newickString;
  };

  return (
    <div>
      <h2>Phylogenetic Tree</h2>
      <div>
        <label htmlFor="treeType">Tree Type:</label>
        <select id="treeType" name="treeType" value={treeOptions.treeType} onChange={handleOptionChange}>
          <option value="circular">Circular</option>
          <option value="radial">Radial</option>
          {/* Add options for other tree types supported by react-phylotree */}
        </select>
      </div>
      <div>
        <label htmlFor="distance">Distance Metric:</label>
        <select id="distance" name="distance" value={treeOptions.distance} onChange={handleOptionChange}>
          <option value="default">Default</option>
          <option value="euclidean">Euclidean</option>
          <option value="hamming">Hamming</option>
          {/* Add options for other distance metrics supported by react-phylotree */}
        </select>
      </div>
      {/* Add options for other user-configurable fields */}
      {data && (
        <Tree ref={treeRef} options={{ ...treeOptions.options }} width={600} height={400} />
      )}
    </div>
  );
};

export default PhyloTreeComp;


