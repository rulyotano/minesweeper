import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { createMuiTheme, MuiThemeProvider as ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import configureStore from "./store/configureStore";
import Root from "./components/Root";
import registerServiceWorker from "./registerServiceWorker";
import "./styles/global";
import defaultTheme from "./theme";

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

const baseTheme = createMuiTheme(defaultTheme);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <ConnectedRouter history={history}>
        <Root />
      </ConnectedRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
