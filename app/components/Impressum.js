'use client'
import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));



export default function Impressum() {

    const [expanded, setExpanded] = React.useState("panel1");

    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };


  return (

    <>
    
    <Accordion
    defaultExpanded
    // expanded={expanded === "panel6"}
    // onChange={handleChange("panel6")}
  >
    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
      <Typography>IMPRESSUM INFORMATION</Typography>
    </AccordionSummary>

    <AccordionDetails>
      <Typography>
        <div
          className="xbox"
          style={{
            columnCount: 2,
            columnGap: 40,
            padding: 40,
            whiteSpace: "normal",
          }}
        >
          <p className="headbox" style={{ verticalAlign: "middle" }}>
            Impressum information
          </p>
          Forschungszentrum Jülich GmbH
          <br />
          IBG-4 - Bioinformatics
          <br />
          Wilhelm-Johnen-Straße
          <br />
          52428 Jülich
          <br />
          Contact:{" "}
          <a
            href="mailto:plabipd@fz-juelich.de"
            title="plabipd@fz-juelich.de"
          >
            <span>plabipd@fz-juelich.de</span>
          </a>
          <br />
          <br />
          HHU Düsseldorf University
          <br />
          Institute of Biological Data Science
          <br />
          Universitätsstr. 1
          <br />
          40225 Düsseldorf
          <br />
          <br />
          <h3>Website hosting</h3>
          <p>
            Forschungszentrum Jülich GmbH
            <br />
            Wilhelm-Johnen-Straße
            <br />
            52428 Jülich
          </p>
          <p>
            Entered in the Commercial Register of the District Court of
            Düren, Germany: No. HR B 3498
            <br />
            Value Added Tax ID No. in accordance with §27a of the German VAT
            Law (Umsatzsteuergesetz): DE 122624631
            <br />
            Tax No.: 213/5700/0033
          </p>
          <h4>Board of Directors</h4>
          <p>
          Prof. Dr. Astrid Lambrecht (Chairman of the Board of Directors)
            <br />
            Karsten Beneke (Vice-Chairman)
            <br />
            Dr. Ir. Pieter Jansens
          </p>
          <h4>Supervisory Board</h4>
          <p>Ministerialdirektor Volker Rieke</p>
          <h4>
            Responsible in the sense of §18, Abs.2, Medienstaatsvertrag
            (MStV)
          </h4>
          Prof. Dr. Björn Usadel
          <br />
          IBG-4 - Bioinformatics
          <br />
          Forschungszentrum Jülich GmbH
          <br />
          Wilhelm-Johnen-Straße
          <br />
          52428 Jülich
          <h4>Contact</h4>
          <p>
            General inquiries: +49 2461 61-0
            <br />
            General fax no.: +49 2461 61-8100
            <br />
            General email address:{" "}
            <a href="mailto:info@fz-juelich.de" title="info@fz-juelich.de">
              <span>info@fz-juelich.de</span>
            </a>
            <br />
            Internet:{" "}
            <a href="http://www.fz-juelich.de">http://www.fz-juelich.de</a>
          </p>
          <h4>Copyright</h4>
          <p style={{ whiteSpace: "normal" }}>
            Copyright and all other rights concerning this website are held
            by Forschungszentrum Jülich GmbH. Use of the information
            contained on the website, including excerpts, is permitted for
            educational, scientific or private purposes, provided the source
            is quoted (unless otherwise expressly stated on the respective
            website). Use for commercial purposes is not permitted unless
            explicit permission has been granted.
          </p>
          <h4>Disclaimer</h4>
          <ul>
            <li>
              <h4>Contents of this website</h4>
              <p style={{ whiteSpace: "normal" }}>
                This website has been compiled with due diligence. However,
                Forschungszentrum Jülich neither guarantees nor accepts
                liability for the information being up-to-date, complete or
                accurate.
              </p>
            </li>
            <li>
              <h4>Links to External Websites</h4>
              <p style={{ whiteSpace: "normal" }}>
                This website may contain links to external third-party
                websites. These links to third party sites do not imply
                approval of their contents. Responsibility for the content
                of these websites lies solely with the respective provider
                or operator of the site. Illegal contents were not
                recognizable at the time of setting the link. We do not
                accept any liability for the continual accessibility or
                up-to- dateness, completeness or correctness of the contents
                of such websites. If we become aware of any infringements of
                the law, we will remove such links immediately.
              </p>
            </li>
            <li>
              <h4>Data protection</h4>
              <p style={{ whiteSpace: "normal" }}>
                Every time a user accesses a website hosted by
                Forschungszentrum Jülich GmbH and every time a file is
                requested, data connected to these processes are stored in a
                log. These data do not contain personal information; we are
                unable to trace which user accessed what information.
                Personal user profiles therefore cannot be created. The data
                that is saved will be used for statistical purposes only.
                This information will not be disclosed to third parties.{" "}
              </p>
            </li>
          </ul>
        </div>
      </Typography>
    </AccordionDetails>
  
  </Accordion>

  </>
)
}
