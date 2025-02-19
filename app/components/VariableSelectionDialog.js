// 'use client'
// import React, { useState } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

// export default function VariableSelectionDialog({
//   open,
//   handleClose,
//   categoryOrder,
//   itemsByCategory,
//   isDarkMode,
//   onSelection,
//   study_identifier, // Pass study_identifier as a prop
// }) {
//   const [selectedItems, setSelectedItems] = useState([]);

//   const handleStateChange = (event, item, category) => {
//     const isChecked = event.target.checked;

//     setSelectedItems((prevSelected) => {
//       if (isChecked) {
//         // Add the object with category, title, and study_identifier
//         return [...prevSelected, { category, title: item, study_identifier }];
//       } else {
//         // Remove the object with the same category, title, and study_identifier
//         return prevSelected.filter(
//           (selected) =>
//             selected.title !== item ||
//             selected.category !== category ||
//             selected.study_identifier !== study_identifier
//         );
//       }
//     });
//   };

//   const handleDialogClose = () => {
//     onSelection(selectedItems); // Pass the selected items back to the parent
//     handleClose(); // Close the dialog
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleDialogClose}
//       fullWidth
//       maxWidth="lg"
//       PaperProps={{
//         style: { background: isDarkMode ? 'grey' : 'white' },
//       }}
//     >
//       <DialogTitle>Select variables</DialogTitle>

//       <DialogContent>
//         <div>
//           {categoryOrder
//             .filter(
//               (category) =>
//                 itemsByCategory !== null && itemsByCategory[category]
//             )
//             .map((category) => (
//               <div key={category}>
//                 <Typography
//                   variant="h6"
//                   sx={{ fontWeight: 'bold', marginBottom: 2 }}
//                   color="green"
//                 >
//                   {category}
//                 </Typography>
//                 <FormGroup
//                   variant="standard"
//                   sx={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     flexDirection: 'row',
//                     justifyContent: 'flex-start',
//                   }}
//                 >
//                   {itemsByCategory !== null &&
//                     itemsByCategory[category]?.map((item) => (
//                       <div
//                         key={item} // Assuming 'item' is a string
//                         style={{
//                           width: '480px',
//                           marginRight: '16px',
//                         }}
//                       >
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               onChange={(event) =>
//                                 handleStateChange(event, item, category)
//                               }
//                               name={item} // Assuming 'item' is a string
//                               sx={{
//                                 color: isDarkMode ? 'white' : 'black', // Set checkbox color based on mode
//                               }}
//                             />
//                           }
//                           label={item}
//                           sx={{
//                             color: isDarkMode ? 'white' : 'black', // Set label text color based on mode
//                           }}
//                         />
//                       </div>
//                     ))}
//                 </FormGroup>
//               </div>
//             ))}
//         </div>
//       </DialogContent>

//       <DialogActions>
//         <Button
//           variant="contained"
//           onClick={handleDialogClose}
//           color="primary"
//         >
//           OK
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }


'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function VariableSelectionDialog({
  open,
  handleClose,
  categoryOrder,
  itemsByCategory,
  isDarkMode,
  onSelection,
  study_identifier, // Pass study_identifier as a prop
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [prevSelectedItems, setPrevSelectedItems] = useState([]);

  useEffect(() => {
    // Reset selected items to an empty list only if there were previously selected items
    if (open) {
      if (selectedItems.length > 0) {
        setSelectedItems([]); // Reset selection when the dialog opens if there were any selections before
      }
    }
  }, [open]); // This effect runs whenever the dialog is opened

  const handleStateChange = (event, item, category) => {
    const isChecked = event.target.checked;

    setSelectedItems((prevSelected) => {
      if (isChecked) {
        // Add the object with category, title, and study_identifier
        return [...prevSelected, { category, title: item, study_identifier }];
      } else {
        // Remove the object with the same category, title, and study_identifier
        return prevSelected.filter(
          (selected) =>
            selected.title !== item ||
            selected.category !== category ||
            selected.study_identifier !== study_identifier
        );
      }
    });
  };

  const handleDialogClose = () => {
    if (selectedItems.length === 0 && prevSelectedItems.length > 0) {
      // If no new selection is made, return the previously selected items
      onSelection(prevSelectedItems);
    } else {
      // Otherwise, return the newly selected items and update previous selection
      setPrevSelectedItems(selectedItems);
      onSelection(selectedItems);
    }

    handleClose(); // Close the dialog
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        style: { background: isDarkMode ? 'grey' : 'white' },
      }}
    >
      <DialogTitle>Select variables</DialogTitle>

      <DialogContent>
        <div>
          {categoryOrder
            .filter(
              (category) =>
                itemsByCategory !== null && itemsByCategory[category]
            )
            .map((category) => (
              <div key={category}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', marginBottom: 2 }}
                  color="green"
                >
                  {category}
                </Typography>
                <FormGroup
                  variant="standard"
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}
                >
                  {itemsByCategory !== null &&
                    itemsByCategory[category]?.map((item) => (
                      <div
                        key={item} // Assuming 'item' is a string
                        style={{
                          width: '480px',
                          marginRight: '16px',
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={(event) =>
                                handleStateChange(event, item, category)
                              }
                              name={item} // Assuming 'item' is a string
                              sx={{
                                color: isDarkMode ? 'white' : 'black', // Set checkbox color based on mode
                              }}
                            />
                          }
                          label={item}
                          sx={{
                            color: isDarkMode ? 'white' : 'black', // Set label text color based on mode
                          }}
                        />
                      </div>
                    ))}
                </FormGroup>
              </div>
            ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={handleDialogClose}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
