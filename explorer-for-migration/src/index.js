import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@reach/router';
import {
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

import { onError } from '@apollo/link-error';
import { setContext } from '@apollo/link-context';

import AuthProvider from './Auth';
import AppLayout from './components/AppLayout';
import Home from './components/Home';
import Statistics from './components/Statistics';
import HeadlineStats from './components/stats/HeadlineStats';
import AreaComparisonStats from './components/stats/AreaComparisonStats';
import Search from './components/Search';
import LooView from './components/LooView';
import AuthCallback from './components/AuthCallback';

import * as serviceWorker from './serviceWorker';
import { version } from '../package.json';

import './css/index.css';

const httpLink = new HttpLink({
  uri: '/graphql',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

ReactDOM.render(
  <AuthProvider>
    {(auth) => {
      const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: auth.isAuthenticated()
              ? `Bearer ${auth.getAccessToken()}`
              : '',
          },
        };
      });

      const cache = new InMemoryCache({
        typePolicies: {
          Loo: {
            keyFields(obj, context) {
              // We specify this explicitally in case Apollo change how ids are autogenerated
              // in the future
              return 'Loo:' + obj.id;
            },
          },
        },
      });

      const client = new ApolloClient({
        name: '@toiletmap/explorer',
        version: version,
        link: ApolloLink.from([errorLink, authLink, httpLink]),
        connectToDevTools: true,
        cache,
      });

      return (
        <ApolloProvider client={client}>
          <Router>
            <AppLayout path="/explorer">
              <Home default path="home" />
              <AuthCallback path="callback" />
              <Search path="search" />
              <LooView path="loos/:id" />
              <Statistics path="statistics">
                <HeadlineStats default />
                <AreaComparisonStats path="areas" />
              </Statistics>
            </AppLayout>
          </Router>
        </ApolloProvider>
      );
    }}
  </AuthProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
