import Img from "../assets/404 Error with a cute animal.gif";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notfound">
      <img src={Img} alt="" />
      <p>
        Go back to <Link to="/"> Home</Link>
      </p>
    </div>
  );
};

export default NotFound;
