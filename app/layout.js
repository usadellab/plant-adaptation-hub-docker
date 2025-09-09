"use client";
import { Inter } from "next/font/google";
// import "./globals.css";
import { GlobalStyles } from "@mui/material";
const inter = Inter({ subsets: ["latin"] });
import Cookies from "js-cookie";

import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Switch,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
  Quiz as QuizIcon,
  PermContactCalendar as PermContactCalendarIcon,
  Forest as ForestIcon,
  Place as PlaceIcon,
  Insights as InsightsIcon,
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

import { SelectedSpeciesProvider } from "@/contexts/SelectedSpeciesContext";
import { AppDataContextProvider } from "@/contexts/AppDataContext";
import { ApiContextProvider } from "@/contexts/ApiEndPoint";
import { TokenProvider } from "@/contexts/TokenContext";
import Login from "./components/LoginPage";
import {
  UntwistThemeProvider,
  useUntwistThemeContext,
} from "@/contexts/ThemeContext";

import CopyrightIcon from '@mui/icons-material/Copyright';
import PhenotypingMenu from "./components/TopNavBar";

const drawerWidth = 240;

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3498db", // Vibrant blue
      contrastText: "#ffffff", // White text for buttons
    },
    secondary: {
      main: "#2ecc71", // Fresh green
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9f9f9", // Light gray background
      paper: "#ffffff", // White cards
    },
    text: {
      primary: "#34495e", // Deep gray for readability
      secondary: "#7f8c8d", // Muted gray
    },
    error: {
      main: "#e74c3c", // Bright red for errors
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 14,
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#34495e",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#34495e",
    },
    body1: {
      fontSize: "1rem",
      color: "#7f8c8d",
    },
    button: {
      textTransform: "none", // Disable uppercase text in buttons
    },
  },
  shape: {
    borderRadius: 8, // Rounded corners for components
  },
  // components: {
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         borderRadius: 12, // Stylish rounded buttons
  //         textTransform: "none", // Remove all-caps
  //         boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
  //       },
  //       containedPrimary: {
  //         backgroundColor: "#3498db",
  //         "&:hover": {
  //           backgroundColor: "#2980b9", // Darker blue on hover
  //         },
  //       },
  //     },
  //   },
  //   MuiPaper: {
  //     styleOverrides: {
  //       root: {
  //         padding: "16px",
  //         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Softer shadow for cards
  //       },
  //     },
  //   },
  // },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 10px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  alignItems: "left",
  ...theme.mixins.toolbar,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  marginTop: "50pt",
  // padding: theme.spacing(3), // Added padding for content
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
    },
  }),
}));

function parseToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const payload = JSON.parse(atob(base64));
    return payload.exp;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}

function isTokenExpired(token) {
  const expirationTimestamp = parseToken(token);
  if (expirationTimestamp === null) {
    return true; // Consider it expired if there's an error parsing
  }
  const expirationDate = new Date(expirationTimestamp * 1000);
  return new Date() > expirationDate;
}


export default function RootLayout({ children }) {
  
  const formatTitle = (text) => (
    <Typography
      variant="h6"
      sx={{
        //  mx: 2,
        // display: { md: 'flex' },
        // fontFamily: '-apple-system',
        fontWeight: "bold",
        // letterSpacing: '.3rem',
        // color: 'inherit',
        // textDecoration: 'none',
      }}
    >
      {text}
    </Typography>
  );

  const defaultTitle = formatTitle("Plant Adaptation Hub");
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(lightTheme);
  const [isDark, setIsDark] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);
  const [appBarTitle, setAppBarTitle] = useState(defaultTitle);
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !isTokenExpired(token)) {
      setAuthenticated(true);
    }
  }, []);

  const changeTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    setSelectedTheme(isDark ? darkTheme : lightTheme);
    Cookies.set("isDarkMode", isDark);
  }, [isDark]);

  const handleAppBarTitle = (text) => setAppBarTitle(formatTitle(text));
  const ToggleDrawer = () => setOpen(!open);

  var gwasIconPic = "/manhattan.png";
  var pcaIconPic = "/pca.png";
  var mdsIconPic = "/mds.png";
  var syntenyIconPic = "/synteny_image.png";
  var genomeIconPic = "/genome_icon.png";
  var genomeInfoIconPic = "/genome_informatics_icon.png";
  var annotateIconPic = "/annotate.png";
  var phylogenyIconPic = "/phylogeny.png";
  var hublogo = "/hub_logo.png";

  const menuItems = [
    {
      text: "Home",
      icon: <HomeIcon color="primary" />,
      path: "/router?component=home",
      title: "Plant Adaptation Hub",
    },
    {
      text: "Germplasm",
      icon: <PlaceIcon color="primary" />,
      path: "/router?component=germplasm",
      title: "Geographical distribution of the germplasm",
    },
    {
      text: "Phenotypic Data",
      icon: <ForestIcon color="primary" />,
      path: "/router?component=vispheno",
      title: "Analysis and visualization of phenotypic traits",
    },
    { text: "Genomics", title: "Analysis and visualization Genotypic data" },
    { text: "Genome Informatics" },
    {
      text: "Genome Browser",
      title: "Explore multi-omics data in the context of genome",
      icon: (
        <Avatar sx={{ width: 25, height: 22 }} alt="Icon" src="/dna-icon.png" />
      ),
      path: "/router?component=jb",
    },
    {
      text: "Downloads",
      icon: <DownloadIcon color="primary" />,
      path: "/router?component=downloads",
      title: "Downloads",
    },
    {
      text: "FAQs",
      icon: <QuizIcon color="primary" />,
      path: "/router?component=faqs",
      title: "Frequently Asked Questions (FAQs)",
    },
    {
      text: "People",
      icon: <PersonIcon color="primary" />,
      path: "/router?component=people",
      title: "Relevant scientists and their affiliations",
    },
    {
      text: "Contact",
      icon: <PermContactCalendarIcon color="primary" />,
      path: "/router?component=contact",
      title: "Contact Information",
    },
    {
      text: "IMPRESSUM INFORMATION",
      icon: <CopyrightIcon color="primary" />,
      path: "/router?component=impressum",
      title: "IMPRESSUM INFORMATION",
    },
    {
      text: "GDPRC PRIVACY NOTICE",
      icon: <CopyrightIcon color="primary" />,
      path: "/router?component=gdprc",
      title: "GDPRC PRIVACY NOTICE",
    },

  ];

  const [genomicsDropDown, setgenomicsDropDown] = React.useState(false);
  const [comparativeGenomicsDropDown, setcomparativeGenomicsDropDown] =
    React.useState(false);

  const handlecomparativeGenomics = () => {
    setcomparativeGenomicsDropDown(!comparativeGenomicsDropDown);
  };

  const handleGenomics = () => {
    setgenomicsDropDown(!genomicsDropDown);
  };

  return (
    <html lang="en">
      <ApiContextProvider>
        <TokenProvider>

          <AppDataContextProvider>

            <StyledThemeProvider theme={selectedTheme}>
              <MuiThemeProvider theme={selectedTheme}>
                {/* Apply global styles to body */}
                <GlobalStyles
                  styles={{
                    body: {
                      backgroundColor: selectedTheme.palette.background.default,
                      color: selectedTheme.palette.text.primary,
                      transition: "background-color 0.3s, color 0.3s",
                      background: authenticated || 'linear-gradient(to right bottom, #d6ff7f, #00b3cc)'

                    },
                  }}
                />

                <SelectedSpeciesProvider>
                  <body className={inter.className}>
                    {!authenticated ? (
                      <Login updateAuthenticationStatus={setAuthenticated} />
                    ) : (


                      <div>                       
                        <AppBar
                          position="fixed"
                          open={open}
                          color="default"
                          enableColorOnDark
                        >
                          <Toolbar sx={{ border: 1, borderColor: "green" }}>
                            <MenuIcon
                              sx={{ mr: open ? 1 : 4 }}
                              onClick={ToggleDrawer}
                            />
                            <div>{appBarTitle}</div>

                            <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
    <PhenotypingMenu />
  </Box>
                              <Switch
                              sx={{ ml: "auto" }}
                              checked={isDark}
                              onChange={() => {
                                changeTheme();
                              }}
                              inputProps={{ "aria-label": "toggle theme" }}
                            />
                          </Toolbar>
                        </AppBar>

                        <Drawer variant="permanent" open={open}>
                          <Avatar
                            sx={{ ml: -2, mt: -6, width: "100%", height: 110 }}
                            alt="Icon"
                            src={hublogo}
                          />
                          <Divider sx={{ mb: -8 }} />
                          <div>
                            {menuItems.map((item, index) => {
                              if (item.text === "Genomics") {
                                return (
                                  <div key={index}>
                                    <ListItemButton
                                      onClick={() => {
                                        handleGenomics();
                                      }}
                                    >
                                      <ListItemIcon>
                                        <InsightsIcon color="primary" />
                                      </ListItemIcon>
                                      <ListItemText primary="Genomics" />
                                      {genomicsDropDown ? (
                                        <ExpandLess />
                                      ) : (
                                        <ExpandMore />
                                      )}
                                    </ListItemButton>
                                    <Collapse
                                      in={genomicsDropDown}
                                      timeout="auto"
                                      unmountOnExit
                                    >
                                      <ListItemButton
                                        onClick={() => {
                                          handleAppBarTitle(
                                            "Genome Wide Association Analysis (GWAS)"
                                          );
                                          router.push("/router?component=gwas");
                                        }}
                                      >
                                        <ListItemIcon>
                                          <Avatar
                                            sx={{ width: 25, height: 25 }}
                                            alt="Icon"
                                            src={gwasIconPic}
                                          />
                                        </ListItemIcon>
                                        <ListItemText primary="GWAS" />
                                      </ListItemButton>

                                      <ListItemButton
                                        onClick={() => {
                                          handleAppBarTitle(
                                            "Principal Component Analysis (PCA)"
                                          );
                                          router.push("/router?component=pca");
                                        }}
                                      >
                                        <ListItemIcon>
                                          <Avatar
                                            sx={{ width: 25, height: 25 }}
                                            alt="Icon"
                                            src={pcaIconPic}
                                          />
                                        </ListItemIcon>
                                        <ListItemText primary="PCA" />
                                      </ListItemButton>

                                      <ListItemButton
                                        onClick={() => {
                                          handleAppBarTitle(
                                            "Multidimentional Scaling (MDS)"
                                          );
                                          router.push("/router?component=mds");
                                        }}
                                      >
                                        <ListItemIcon>
                                          <Avatar
                                            sx={{ width: 25, height: 25 }}
                                            alt="Icon"
                                            src={mdsIconPic}
                                          />
                                        </ListItemIcon>
                                        <ListItemText primary="MDS" />
                                      </ListItemButton>
                                    </Collapse>
                                  </div>
                                );
                              } else if (item.text === "Genome Informatics") {
                                return (
                                  <div key={index}>
                                    <ListItemButton
                                      onClick={() => {
                                        handlecomparativeGenomics();
                                      }}
                                    >
                                      <ListItemIcon>
                                        <Avatar
                                          sx={{ width: 25, height: 25 }}
                                          alt="Icon"
                                          src={genomeInfoIconPic}
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary="Genome Informatics" />
                                      {comparativeGenomicsDropDown ? (
                                        <ExpandLess />
                                      ) : (
                                        <ExpandMore />
                                      )}
                                    </ListItemButton>
                                    <Collapse
                                      in={comparativeGenomicsDropDown}
                                      timeout="auto"
                                      unmountOnExit
                                    >
                                      <ListItemButton
                                        onClick={() => {
                                          handleAppBarTitle(
                                            "Assembly Quality Statistics"
                                          );
                                          router.push(
                                            "/router?component=genome_overview"
                                          );
                                        }}
                                      >
                                        <ListItemIcon>
                                          <Avatar
                                            sx={{ width: 25, height: 25 }}
                                            alt="Icon"
                                            src={genomeIconPic}
                                          />
                                        </ListItemIcon>
                                        <ListItemText primary="Genomes" />
                                      </ListItemButton>

                                      <ListItemButton
                                        onClick={() => {
                                          handleAppBarTitle(
                                            "Compare Genome Assemblies"
                                          );
                                          router.push(
                                            "/router?component=assembly_comparison"
                                          );
                                        }}
                                      >
                                        <ListItemIcon>
                                          <Avatar
                                            sx={{ width: 25, height: 25 }}
                                            alt="Icon"
                                            src={syntenyIconPic}
                                          />
                                        </ListItemIcon>
                                        <ListItemText primary="Compare Genome Assemblies " />
                                      </ListItemButton>

                                      {/* <ListItemButton
                                          onClick={() => {
                                            handleAppBarTitle("Comparative analysis of genomic structures");
                                            router.push("/router?component=gs");
                                          }}
                                        >
                                          <ListItemIcon>
                                            <Avatar
                                              sx={{ width: 25, height: 25 }}
                                              alt="Icon"
                                              src={syntenyIconPic}
                                            />
                                          </ListItemIcon>
                                          <ListItemText primary="Genome Structures" />
                                        </ListItemButton>


                                        <ListItemButton
                                          onClick={() => {
                                            handleAppBarTitle("Get custome genome annotations");
                                            router.push("/router?component=genome_annotation");
                                          }}
                                        >
                                          <ListItemIcon>
                                            <Avatar
                                              sx={{ width: 25, height: 25 }}
                                              alt="Icon"
                                              src={annotateIconPic}
                                            />
                                          </ListItemIcon>
                                          <ListItemText primary="Annotate" />
                                        </ListItemButton>


                                        <ListItemButton
                                          onClick={() => {
                                            handleAppBarTitle("Phylogenetic analysis");
                                            router.push("/router?component=genome_phylogeny");
                                          }}
                                        >
                                          <ListItemIcon>
                                            <Avatar
                                              sx={{ width: 25, height: 25 }}
                                              alt="Icon"
                                              src={phylogenyIconPic}
                                            />
                                          </ListItemIcon>
                                          <ListItemText primary="Phylogeny" />
                                        </ListItemButton> */}
                                    </Collapse>
                                  </div>
                                );
                              }

                              return (
                                <ListItemButton
                                  key={index}
                                  sx={{ mt: index === 0 ? 8 : 0 }}
                                  onClick={() => {
                                    handleAppBarTitle(item.title);
                                    router.push(item.path);
                                  }}
                                >
                                  <ListItemIcon>{item.icon}</ListItemIcon>
                                  <ListItemText primary={item.text} />
                                </ListItemButton>
                              );
                            })}
                          </div>
                        </Drawer>

                        <DrawerHeader theme={selectedTheme}
                          sx={{ marginLeft: open ? 30 : 8, marginTop: 8 }}
                        >
                          {children}
                        </DrawerHeader>

                      </div>



                    )}
                  </body>
                </SelectedSpeciesProvider>

              </MuiThemeProvider>
            </StyledThemeProvider>
            
          </AppDataContextProvider>

        </TokenProvider>
      </ApiContextProvider>
    </html>
  );
}
