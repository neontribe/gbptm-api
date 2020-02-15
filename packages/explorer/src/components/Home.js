import React, { Component } from 'react';
import { Link as InternalLink } from '@reach/router';
import Paper from '@material-ui/core/Paper';
import ExternalLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import styles from '../css/home.module.css';

import { withStyles } from '@material-ui/core/styles';

const HeadingTypography = withStyles({
  root: {
    padding: '1rem',
  },
})(Typography);

const SubTypography = withStyles({
  root: {
    paddingLeft: '1rem',
    paddinRight: '1rem',
    paddingBottom: '1rem',
  },
})(Typography);

class Home extends Component {
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.intro}>
          <Typography variant="h5" component="body1" gutterBottom>
            Toilet Map Explorer exists to help people who want to know more
            about the data behind the{' '}
            <ExternalLink href="https://www.toiletmap.org.uk">
              The Great British Public Toilet Map
            </ExternalLink>
          </Typography>
          <Typography variant="body1" component="body2" gutterBottom>
            You've come to the right place if you want to:
            <div>
              <ul>
                <li>Get a statistical overview of the data</li>
                <li>Search for specific toilet data</li>
                <li>Explore the data by UK Administrative Geography</li>
                <li>Learn how to use our APIs to power your application</li>
                <li>
                  Learn about the Licensing terms under which you can use this
                  data
                </li>
              </ul>
            </div>
          </Typography>
          <Typography variant="body1" component="body2" gutterBottom>
            If you're looking for the nearest Loo you're better off using{' '}
            <ExternalLink href="https://www.toiletmap.org.uk">
              The Great British Public Toilet Map
            </ExternalLink>
          </Typography>
          <Typography variant="body1" component="body2" gutterBottom>
            If you're looking for information about our software please head on
            over to{' '}
            <ExternalLink href="https://github.com/neontribe/gbptm">
              our Github repository
            </ExternalLink>
          </Typography>
        </div>
        <Grid container spacing={16}>
          <Grid xs={12} md={4} item>
            <Paper elevation={5} square>
              <HeadingTypography variant="h5" component="body2">
                Stats
              </HeadingTypography>
              <SubTypography variant="body1" component="body2">
                You can view a selection of high level statistics{' '}
                <InternalLink className={styles.internalLink} to="statistics">
                  here
                </InternalLink>
              </SubTypography>
            </Paper>
          </Grid>

          <Grid xs={12} md={4} item>
            <Paper elevation={5} square>
              <HeadingTypography variant="h5" component="h3">
                Search
              </HeadingTypography>
              <SubTypography variant="body1" component="body2">
                You can search for toilet data using keyword searches{' '}
                <InternalLink className={styles.internalLink} to="search">
                  here
                </InternalLink>
              </SubTypography>
            </Paper>
          </Grid>

          <Grid xs={12} md={4} item>
            <Paper elevation={5} square>
              <HeadingTypography variant="h5" component="h3">
                Licensing
              </HeadingTypography>
              <SubTypography variant="body1" component="body2">
                Licensing information coming soon
              </SubTypography>
            </Paper>
          </Grid>

          <Grid xs={12} item>
            <Paper elevation={5} square>
              <HeadingTypography variant="h5" component="h3">
                API
              </HeadingTypography>
              <SubTypography variant="body1" component="body2">
                The Toilet Map API is expressed in{' '}
                <ExternalLink href={'https://graphql.org/'}>
                  GraphQL
                </ExternalLink>
                . The endpoint is served at
                `https://www.toiletmap.org.uk/graphql`.You can{' '}
                <ExternalLink href={'/voyager'}>
                  visualise the schema
                </ExternalLink>
                , or{' '}
                <ExternalLink href={'/graphql'}>
                  experiment with queries
                </ExternalLink>
                . To conduct mutations, or to get un-redacted results for
                certain fields you'll need to supply some credentials in an
                `Authorization` header. Please get in touch if you'd like to
                know how to achieve that. Please familiarize yourself with the
                terms under which our data is licensed before making use of it.
              </SubTypography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;
