import React from "react";
import { Grid, Typography } from "@mui/material";

export default function DownloadTerms() {
  return (
    <div>
      <div >
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h6" color={"green"}>
              Terms and conditions
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="p">
              Please read Terms and Conditions of Use before proceeding with the
              download. You are required to acknowledge the sources of the data
              accessed through this portal with following citation
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="p">
              Haleem, A., Weisweiler M.,Prigent, S., Silvestre, S., Le-Boulch,
              M., Griess-Osowski An., Miguel B. A., Jemmat A.,Alberghini, B.,
              Petriacq, P., Hassall, K., Da-Costa, A., Maider, G., Grosskinsky,
              D., Hallab A., Aldorino, E., Denning-James, K., Cassan, C.,
              Zegada, W., Prieto, J., Leon, P., Yambanis, Y. H., Zanetti, F.,
              Faure, J. D., Jonak, C., Gibon, Y., Haslam, R., Philip and Usadel,
              Björn. The Camelina Plant Adaptation HUB database and resource.
              Journal Name. 2024.
            </Typography>
          </Grid>

          {/* <Grid item>
          <Typography variant="body1">
          **OR**
       </Typography>
         </Grid>

         <Grid item>
          <Typography variant="body1">
          GitHub username [Haleem, Ataul.]. (2024). untwistApp [Software]. GitHub repository. https://github.com/usadellab/untwistApp
          </Typography>
         </Grid> */}
        </Grid>
      </div>
    </div>
  );
}
