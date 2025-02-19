// import React, { useState } from 'react';
// import { createViewState, JBrowseCircularGenomeView } from '@jbrowse/react-circular-genome-view';

// const CircularSyntenyPlot = ({ Genome1, Genome2 }) => {
//   console.log(Genome1);
//   console.log(Genome2);

//   const [viewState] = useState(
//     createViewState({
//       assembly: [
//         Genome1,
//         Genome2
//       ],
//       tracks: [
//         {
//           type: 'AlignmentsTrack',  // Use AlignmentsTrack for circular visualization
//           trackId: 'synteny-track',
//           name: 'Synteny Track for ' + Genome1.name + ' vs ' + Genome2.name,
//           adapter: {
//             type: 'PAFAdapter',
//             pafLocation: {
//               uri: '/genomeBrowser/genome_alignments/Cs_vs_UNT4.paf',
//             },
//           },
//         },
//       ],
//       views: [
//         {
//           type: 'CircularView',
//           assemblyNames: [Genome1.name, Genome2.name],
//           displayedRegions: [
//             {
//               assemblyName: Genome1.name,
//               start: 0,
//               end: 5000000, // Adjust based on genome size
//             },
//             {
//               assemblyName: Genome2.name,
//               start: 0,
//               end: 5000000, // Adjust based on genome size
//             },
//           ],
//           tracks: ['synteny-track'],
//         },
//       ],
//     })
//   );

//   return (
//     <div>
//       <h1>Circular Synteny Plot</h1>
//       <JBrowseCircularGenomeView viewState={viewState} />
//     </div>
//   );
// };

// export default CircularSyntenyPlot;





import React, { useState } from 'react';
import { createViewState, JBrowseLinearGenomeView } from '@jbrowse/react-linear-genome-view';
import LinearComparativeViewPlugin from '@jbrowse/plugin-linear-comparative-view';
import DotplotPlugin from '@jbrowse/plugin-dotplot-view';

const MultiGenomeSyntenyPlot = ({ Genome1, Genome2 }) => {
  console.log(Genome1);
  console.log(Genome2);

  const [viewState] = useState(
    createViewState({
    plugins : [LinearComparativeViewPlugin, DotplotPlugin],
      assembly: Genome1,
      tracks: [
        {
          type: 'SyntenyTrack',
          trackId: 'synteny-track',
          name: `Synteny Track for ${Genome1.name} vs ${Genome2.name}`,
          adapter: {
            type: 'PAFAdapter',
            pafLocation: {
              uri: '/genomeBrowser/genome_alignments/Cs_vs_UNT4.paf',
            },
          },
        },
      ],
      views: [
        {
          type: 'LinearSyntenyView',
          assemblyNames: [Genome1.name, Genome2.name], // First genome view
          displayedRegions: [
            {
              assemblyName: Genome1.name,
              start: 0,
              end: 5000000,
            },
          ],
          tracks: ['synteny-track'],
        },
      ],
    })
  );

  return (
    <div>
      <h1>Synteny Plot for {Genome1.name} and {Genome2.name}</h1>
      <JBrowseLinearGenomeView viewState={viewState} />
    </div>
  );
};

export default MultiGenomeSyntenyPlot;

