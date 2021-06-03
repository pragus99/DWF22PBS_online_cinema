import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./userContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [state] = useContext(UserContext);

  const { login } = state;

  return (
    <div>
      <Route
        {...rest}
        render={(props) =>
          login ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    </div>
  );
};

export default PrivateRoute;
