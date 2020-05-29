import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import NotFound from './pages/404';

import Tracking from './components/Tracking';
import PageLoading from './components/PageLoading';

import history from './history';
import Router from './Router';
// import AuthProvider from './Auth';
import App from './App';

const Explorer = lazy(() =>
  import(/*webpackChunkName: 'explorer'*/ './explorer')
);
const AddPage = lazy(() =>
  import(/*webpackChunkName: 'add'*/ './pages/AddPage')
);
const EditPage = lazy(() =>
  import(/*webpackChunkName: 'edit'*/ './pages/EditPage')
);
const RemovePage = lazy(() =>
  import(/*webpackChunkName: 'remove'*/ './pages/RemovePage')
);

const AboutPage = lazy(() =>
  import(/*webpackChunkName: 'about'*/ './pages/AboutPage')
);
const ContactPage = lazy(() =>
  import(/*webpackChunkName: 'contact'*/ './pages/ContactPage')
);
const ContributePage = lazy(() =>
  import(/*webpackChunkName: 'contribute'*/ './pages/ContributePage')
);
const UseOurLoosPage = lazy(() =>
  import(/*webpackChunkName: 'uol'*/ './pages/UseOurLoosPage')
);
const PrivacyPage = lazy(() =>
  import(/*webpackChunkName: 'privacy'*/ './pages/PrivacyPage')
);
const CookiesPage = lazy(() =>
  import(/*webpackChunkName: 'cookies'*/ './pages/CookiesPage')
);

ReactDOM.render(
  <App>
    <Router history={history} forceRefresh={false}>
      <Tracking />
      <Suspense fallback={<PageLoading />}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <ProtectedRoute path="/loos/add" component={AddPage} />
          <Route path="/loos/:id" exact component={HomePage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/cookies" component={CookiesPage} />
          <Route exact path="/privacy" component={PrivacyPage} />
          <Route exact path="/use-our-loos" component={UseOurLoosPage} />
          <Route exact path="/contact" component={ContactPage} />
          <Route
            path="/contribute"
            render={(props) => <ContributePage {...props} />}
          />
          <Router
            path="/login"
            render={() => <Redirect to="/contribute" />}
          />
          <Route
            path="/map/:lng/:lat"
            render={(props) => <MapPage {...props} />}
          />
          <Route
            exact
            path="/callback"
            render={(props) => <AuthCallback {...props} />}
          />
          <Route
            path="/explorer"
            render={(props) => <Explorer {...props} />}
          />
          <ProtectedRoute path="/loos/:id/edit" component={EditPage} />
          <ProtectedRoute path="/loos/:id/remove" component={RemovePage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Router>
  </App>,
  document.getElementById('root')
);
