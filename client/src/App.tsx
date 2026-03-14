import { Route, Switch } from "wouter";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
export default function App() {
  return (<Switch><Route path="/login" component={Login} /><Route path="/" component={Dashboard} /><Route>404 Not Found</Route></Switch>);
}
