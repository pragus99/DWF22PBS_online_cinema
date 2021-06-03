import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";

import Attach from "../../assets/attachfilm.svg";
import Uploader from "../service/Uploader";
import { API } from "../service/api";
import Category from "../modal/Category";
import Modal from "../modal/Modal";

const Form = () => {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [filmUrl, setFilmUrl] = useState("");
  const [selectPic, setSelectPic] = useState(null);
  const [description, setDescription] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [preview, setPreview] = useState(null);

  const [message, setMessage] = useState("");

  const History = useHistory();

  let { data, refetch } = useQuery("cate", async () => {
    const response = await API.get("/category");
    return response.data.data;
  });

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      const fd = new FormData();
      fd.set("title", title);
      fd.set("filmUrl", filmUrl);
      fd.set("categoryId", categoryId);
      fd.set("price", price);
      fd.set("description", description);
      fd.append("thumbnail", selectPic);
      await API.post("/film", fd, config);
      History.push("/");
    } catch (error) {
      setMessage("Please fill all required fields");
      console.log(error);
    }
  };

  if (selectPic) {
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectPic);
  }

  const handleShowCategoryModal = () => {
    setShowCategoryModal(true);
  };
  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
  };

  return (
    <div>
      <Modal show={showCategoryModal} handleClose={handleCloseCategoryModal}>
        <Category refresh={refetch} handleClose={handleCloseCategoryModal} />
      </Modal>

      <div className="form-container">
        {message && (
          <div className="alert alert-danger py-1">
            <small>{message}</small>
          </div>
        )}
        <form className="form-mymodal addfilm-form" onSubmit={submitForm}>
          <div className="header-addfilm">
            <h2 className="addfilm-title text-white">Add Film</h2>
            <label onClick={handleShowCategoryModal} className="category-btn">
              Create Category
            </label>
          </div>
          <div className="title-upload">
            <input
              className="input-mymodal"
              type="text"
              required
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Uploader
              pictureSelected={(file) => setSelectPic(file.target.files[0])}
              button={
                <>
                  <label htmlFor="upload" className="attach-btn">
                    Attach Thumbnail
                    <img className="attach-add" src={Attach} alt="" />
                  </label>
                </>
              }
            />
          </div>

          {preview && (
            <div className="img-preview-film">
              <img src={preview} alt="icon" />
            </div>
          )}

          <select
            className="input-mymodal category"
            onClick={(e) => {
              setCategoryId(e.target.value);
            }}
            name="category"
          >
            <option disabled selected>
              Category
            </option>
            {data &&
              data.map((content, index) => (
                <option key={content.id + index} value={content.id}>
                  {content.name}
                </option>
              ))}
          </select>

          <input
            className="input-mymodal"
            type="number"
            required
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            className="input-mymodal"
            type="text"
            required
            placeholder="Link Film"
            value={filmUrl}
            onChange={(e) => setFilmUrl(e.target.value)}
          />
          <textarea
            className="input-mymodal description"
            type="text"
            required
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="container-fundbtn">
            <button className="addfilm-btn">Add Film</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
