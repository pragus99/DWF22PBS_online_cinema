import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import { UserContext } from "./service/userContext";
import Modal from "./modal/Modal";
import Login from "./modal/Login";
import Register from "./modal/Register";

const Card = ({ home, myfilms }) => {
  const [state] = useContext(UserContext);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };
  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const toggleToRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const toggleToLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  return (
    <>
      <Modal show={showLogin} handleClose={handleCloseLogin}>
        <Login toggle={toggleToRegister} handleClose={handleCloseLogin} />
      </Modal>
      <Modal show={showRegister} handleClose={handleCloseRegister}>
        <Register toggle={toggleToLogin} handleClose={handleCloseLogin} />
      </Modal>

      {home &&
        home.map((content, index) => (
          <div key={content.id + index}>
            {state.login ? (
              <Link to={`/detail/${content.id}`}>
                <img
                  className="mycard-img"
                  src={`http://localhost:9000/${content.thumbnail}`}
                  alt=""
                />
              </Link>
            ) : (
              <Link onClick={handleShowLogin}>
                <img
                  className="mycard-img"
                  src={`http://localhost:9000/${content.thumbnail}`}
                  alt=""
                />
              </Link>
            )}
          </div>
        ))}

      {myfilms &&
        myfilms.map((content, index) =>
          content.personId === state?.user?.id ? (
            <div key={content.personId + index}>
              <Link title={content.personId} to={`/detail/${content.film.id}`}>
                <img
                  className="mycard-img"
                  src={`http://localhost:9000/${content.film.thumbnail}`}
                  alt=""
                />
              </Link>
            </div>
          ) : null
        )}
    </>
  );
};

export default Card;
