import { useState, useContext } from "react";
import { API, setAuthToken } from "../service/api";
import { UserContext } from "../service/userContext";

const Login = ({ toggle, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [, dispatch] = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = JSON.stringify({ email, password });
      const response = await API.post("/login", body, config);

      setMessage(response.data.message);
      setAuthToken(response.data.data.user.token);

      if (response.data.data.user.role === 0) {
        dispatch({
          type: "login",
          payload: response.data.data.user,
        });
      } else {
        dispatch({
          type: "admin",
          payload: response.data.data.user,
        });
      }
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="modal-content">
        <div className="mymodal">
          <h2 className="title-mymodal">Login</h2>
          {message && (
            <div className="alert alert-danger py-1">
              <small>{message}</small>
            </div>
          )}
          <form className="form-mymodal" onSubmit={handleLogin}>
            <input
              className="input-mymodal"
              type="text"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input-mymodal"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-mymodal">Login</button>
          </form>
          <p className="text-mymodal">
            Don't have an account ? Click{" "}
            <label onClick={toggle} className="text-here">
              here
            </label>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
