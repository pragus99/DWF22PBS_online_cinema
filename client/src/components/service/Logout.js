import { useContext } from "react";
import { UserContext } from "../service/userContext";
import { useHistory } from "react-router-dom";

const Logout = () => {
  const history = useHistory();
  const [, dispatch] = useContext(UserContext);
  return [dispatch({ type: "logout" }), history.push("/")];
};

export default Logout;
