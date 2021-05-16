import {
  Card,
  CircularProgress,
  createMuiTheme,
  CssBaseline,
  Typography,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { lazy, Suspense, useState } from "react";
import { useCookies } from "react-cookie";
import { Route, Switch, useHistory } from "react-router-dom";
import Header from "./components/Header";

const Dash = lazy(() => import("./pages/Dash"));
const Login = lazy(() => import("./pages/Login"));
const Roles = lazy(() => import("./pages/RolesPage"));
const Hosts = lazy(() => import("./pages/HostsPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const Host = lazy(() => import("./pages/Host"));
const User = lazy(() => import("./pages/User"));

const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});
const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
});

function Loading() {
  return (
    <Card className="card" style={{ textAlign: "center" }}>
      <Typography variant="h3">Loading...</Typography>
      <CircularProgress style={{ width: "10%", height: "10%" }} />
    </Card>
  );
}
function App() {
  const [darkMode, setDarkMode] = useState(darkThemeMq.matches);
  darkThemeMq.addEventListener("change", (evt) => {
    setDarkMode(evt.matches);
  });
  const history = useHistory();
  const [cookies] = useCookies();
  if (!cookies.id && history.location.pathname !== "/") {
    history.push("/");
  }
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Header />
      <Switch>
        <Route exact path="/">
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        </Route>
        <Route exact path="/dash">
          <Suspense fallback={<Loading />}>
            <Dash />
          </Suspense>
        </Route>
        <Route exact path="/roles">
          <Suspense fallback={<Loading />}>
            <Roles />
          </Suspense>
        </Route>
        <Route exact path="/hosts">
          <Suspense fallback={<Loading />}>
            <Hosts />
          </Suspense>
        </Route>
        <Route exact path="/users">
          <Suspense fallback={<Loading />}>
            <UsersPage />
          </Suspense>
        </Route>
        <Route exact path="/host/:id">
          <Suspense fallback={<Loading />}>
            <Host />
          </Suspense>
        </Route>
        <Route exact path="/user/:id">
          <Suspense fallback={<Loading />}>
            <User />
          </Suspense>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
