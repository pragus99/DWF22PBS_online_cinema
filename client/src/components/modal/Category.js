import { useState } from "react";

import { API } from "../service/api";

const Category = ({ handleClose, refresh }) => {
  const [title, setTitle] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        name: title,
      });
      await API.post(`/category`, body, config);
      refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form className="category-container" onSubmit={submitForm}>
        <h2 className="createcategory-title text-white">Create Category</h2>
        <input
          className="input-createcategory"
          type="text"
          required
          placeholder="Title Category"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="createcategory-btn">Create Category</button>
      </form>
    </div>
  );
};

export default Category;
