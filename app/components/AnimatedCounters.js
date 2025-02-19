import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';

const AnimatedCounters = ({ counters, styles, handleCardClick }) => {
  const [animatedCounts, setAnimatedCounts] = useState({});

  useEffect(() => {
    // Animate counts for each key in counters
    const keys = Object.keys(counters);
    const intervals = {};

    keys.forEach((key) => {
      const targetValue = counters[key];
      let currentValue = 0;

      intervals[key] = setInterval(() => {
        currentValue += Math.ceil(targetValue / 50); // Adjust the speed by changing the denominator
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(intervals[key]);
        }
        setAnimatedCounts((prev) => ({ ...prev, [key]: currentValue }));
      }, 20); // Adjust interval timing for smoother animation
    });

    return () => {
      // Clear all intervals on cleanup
      keys.forEach((key) => clearInterval(intervals[key]));
    };
  }, [counters]);

  return (
    <Container maxWidth="ld" sx={styles.summary}>
      <Grid container spacing={3}>
        {[
          {
            key: 'investigation',
            title: 'Projects',
            count: counters.investigation,
          },
          {
            key: 'study',
            title: 'Studies',
            count: counters.study,
          },
          {
            key: 'assay',
            title: 'Experiments',
            count: counters.assay,
          },
          {
            key: 'sample',
            title: 'Samples',
            count: counters.sample,
          },
          {
            key: 'genome',
            title: 'Genomes',
            count: counters.genome,
          },
          {
            key: 'passport',
            title: 'Germplasm',
            count: counters.passport,
          },
          {
            key: 'institute',
            title: 'Research Institutes',
            count: counters.institute,
          },
          {
            key: 'publication',
            title: 'Publications',
            count: counters.publication,
          },
          {
            key: 'people',
            title: 'Researchers',
            count: counters.people,
          },
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
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
              <Typography variant="h4">
                {animatedCounts[key] || 0}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AnimatedCounters;
