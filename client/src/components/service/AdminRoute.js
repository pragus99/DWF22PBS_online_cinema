import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./userContext";

const AdminRoute = ({ component: Component, ...rest }) => {
  const [state] = useContext(UserContext);
  const { admin } = state;

  return (
    <div>
      <Route
        {...rest}
        render={(props) =>
          admin ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    </div>
  );
};

export default AdminRoute;
