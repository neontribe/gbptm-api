import React, { Component } from 'react';
import { Location } from '@reach/router';
import _ from 'lodash';
import api from '@toiletmap/api-client';
import moment from 'moment';
import { loader } from 'graphql.macro';
import { Query } from 'react-apollo';

import Counter from '../Counter';
import LooIcon from '@material-ui/icons/Wc';
import RemoveIcon from '@material-ui/icons/Delete';
import StatIcon from '@material-ui/icons/Assessment';
import RefreshIcon from '@material-ui/icons/Refresh';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Doughnut } from 'react-chartjs-2';

const ALL_COUNTERS = loader('./counters.graphql');

const RED = '#FF6384';
const GREEN = '#36A2EB';
const YELLOW = '#FFCE56';
const H_RED = '#FF6384';
const H_GREEN = '#36A2EB';
const H_YELLOW = '#FFCE56';

function makeDoughnutData(labels, data) {
  return {
    labels,
    datasets: [
      {
        data: data,
        backgroundColor: [GREEN, RED, YELLOW],
        hoverBackgroundColor: [H_GREEN, H_RED, H_YELLOW],
      },
    ],
  };
}

class HeadlineStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadedInitialData: false,
      refreshing: false,
      proportions: null,
    };
  }

  async fetchStats(query) {
    var q = query || this.props.location.query;
    this.setState({
      refreshing: true,
    });
    //Gets stats from the api applying query values
    const proportions = await api.fetchProportionsStatistics(q);
    this.setState({ proportions });

    this.setState({
      refreshing: false,
    });
  }

  async componentDidMount() {
    // Rerieve stats for the initial query
    await this.fetchStats();
    this.setState({
      loadedInitialData: true,
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (!_.isEqual(props.location.query, this.props.location.query)) {
      this.fetchStats(props.location.query);
    }
  }

  render() {
    return this.state.loadedInitialData ? (
      <div>
        <div
          style={{
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}
        >
          <span style={{ position: 'relative' }}>
            {/* <RefreshIndicator size={150} top={20} left={0} status={this.state.refreshing ? 'loading' : 'hide'}/> */}
          </span>
        </div>

        <Query query={ALL_COUNTERS}>
          {({ loading, error, data }) => {
            if (loading) return <h1>Loading counters...</h1>;
            if (error) return <h1>Error fetching counters: {error}</h1>;

            return (
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  justifyContent: 'space-around',
                  padding: '0.5px',
                }}
              >
                <Counter
                  value={data.counters.activeLoos}
                  icon={<LooIcon />}
                  label="Active Loos"
                />
                <Counter
                  value={data.counters.inactiveLoos}
                  icon={<RemoveIcon />}
                  label="Removed Loos"
                />
                <Counter
                  value={data.counters.totalLoos}
                  icon={<StatIcon />}
                  label="Total Reports"
                />
                <Counter
                  value={data.counters.multipleReports}
                  icon={<RefreshIcon />}
                  label="Multiple Reports"
                />
                <Counter
                  value={data.counters.removalReports}
                  icon={<RemoveIcon />}
                  label="Removal Reports"
                />
              </div>
            );
          }}
        </Query>

        <GridList cols={2} cellHeight={200} padding={1}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <Location>
              {({ location }) =>
                location.state && (
                  <ListSubheader component="div">
                    <h2>Headline Counts</h2>
                    {`${moment(location.state.start).format(
                      'ddd, MMM Do YYYY'
                    )} to ${moment(location.state.end).format(
                      'ddd, MMM Do YYYY'
                    )} in ${location.state.area || location.state.areaType}`}
                  </ListSubheader>
                )
              }
            </Location>
          </GridListTile>
          <GridListTile rows={2} cols={1}>
            <Doughnut
              height={150}
              data={makeDoughnutData(
                ['public', 'restricted', 'unknown'],
                this.state.proportions['Public Loos']
              )}
            />
            <GridListTileBar
              titlePosition="bottom"
              title="Public Loos"
              subtitle="Loos marked for public use"
            />
          </GridListTile>
          <GridListTile rows={2} cols={1}>
            <Doughnut
              height={150}
              data={makeDoughnutData(
                ['open', 'closed'],
                this.state.proportions['Active Loos']
              )}
            />
            <GridListTileBar
              titlePosition="bottom"
              title="Closed Loos"
              subtitle="Loos marked as closed"
            />
          </GridListTile>
          <GridListTile rows={2} cols={1}>
            <Doughnut
              height={150}
              data={makeDoughnutData(
                ['acessible', 'inaccessible', 'unknown'],
                this.state.proportions['Accessible Loos']
              )}
            />
            <GridListTileBar
              titlePosition="bottom"
              title="Accessible Loos"
              subtitle="Loos marked as accessible"
            />
          </GridListTile>
          <GridListTile rows={2} cols={1}>
            <Doughnut
              height={150}
              data={makeDoughnutData(
                ['yes', 'no', 'unknown'],
                this.state.proportions['Baby Changing']
              )}
            />
            <GridListTileBar
              titlePosition="bottom"
              title="Baby Changing"
              subtitle="Loos with baby changing facilities"
            />
          </GridListTile>
        </GridList>
      </div>
    ) : (
      <h1>Loading</h1>
    );
  }
}

export default HeadlineStats;
