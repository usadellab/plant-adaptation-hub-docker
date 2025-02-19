import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Typography, Box, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

const AppBarWithMenus = ({ appBarTitle, isDark, changeTheme, ToggleDrawer }) => {
  const [menuAnchors, setMenuAnchors] = useState({
    tools: null,
    experimentalData: null,
    germplasm: null,
    phenotypingData: null,
    genotypingData: null,
    variantCatalogue: null,
  });

  const router = useRouter(); // React Router navigation

  const menuItems = {
    tools: [
      { title: 'Study specific Germplasm', compomentName: 'germplasm' },
      { title: 'Analyze Phenotypes', compomentName: 'vispheno' },
      { title: 'GWAS Analysis', compomentName: 'gwas' },
      { title: 'Multidimentionial Scaling', compomentName: 'mds' },
      { title: 'Genome Alignments', compomentName: 'assembly_comparison' },
      { title: 'Genome Browser', compomentName: 'jb' }
    ],
    experimentalMetaData: [
      { title: 'Projects', compomentName: 'dbview&tableName=investigation&pageTitle=Projects' },
      { title: 'Studies', compomentName: 'dbview&tableName=study&pageTitle=Studies' },
      { title: 'Experiments/Assays', compomentName: 'dbview&tableName=assay&pageTitle=Experiments' },
      { title: 'Samples', compomentName: 'dbview&tableName=sample&pageTitle=sample' },
      { title: 'Research Institutes', compomentName: 'dbview&tableName=institute&pageTitle=institute' },
      // { title: 'Locations', compomentName: 'dbview&tableName=sample&pageTitle=location' },
      // { title: 'Treatments', compomentName: 'dbview&tableName=sample&pageTitle=treatment' },
      // { title: 'Plant Anatomical Entities', compomentName: 'dbview&tableName=sample&pageTitle=plant_anatomical_entity' },
    ],
    germplasm: [
      { title: 'Species', compomentName: 'dbview&tableName=taxonomy_profile&pageTitle=Species' },
      { title: 'Accessions', compomentName: 'dbview&tableName=passport&pageTitle=Germplasm' },
      // { title: 'Mapping Population', compomentName: '/germplasm3' },
      // { title: 'Provider', compomentName: '/germplasm3' },
    ],
    phenotypes: [
      { title: 'Metabolites', compomentName: 'dbview&tableName=variable&pageTitle=Metabolites&dtype=metabolite' },
      { title: 'Agronomic Traits', compomentName: 'dbview&tableName=variable&pageTitle=Agronomic Traits&dtype=agronomic' },
      { title: 'Cellular Pigments', compomentName: 'dbview&tableName=variable&pageTitle=Cellular Pigments&dtype=pigments' },
      { title: 'Oil Content', compomentName: 'dbview&tableName=variable&pageTitle=Oil Content Measurements&dtype=lipid' },
      { title: 'Phenolics', compomentName: 'dbview&tableName=variable&pageTitle=Phenolic Compounds&dtype=phenolic' },
      { title: 'Fluorescence', compomentName: 'dbview&tableName=variable&pageTitle=Fluorescence Measurements&dtype=Fluorescence' },
      { title: 'Isotopes', compomentName: 'dbview&tableName=variable&pageTitle=Isotope Measurements&dtype=Isotope' },


      // { title: 'Observation Value', compomentName: '/observation-value-gourmetom' },
      // { title: 'Observation Variable Method', compomentName: '/observation-variable-method' },
      // { title: 'Observation Variable', compomentName: '/observation-variable' },
    ],
    genomes: [
        // { title: 'Reference Genome', compomentName: '/genotype1' },
        // { title: 'UNTWIST Genomes', compomentName: '/genotype3' },
        { title: 'Public Genomes', compomentName: 'dbview&tableName=genome&pageTitle=Genomes' },
        // { title: 'Pan-genomes', compomentName: '/genotype3' },
      ],
    // genotypicData: [
    //   { title: 'Markers Types', compomentName: '/genotype1' },
    //   { title: 'Variant Sets', compomentName: '/genotype3' },
    // ],
    variantCatalogue: [
      { title: 'GWAS Markers', compomentName: '/variant1' }
    ],
  };

  const handleMenuOpen = (menuName, event) => {
    setMenuAnchors({ ...menuAnchors, [menuName]: event.currentTarget });
  };

  const handleMenuClose = (menuName) => {
    setMenuAnchors({ ...menuAnchors, [menuName]: null });
  };

  const handleNavigation = (item, menuName) => {
    router.push(`/router?component=${item.compomentName}`);
    handleMenuClose(menuName);

  };

  return (

        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }} >
          {Object.keys(menuItems).map((menuName, index) => (
            <React.Fragment key={index}>
<Button
  size="small"
  sx={{
    color: '#145a32',
    fontWeight: 'bold',
    fontSize: 14,
    borderRadius: 0,
    paddingY: 0.5, // Reduce vertical padding to shrink the height
    borderLeft: index > 0 ? '1px solid #145a32' : 'none', // Border applied only to buttons after the first
    '&:hover': { backgroundColor: '#7dcea0' },
  }}
  onClick={(event) => handleMenuOpen(menuName, event)}
>
  {menuName.replace(/([A-Z])/g, ' $1').toUpperCase()} {/* Format menu name */}
</Button>


              {/* Dropdown Menu */}
              <Menu
  anchorEl={menuAnchors[menuName]}
  open={Boolean(menuAnchors[menuName])}
  onClose={() => handleMenuClose(menuName)}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
  PaperProps={{
    sx: {
      borderRadius: 2, // Rounded corners
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
      minWidth: 200, // Minimum width for consistent appearance
      padding: 1, // Add padding inside the menu
    },
  }}
>
  {menuItems[menuName]?.map((item, index) => (
    <MenuItem
      key={index}
      onClick={() => {
        handleNavigation(item, menuName);
      }}
      sx={{
        fontSize: 14, // Slightly smaller text
        fontWeight: 500,
        color: '#2c3e50', // Darker text for better contrast
        '&:hover': {
          backgroundColor: '#f8c471', // Highlight color on hover
          color: '#fff', // White text on hover
        },
      }}
    >
      {item.title}
    </MenuItem>
  ))}
</Menu>




      </React.Fragment>
          ))}
        </Box>
    

  );
};

export default AppBarWithMenus;
