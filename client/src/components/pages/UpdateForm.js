import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import Uploader from "../service/Uploader";
import { API } from "../service/api";
import Modal from "../modal/Modal";

import Loading from "../../assets/Process.gif";
import DeleteFilm from "../modal/DeleteFilm";

const UpdateForm = () => {
  const History = useHistory();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  let { data, isLoading, refetch } = useQuery("updatefilm", async () => {
    const response = await API.get("/film/" + id);
    return response.data.data.film;
  });

  let { data: category } = useQuery("categoryupdate", async () => {
    const response = await API.get("/category");
    return response.data.data;
  });

  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    description: "",
    price: "",
    filmUrl: "",
    selectPic: null,
  });

  useEffect(() => {
    data &&
      setForm({
        title: data.title,
        categoryId: data.category.id,
        filmUrl: data.filmUrl,
        price: data.price,
        description: data.description,
        selectPic: null,
      });
  }, [data]);

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const update = async (e) => {
    e.preventDefault();
    try {
      if (form.selectPic) {
        const config = {
          headers: {
            "Content-type": "multipart/form-data",
          },
        };
        const fd = new FormData();
        fd.set("title", form.title);
        fd.set("categoryId", form.categoryId);
        fd.set("price", form.price);
        fd.set("filmUrl", form.filmUrl);
        fd.set("description", form.description);
        fd.append("thumbnail", form.selectPic);
        await API.patch(`/film/${id}`, fd, config);
        History.go(-1);
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        title: form.title,
        categoryId: form.categoryId,
        price: form.price,
        filmUrl: form.filmUrl,
        description: form.description,
      });
      await API.patch(`/film/${id}`, body, config);
      History.go(-1);
    } catch (error) {
      setMessage("Please fill all required fields");

      console.log(error);
    }
  };

  if (form.selectPic) {
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(form.selectPic);
  }

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div>
      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
      </div>

      <div>
        <Modal show={showDeleteModal} handleClose={handleCloseDeleteModal}>
          {data && (
            <DeleteFilm
              title={data.title}
              filmid={id}
              refresh={refetch}
              handleClose={handleCloseDeleteModal}
            />
          )}
        </Modal>

        <div className="form-container">
          {message && (
            <div className="alert alert-danger py-1">
              <small>{message}</small>
            </div>
          )}
          <form className="form-mymodal addfilm-form" onSubmit={update}>
            <div className="header-addfilm">
              <h2 className="addfilm-title text-white">Update Film</h2>
              <label onClick={handleShowDeleteModal} className="category-btn">
                Delete Film
              </label>
            </div>

            <div className="title-upload">
              <input
                className="input-mymodal"
                name="title"
                type="text"
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => onChange(e)}
              />

              <Uploader
                pictureSelected={(e) => onChange(e)}
                button={
                  <>
                    <label htmlFor="upload" className="attach-btn">
                      Attach Thumbnail
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
                onChange(e);
              }}
              name="categoryId"
            >
              <option disabled>Category</option>
              {category &&
                category.map((content, index) => (
                  <option
                    key={content.id + index}
                    value={content.id}
                    selected={content.id === data.category.id ? true : false}
                  >
                    {console.log(form.categoryId)}
                    {content.name}
                  </option>
                ))}
            </select>

            <input
              className="input-mymodal"
              name="price"
              type="number"
              required
              placeholder="Price"
              value={form.price}
              onChange={(e) => onChange(e)}
            />
            <input
              className="input-mymodal"
              name="filmUrl"
              type="text"
              required
              placeholder="Link Film"
              value={form.filmUrl}
              onChange={(e) => onChange(e)}
            />
            <textarea
              className="input-mymodal description"
              name="description"
              type="text"
              required
              placeholder="Description"
              value={form.description}
              onChange={(e) => onChange(e)}
            ></textarea>
            <div className="container-fundbtn">
              <button className="addfilm-btn">Update Film</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
