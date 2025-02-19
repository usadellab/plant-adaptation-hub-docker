'use client';

import { Button, Box, Typography, Grid, Paper } from '@mui/material';
import React from 'react';

export default function Contact() {
  return (
    <Box
      sx={{
        p: 1,
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 3,
            textAlign: 'left',
            color: '#333',
          }}
        >
          Contact Us
        </Typography>
        <Grid
          container
          direction="row"
          sx={{
            columnGap: 6,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            {/* Address Section */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                mb: 2,
                color: '#333',
              }}
            >
              Our Address:
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
              Wilhelm-Johnen-Straße
              <br />
              52428 Jülich
            </Typography>

            {/* Postal Address Section */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                mb: 2,
                color: '#333',
              }}
            >
              Our Postal Address:
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
              Forschungszentrum Jülich GmbH
              <br />
              IBG-4
              <br />
              [Name of contact]
              <br />
              52425 Jülich
              <br />
              Germany
            </Typography>

            <Box textAlign="left" sx={{ mb: 4 }}>
              <a
                href="https://www.fz-juelich.de/en/about-us/contact-visitor-information"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  Contact & Visitor Information
                </Button>
              </a>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                textAlign: 'left',
                mb: 4,
              }}
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://internet-live.fz-juelich.de/de/ueber-uns/kontakt/lageplan-2021-portal.pdf/@@download/file"
              >
                <Box
                  component="figure"
                  sx={{
                    m: 0,
                    p: 0,
                    textAlign: 'left',
                    '& img': {
                      width: '100%', // Make image take full width of the column
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <img
                    loading="lazy"
                    src="/fzj-reachus.png"
                    alt="Contact & Visitor information"
                  />
                </Box>
              </a>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
