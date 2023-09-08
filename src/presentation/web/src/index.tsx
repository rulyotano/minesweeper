import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppState, Auth0Provider, Auth0ProviderOptions } from "@auth0/auth0-react";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import createTheme from "@material-ui/core/styles/createTheme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import CssBaseline from "@material-ui/core/CssBaseline";
import configureStore from "./store/configureStore";
import Root from "./components/Root";
import registerServiceWorker from "./registerServiceWorker";
import "./styles/global";
import { dark } from "./theme";
import { authConfig } from "./settings";

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

const baseTheme = createTheme(dark);

const onRedirectCallback = (appState: AppState | undefined) => {
  history.push(appState?.returnTo ?? window.location.pathname);
};

const providerConfig: Auth0ProviderOptions = {
  useRefreshTokens: true,
  cacheLocation: "localstorage", 
  domain: authConfig.domain,
  clientId: authConfig.clientId,
  onRedirectCallback,
  useRefreshTokensFallback: true,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: authConfig.audience,
  },
};

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={baseTheme}>
      <Auth0Provider {...providerConfig}>
        <CssBaseline />
        <ConnectedRouter history={history}>
          <Root />
        </ConnectedRouter>
      </Auth0Provider>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
