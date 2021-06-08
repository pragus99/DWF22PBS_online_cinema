import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import Uploader from "../service/Uploader";
import Attach from "../../assets/attach.svg";
import { UserContext } from "../service/userContext";
import convert from "../service/convert";
import { API } from "../service/api";

const Buy = ({ filmid, judul, refresh, price }) => {
  const [state] = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState(null);

  const [message, setMessage] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [popUp, setPopUp] = useState(false);

  const popUpOpen = () => setPopUp(true);
  const popUpClose = () => setPopUp(false);

  const [form, setForm] = useState({
    personId: state?.user?.id,
    filmId: filmid,
    title: judul,
    status: "pending",
    accountNumber: "",
    selectPic: null,
  });

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      const fd = new FormData();
      fd.set("personId", form.personId);
      fd.set("filmId", form.filmId);
      fd.set("title", form.title);
      fd.set("status", form.status);
      fd.set("accountNumber", form.accountNumber);
      fd.append("transferProof", form.selectPic);
      console.log(form.filmId);
      await API.post(`/transaction`, fd, config);
      setForm({
        personId: state.user.id,
        filmId: filmid,
        status: "pending",
        accountNumber: "",
        selectPic: null,
      });
      refresh();
      setMessage("");

      handleClose();
      popUpOpen();
    } catch (error) {
      console.log(error);
      setMessage("Please select image to upload");
    }
  };

  if (form.selectPic) {
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(form.selectPic);
  }

  return (
    <>
      <button className="btn-mymodal btn-buy" onClick={handleShow}>
        Bank Transfer
      </button>

      <Modal centered show={popUp} onHide={popUpClose}>
        <div className="modal-content">
          <div className="mymodal mymodal-pay popup">
            <p className="popup-afterbuy">
              Thank you for buying this film, please wait 1x24 hours because
              your transaction is in process
            </p>
          </div>
        </div>
      </Modal>

      <Modal centered show={show} onHide={handleClose}>
        <div className="modal-content">
          <div className="mymodal mymodal-pay">
            <p className="title-account-pay">
              Cinema<i className="online-pay">Online</i> : 0938122323
            </p>

            <p className="title-film-modal-pay">{judul}</p>

            <p className="total-pay">
              Total : <small className="cost-pay">Rp. {convert(price)}</small>
            </p>
            {message && (
              <div className="alert alert-danger py-1">
                <small>{message}</small>
              </div>
            )}
            <form className="form-mymodal form-pay" onSubmit={handleDonation}>
              <input type="hidden" name="title" value={form.title} />
              <input type="hidden" name="personId" value={form.personId} />
              <input type="hidden" name="filmId" value={form.filmId} />
              <input type="hidden" name="status" value={form.status} />
              <input
                className="input-pay"
                type="number"
                name="accountNumber"
                required
                placeholder="Input Your Account Number"
                value={form.accountNumber}
                onChange={(e) => onChange(e)}
              />
              <div className="mymodal-payment">
                <Uploader
                  pictureSelected={(file) => onChange(file)}
                  button={
                    <label htmlFor="upload" className="btn-payment">
                      Attach Payment{" "}
                      <img className="attach-pay" src={Attach} alt="" />
                    </label>
                  }
                />

                <p className="text-payment">
                  *transfers can be made to holyways accounts
                </p>
              </div>
              {preview && (
                <div className="img-preview-buy">
                  <img src={preview} alt="icon" />
                </div>
              )}
              <button className="btn-pay">Pay</button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Buy;
