import { Carousel } from "react-bootstrap";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import convert from "./service/convert";
import { UserContext } from "./service/userContext";
import Modal from "./modal/Modal";
import Login from "./modal/Login";
import Register from "./modal/Register";

const Page = ({ data }) => {
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
      <div>
        <Modal show={showLogin} handleClose={handleCloseLogin}>
          <Login toggle={toggleToRegister} handleClose={handleCloseLogin} />
        </Modal>
        <Modal show={showRegister} handleClose={handleCloseRegister}>
          <Register toggle={toggleToLogin} handleClose={handleCloseLogin} />
        </Modal>
      </div>

      <div className="container-landing-page">
        <div className="container-carousel">
          <Carousel
            prevLabel={null}
            nextLabel={null}
            className="carousel-container"
            pause="hover"
            fade
          >
            {data.map((item, index) => (
              <Carousel.Item key={item.title + item.category + index}>
                <img
                  className="carousel-img"
                  src={`http://localhost:9000/${item.thumbnail}`}
                  alt="First slide"
                />
                <div className="content-carousel">
                  <div className="content-carousel-item">
                    <h1>{item.title}</h1>
                    <h6>{item.category.name}</h6>
                    <h6>Rp. {convert(item.price)}</h6>
                    <p>{item.description}</p>
                  </div>
                  {state.login ? (
                    <Link className="btn-carousel" to={`detail/${item.id}`}>
                      <button className="btn-carousel">
                        {state?.user?.role === 0 ? "Buy Now" : "Detail"}
                      </button>
                    </Link>
                  ) : (
                    <button onClick={handleShowLogin} className="btn-carousel">
                      Buy Now
                    </button>
                  )}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default Page;
