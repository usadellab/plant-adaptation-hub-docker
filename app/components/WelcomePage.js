'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Box,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material'
import Footer from './Footer' // Assuming you keep your custom Footer component
import { useApiContext } from '@/contexts/ApiEndPoint'
import { useTokenContext } from '@/contexts/TokenContext'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import postgresCounts from "../../public/postgres_latest.json";
import PieChart from './PieChart'
import GeoLocator from './GeoLocator'
import AnimatedCounters from './AnimatedCounters'

export const metadata = {
  title : 'Plant Adaptation Hub'
}



const WelcomePage = () => {
  const token = useTokenContext()
  const { apiEndpoint } = useApiContext()
  const [partners, setPartners] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [counters, setCounters] = useState({investigation: 2,
    study: 23,
    assay: 35,
    sample: 105,
    genome: 11,
    biological_material: 107,
    institute: 8,
    publication: 9,
    people: 59,
    passport: 1119
})
  const router = useRouter()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // Memoize static data for stable props
  const memoizedData = useMemo(() => postgresCounts, [])

  // Dark mode effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      const darkModeValue = Cookies.get('isDarkMode')
      setIsDarkMode(darkModeValue === 'true')
    }, 1000) // Reduced frequency to 1 second

    return () => clearInterval(intervalId)
  }, [])

  // Fetch partners effect
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const institute_ids = [
          'AIT',
          'INRAE',
          'RRES',
          'FZJ',
          'UNIBO',
          'CCE',
          'INI',
          'RTDS'
        ]
        const responses = await Promise.all(
          institute_ids.map(id =>
            axios.post(
              `${apiEndpoint}/institute?instituteId=${id}&token=${token.apiToken}`
            )
          )
        )
        setPartners(responses.map(response => response.data.result.data[0]))
      } catch (error) {
        console.error('Error fetching partners:', error)
      }
    }

    if (token.apiToken) {
      fetchPartners()
    }
  }, [token, apiEndpoint])

  // Handle navigation
  const handleCardClick = useCallback(
    (tableName, pageTitle) => {
      router.push(
        `/router?component=dbview&tableName=${encodeURIComponent(
          tableName
        )}&pageTitle=${encodeURIComponent(pageTitle)}`
      )
    },
    [router]
  )

  const styles = {
    hero: {
      backgroundColor: isDarkMode ? '#121212' : '#e0f7fa',
      height: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 20px',
    },
    summary: {
      // backgroundColor: isDarkMode ? '#121212' : '#f9f9f9',
      padding: '30px 0'
    },
    section: {
      backgroundColor: isDarkMode ? '#121212' : '#F9F9F9',
      padding: '50px 0'
    },
    title: {
      color: '#00796b',
      fontWeight: 700,
      marginBottom: '20px'
    },
    card: {
      textAlign: 'left', // Align text to the left
      background: isDarkMode
        ? 'linear-gradient(135deg, #333, #555)'
        : 'linear-gradient(135deg, #f5f5f5, #fff)',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      transform: 'scale(1)', // Initial state for scaling effect
      '&:hover': {
        transform: 'scale(1.05)', // On hover, card grows slightly
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)' // Larger shadow on hover
      },
      backgroundColor: 'transparent', // Transparent background to showcase gradient
      color: isDarkMode ? '#fff' : '#333',
      fontSize: '16px',
      fontWeight: 'bold',
      letterSpacing: '0.5px',
      textShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle text shadow for a 3D effect
      border: '1px solid transparent', // Transparent border initially
      backgroundClip: 'padding-box', // Ensures border stays outside the gradient
      boxSizing: 'border-box',
      outline: 'none',
      animation: 'shine 1.5s infinite linear', // Adds a shine effect
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingBottom: '40px'
    },

    label: {
      fontSize: '14px',
      color: isDarkMode ? '#bbb' : '#555', // Lighter text for labels
      marginBottom: '8px' // Space between label and value
    },

    value: {
      fontSize: '24px', // Larger size for values
      color: isDarkMode ? '#4FA3FF' : '#0077cc', // Blue color for the values
      fontWeight: 'bold'
    },

    row: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: '20px' // Space between rows
    },
    sectionPartners: {
      backgroundColor: isDarkMode ? '#121212' : '#f0f0f0',
      padding: '50px 0'
    },
    sectionTitle: {
      marginBottom: '20px',
      fontWeight: 700,
      color: '#00796b'
    },
    button: {
      marginTop: '20px',
      padding: theme.spacing(1, 4),
      borderRadius: '25px'
    }
  }
  return (
    <>
      <Container maxWidth='ld' sx={styles.hero}>
        <Box
          sx={{
            ...styles.hero,
            //  backgroundImage: `url('/welcomeImg.jpg')`, // Replace with your image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <Typography
            variant={isSmallScreen ? 'h4' : 'h2'}
            fontWeight='bold'
            color='green'
            fontSize='40px'
          >
            Uncovering Environmental Stress Tolerance in Camelina sativa
          </Typography>
          <Typography variant='h6' sx={{ marginTop: 2 }} color='black'>
            The Plant Adaptation Hub is a comprehensive web-based platform
            designed to empower scientists, farmers, and the general public with
            advanced tools and resources for Camelina research, farming, and
            data exploration.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            sx={styles.button}
            type='a'
            href='https://ataulhaleem.github.io/camelina-hub-documentation/'
            target='blank'
          >
            Learn More
          </Button>
        </Box>
      </Container>


      <Container maxWidth='lg' sx={styles.section}>
        <Typography variant='h4' align='center' sx={styles.title}>
          About UNTWIST
        </Typography>
        <Typography variant='body1' align='center' color='textSecondary'>
          UNTWIST is an initiative focused on advancing research and development
          of Camelina sativa for resilience against environmental streOur
          platform integrates data from multiple sources, empowering scientists
          and farmers to make informed decisions.
        </Typography>
      </Container>

      <Container maxWidth='lg' sx={styles.section}>
          <GeoLocator studyId='' width={1000} height={800} scale={1} type='orthographic' center={{}} />
      </Container>

      <Container maxWidth='lg' sx={styles.section}>

      <Typography variant='h4' align='center' sx={styles.title}>
          Plant Adaptation Hub: A Snapshot of the Data types hosted.
        </Typography>
      </Container>


      <Container maxWidth='ld' sx={styles.summary}>
        {/* <Grid container spacing={3}>
          {[
            {
              key: 'investigation',
              title: 'Projects',
              count: counters.investigation,
              page: ''
            },
            {
              key: 'study',
              title: 'Studies',
              count: counters.study,
              page: ''
            },
            {
              key: 'assay',
              title: 'Experiments',
              count: counters.assay,
              page: ''
            },
            {
              key: 'sample',
              title: 'Samples',
              count: counters.sample,
              page: ''
            },
            {
              key: 'genome',
              title: 'Genomes',
              count: counters.genome,
              page: ''
            },
            {
              key: 'passport',
              title: 'Germplasm',
              count: counters.passport,
              page: ''
            },
            {
              key: 'institute',
              title: 'Research Institutes',
              count: counters.institute,
              page: ''
            },
            {
              key: 'publication',
              title: 'Publications',
              count: counters.publication,
              page: ''
            },
            {
              key: 'people',
              title: 'Researchers',
              count: counters.people,
              page: ''
            }
            // {
            //   key: 'total_antioxidant_capacity',
            //   title: 'Anti oxidants',
            //   count: counters.total_antioxidant_capacity,
            //   page : ""
            // },
            // {
            //   key: 'fatty_acid_methyl_esters',
            //   title: 'Fatty acids',
            //   count: counters.fatty_acid_methyl_esters,
            //   page : ""
            // },
            // {
            //   key: 'targeted_metabolomics',
            //   title: 'Metabolites',
            //   count: counters.targeted_metabolomics + counters.untargeted_metabolomics,
            //   page : ""
            // },
            // {
            //   key: 'ontologies',
            //   title: 'Ontologies',
            //   count: counters.ontologies,
            //   page : ""
            // },
            // {
            //   key: 'agronomic_traits_multiple_locations_',
            //   title: 'Agronomic traits',
            //   count: counters.agronomic_traits_multiple_locations_,
            //   page : ""
            // }
          ].map(({ key, title, count }) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={key}
              onClick={() => handleCardClick(key, title)}
            >
              <Box sx={styles.card}>
                <Typography variant='h6' fontWeight='bold'>
                  {title}
                </Typography>
                <Typography variant='h4'>{count}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid> */}

        {!counters || <AnimatedCounters counters={counters} styles={styles} handleCardClick={handleCardClick}/>}
      </Container>


      <Grid
          container
          direction='row'
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {memoizedData && <PieChart data={memoizedData} />}
        </Grid>


      <Container maxWidth='lg' sx={styles.section}>
        {/* Partners Section */}
        {partners.length > 0 && (
          <div>
            <Typography variant='h4' align='center' sx={styles.title}>
              Our Partners
            </Typography>
            <Grid container spacing={4}>
              {partners.map((partner, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Grid
                    container
                    direction='row'
                    alignItems='center'
                    spacing={2}
                  >
                    <Grid item xs={4}>
                      <img
                        src={partner.institute_logourl}
                        alt={`${partner.institute_name} logo`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxWidth: '120px'
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant='h6' fontWeight='bold'>
                        {partner.institute_name} ({partner.institute_identifier}
                        )
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {partner.institute_city}, {partner.institute_country}
                      </Typography>
                      <Typography variant='body2' color='primary'>
                        <a
                          href={partner.institute_weburl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {partner.institute_weburl}
                        </a>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </Container>

      <Footer isDark={isDarkMode} />
    </>
  )
}

export default WelcomePage
