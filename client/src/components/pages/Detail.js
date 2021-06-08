/* eslint-disable eqeqeq */
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactPlayer from "react-player/youtube";

import Buy from "../modal/Buy";
import Comment from "../Comment";

import convert from "../service/convert";
import { API } from "../service/api";

import Loading from "../../assets/Process.gif";
import { UserContext } from "../service/userContext";
import Snap from "../modal/Snap";

const Detail = () => {
  const [state] = useContext(UserContext);
  const { id } = useParams();
  const [popUp, setPopUp] = useState(false);

  const popUpOpen = () => setPopUp(true);
  const popUpClose = () => setPopUp(false);

  let { data, isLoading, refetch } = useQuery("filmdetail", async () => {
    const response = await API.get("/film/" + id);
    return response.data.data.film;
  });

  if (state.user.transaction) {
    var filmAproove = state.user.transaction.filter((obj) => {
      return obj.status === "approve";
    });

    var playFilm = filmAproove.filter((obj) => {
      return obj.filmId == id;
    });
  }

  return (
    <>
      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
      </div>

      <Modal centered show={popUp} onHide={popUpClose}>
        <div className="modal-content">
          <div className="mymodal mymodal-pay popup">
            <p>
              Please buy this film with bank transfer or midtrans payment if you
              want to watch
            </p>
          </div>
        </div>
      </Modal>

      {data && (
        <div className="container-detail">
          <div className="container-detail-img">
            <img
              className="detail-img"
              src={`http://localhost:9000/${data.thumbnail}`}
              alt="poster film"
            />
          </div>
          <div className="container-detail-film">
            <div className="detail-header">
              <h1>{data.title}</h1>
              {state?.user?.role === 0 ? (
                playFilm && playFilm.length === 1 ? null : (
                  <>
                    <Snap data={data} />
                    <Buy
                      refresh={refetch}
                      price={data.price}
                      filmid={id}
                      judul={data.title}
                    />
                  </>
                )
              ) : (
                <Link
                  className="btn-mymodal btn-updatefilm"
                  to={`/updateform/${id}`}
                >
                  Update Film
                </Link>
              )}
            </div>
            <div className="detail-film">
              <div className="detail-video">
                {state?.user?.role === 0 ? (
                  playFilm && playFilm.length === 1 ? (
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      light={`http://localhost:9000/${data.thumbnail}`}
                      controls={true}
                      url={data.filmUrl}
                    />
                  ) : (
                    <img
                      onClick={() => popUpOpen()}
                      className="detail-blockvideo"
                      src={`http://localhost:9000/${data.thumbnail}`}
                      alt=""
                    />
                  )
                ) : (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    light={`http://localhost:9000/${data.thumbnail}`}
                    controls={true}
                    url={data.filmUrl}
                  />
                )}
              </div>

              <div className="detail-content">
                <p>{data.category.name}</p>
                <p>Rp. {convert(data.price)}</p>
                <p>{data.description}</p>
              </div>
            </div>
            <Comment />
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
