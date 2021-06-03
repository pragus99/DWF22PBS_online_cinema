import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";

import { API } from "../service/api";
import dateConvert from "../service/dateConvert";
import convert from "../service/convert";

import Default from "../../assets/default.svg";
import ServerError from "../../assets/500 Internal Server Error.gif";
import Loading from "../../assets/Process.gif";

function Profile() {
  const { id } = useParams();
  let { isLoading, error, data } = useQuery("user", async () => {
    const response = await API.get("/profile/" + id);
    return response.data.data.person;
  });

  return (
    <>
      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
        {error && (
          <>
            <img src={ServerError} alt="server error. can't fetch data" />
          </>
        )}
      </div>

      {data && (
        <div className="container-profile">
          <div className="profile">
            <h1>My Profile</h1>
            <div className="profile-detail">
              <div className="profile-img">
                <img
                  src={
                    data.avatar
                      ? `http://localhost:9000/${data.avatar}`
                      : Default
                  }
                  alt="#"
                />
                <Link to={`/updateprofile/${id}`}>
                  <label className="btn-profile">Update Profile</label>
                </Link>
              </div>

              <div className="profile-content">
                <h6>Full Name</h6>
                <p>{data.fullName}</p>
                <h6>Email</h6>
                <p>{data.email}</p>
                <h6>Phone</h6>
                <p>{data.phone}</p>
              </div>
            </div>
          </div>

          <div className="transactions">
            <h1>History Transaction</h1>
            <div className="list-transaction">
              {data.transaction.map((content) => (
                <div className="transaction" key={content.id}>
                  <div className="transaction-body">
                    <h3>{content.film.title}</h3>
                    <p>{dateConvert(content.createdAt)}</p>
                  </div>
                  <div className="transaction-footer">
                    <p>Total : Rp {convert(content.film.price)}</p>
                    {content.status === "approve" ? (
                      <p className="condition">Finished</p>
                    ) : null}
                    {content.status === "pending" ? (
                      <p className="pending">Pending</p>
                    ) : null}
                    {content.status === "cancel" ? (
                      <p className="cancel">Cancel</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
