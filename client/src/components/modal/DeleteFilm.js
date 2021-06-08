import { useMutation } from "react-query";
import { API } from "../service/api";

const DeleteFilm = ({ filmid, title, refresh, handleClose }) => {
  const deleteById = async (filmid) => {
    handleDelete.mutate(filmid);
  };

  const handleDelete = useMutation(async (id) => {
    await API.delete(`/film/${id}`);
    refresh();
    handleClose();
    window.location.reload();
  });

  return (
    <div>
      <form
        className="category-container alertdelete-container"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="createcategory-title text-white">
          Delete <span className="alert-title">{title}</span> Film
        </h2>
        <p className="alertdelete-text">
          Are you sure want to delete{" "}
          <span className="alert-title">{title}</span> film ?
        </p>
        <div className="container-alertbtn">
          <button onClick={() => deleteById(filmid)} className="yesdelete-btn">
            Delete
          </button>
          <button onClick={() => handleClose()} className="nodelete-btn">
            No
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteFilm;
