import React, { Component } from 'react';
import { HashRouter, Route, Switch, Router } from 'react-router-dom';
import { TOKEN } from './constants/AppConst';
import { GetCurrentUser } from './actions/authActions';
import agent from './agent';
// import { renderRoutes } from 'react-router-config';
import { history } from "./history";
import { connect } from 'react-redux';
import './App.scss';
import 'antd/dist/antd.css';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

const mapDispatchToProps = dispatch => ({
  
  onLoad: (payload, token) =>
    dispatch({ type: "APP_LOAD", payload, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: "REDIRECT" }),
  // hasError: () =>
  //   dispatch({ type: HAS_ERROR }),
});

const mapStateToProps = state => {
  return {
    appLoaded: state.commonReducer.appLoaded,
    appName: state.commonReducer.appName,
    currentUser: state.commonReducer.currentUser,
    redirectTo: state.commonReducer.redirectTo
  }
};


class App extends Component {

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      // store.dispatch(push(nextProps.redirectTo));
      history.push(nextProps.redirectTo);
      this.props.onRedirect();
    }
  }


  componentWillMount() {
    console.log(this.props);
    const _token = window.localStorage.getItem(TOKEN);
    let payload = null;
    if (_token) {
      agent.setToken(_token); 
      agent.Auth.current(_token).then(data=>{
        console.log(data);
        payload = data.data;
        this.props.onLoad(payload, _token);
      });
    } else {
      payload = null;
      this.props.onLoad(payload, '');
    }
    // this.props.onLoad(payload, _token);
  }

  render() {
    return (
      <Router history={history}>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </Router>
    );
  }
}

// export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);