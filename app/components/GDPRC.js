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



export default function GDPRC() {

    const [expanded, setExpanded] = React.useState("panel1");

    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };


  return (
    
  <Accordion
  defaultExpanded

//   expanded={expanded === "panel7"}
//   onChange={handleChange("panel7")}
>
  <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
    <Typography>GDPR PRIVACY NOTICE</Typography>
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
          GDPR privacy notice
        </p>
        <h4>PlabiPD privacy policy</h4>
        <p>
          PlabiPD would like to assure you that we are committed to
          protecting the privacy of all our users. The purpose of this
          Privacy Statement is to inform you of the data relating to you
          that we collect and use in connection with this website and the
          uses (including disclosures to third parties) we make of such
          data. We will ensure that the information you provide us with is
          kept private and confidential, and we will only use it to
          provide the services you request.
        </p>
        <h4>Requirement to provide personal data</h4>
        <p>
          You are not under a contractual or statutory obligation to
          provide us with any personal data.
        </p>
        <h4>Personal data that PlabiPD collects and processes</h4>
        <p>
          When you sign up to our website, send us an email, or
          communicate with us in any way, you are voluntarily giving us
          information which we collect. That information may include:
        </p>
        <ul>
          <li>
            your name and contact details, including your postal address,
            phone number and e-mail address
          </li>
          <li>
            your user ID and password to your account on our website
          </li>
          <li>your contact preferences</li>
          <li>
            any other information relating to you that you provide to us
            or that we generate about you in connection with your use of
            the website
          </li>
        </ul>
        By giving us this information, you consent to this information
        being collected. In the interest of your privacy, we only collect,
        use and retain information reasonably required for our legitimate
        interests.
        <p />
        <h4>Non-personal data that PlabiPD collects</h4>
        <p>
          In addition, when you browse our website, we may automatically
          collect information about your visit by using cookies. The
          following non-personal information may be retained about that
          visit:
        </p>
        <ul>
          <li>your device type</li>
          <li>the search engine used to access the website</li>
          <li>how you came to the website</li>
          <li>how you interacted with the website</li>
        </ul>
        Most non-personal information is collected via cookies or other
        analysis technologies. This information may be used to monitor or
        improve website performance. Information from the cookie alone
        generally will not identify you personally and we will not use
        this information in connection with any personally identifiable
        information you have provided.
        <p />
        <h4>How PlabiPD uses the collected data</h4>
        <p>
          PlabiPD uses your personal data for the following: to
          communicate with you if you choose to participate in our forum
          (optional) You have the option to
          subscribe/unsubscribe/contribute to our forum at will. to inform
          you (if you have optionally decided to choose this option) via
          email when a job your have submitted to our cluster system had
          completed. Non-personal information is aggregated for reporting
          about PlabiPD website usability, performance and effectiveness.
          It is used to improve the website usability and website content.
        </p>
        <h4>Information PlabiPD shares with third party providers</h4>
        <p>
          We don't share your personally identifiable information with any
          third party providers.
        </p>
        <h4>Keeping your information secure</h4>
        <p>
          PlabiPD is committed to protecting the information you provide.
          In particular we take steps to prevent unauthorised access or
          disclosure, to maintain data accuracy, and to ensure the
          appropriate use of the information we collect. We take
          reasonable and appropriate measures to protect Personal
          Information from loss, misuse and unauthorised access,
          disclosure, alteration and destruction, considering the risks
          involved in the processing and the nature of the personal
          information. Your personal information is contained behind
          secured networks and is only accessible by a limited number of
          persons who have special access rights to such systems, and are
          required to keep the information confidential.
        </p>
        <h4>Retention of personal data</h4>
        <p>
          We will not hold your personal data for longer than is
          necessary. We retain your personal data for as long as we need
          it for the purposes described in this Privacy Statement, or to
          comply with our obligations under applicable law.
        </p>
        <h4>Access to and accuracy of your information</h4>
        <p>
          PlabiPD strives to keep your personal information accurate. We
          provide you with access to your information when you login to
          our site, and the opportunity to change your information. To
          protect your privacy and security, we will also take reasonable
          steps to verify your identity, such as a password and user ID,
          before granting access to your data.
        </p>
        <h4>Third party websites</h4>
        <p>
          Our website includes links to other websites, whose privacy
          practices may be different from ours. If you submit personally
          identifiable information to any of those sites, your information
          is governed by their privacy policies. We encourage you to
          carefully read the privacy policy of any website you visit.
        </p>
        <h4>Individual rights</h4>
        <p>
          You have the following rights, in certain circumstances and
          subject to certain restrictions, in relation to your personal
          data: the right to access your personal data; the right to
          request the rectification and/or erasure of your personal data;
          the right to restrict the use of your personal data; the right
          to object to the processing of your personal data; where our
          processing of your personal data is based on you having provided
          consent, the right to withdraw your consent to the processing at
          any time. If you wish to exercise any of the rights set out
          above, or have comments or questions about our Privacy
          Statement, please contact us at: plabipd@fz-juelich.de
        </p>
      </div>
    </Typography>
  </AccordionDetails>
</Accordion>
  )
}
