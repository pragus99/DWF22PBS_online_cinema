import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { API } from "./service/api";
import { UserContext } from "./service/userContext";

import Default from "../assets/default.svg";
import Delete from "../assets/delete.svg";
import Loading from "../assets/Process.gif";

const Comment = () => {
  const [state] = useContext(UserContext);
  const { id } = useParams();
  const [text, setText] = useState("");

  let { isLoading, data, refetch } = useQuery("getcomment", async () => {
    const response = await API.get("/comments");
    return response.data.data;
  });

  const submitComment = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        personId: state.user.id,
        filmId: id,
        text: text,
      });
      await API.post("/comment/", body, config);
      refetch();
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (id, e) => {
    e.preventDefault();
    handleDelete.mutate(id);
  };

  const handleDelete = useMutation(async (id) => {
    await API.delete("/comment/" + id);
    refetch();
  });

  return (
    <div className="comment-container">
      <div className="form-container">
        <h4 className="comment-title">Leave a comment</h4>
        <form className="form-mymodal comment-form" onSubmit={submitComment}>
          <img
            className="img-comment"
            src={
              `http://localhost:9000/${state?.user?.avatar}` ===
              "http://localhost:9000/null"
                ? Default
                : `http://localhost:9000/${state?.user?.avatar}`
            }
            alt=""
          />
          <div className="addcomment">
            <div className="textarea">
              <textarea
                className="comment-input"
                name="text"
                type="text"
                required
                placeholder=" Add a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="comment-btn">
              Post Comment
            </button>
          </div>
        </form>
      </div>

      <div className="comments">
        {data &&
          data.map((item) =>
            item.filmId == id ? (
              <div className="comments-content" key={item.id}>
                <img
                  className="img-comment"
                  src={
                    `http://localhost:9000/${item.person.avatar}` ===
                    "http://localhost:9000/null"
                      ? Default
                      : `http://localhost:9000/${item.person.avatar}`
                  }
                  alt=""
                />
                <div className="comment-content">
                  <h6>
                    {item.person.fullName}
                    {item.person.is_admin === 1 ? (
                      <small className="mod">Admin</small>
                    ) : null}
                  </h6>
                  <p className="comment-text">{item.text}</p>
                  {state.user.id == item.personId || state.user.role == 1 ? (
                    <form
                      className="comment-formdelete"
                      onSubmit={(e) => deleteComment(item.id, e)}
                    >
                      <button
                        title="Delete comment"
                        className="comment-btndelete"
                        type="submit"
                      >
                        <img className="img-btndelete" src={Delete} alt="" />
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            ) : null
          )}
        <div className="notfound">
          {isLoading && <img src={Loading} alt="Loading" />}
        </div>
      </div>
    </div>
  );
};

export default Comment;
