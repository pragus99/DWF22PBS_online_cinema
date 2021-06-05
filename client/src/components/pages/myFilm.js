import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import Card from "../Card";
import { API } from "../service/api";
import Loading from "../../assets/Process.gif";
import Pagination from "../Pagination";

const MyFilm = () => {
  const [category, setCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState([]);

  let { isLoading, data } = useQuery("usermyfilms", async () => {
    const response = await API.get("/my-films");
    return response.data.data;
  });

  let checkName = (name, str) => {
    var pattern = str
      .split("")
      .map((x) => {
        return `(?=.*${x})`;
      })
      .join("");
    var regex = new RegExp(`${pattern}`, "g");
    return name.match(regex);
  };

  useEffect(() => {
    setFilterCategory(
      data &&
        data.filter((categories) => {
          var searchCategory = category.toLowerCase().substring(0, 3);
          var dataCategory = categories.film.category.name
            .substring(0, 3)
            .toLowerCase();
          var dataFilm = categories.film.title.substring(0, 3).toLowerCase();
          return (
            categories.film.category.name
              .toLowerCase()
              .includes(searchCategory) ||
            categories.film.title.toLowerCase().includes(searchCategory) ||
            checkName(dataFilm, searchCategory) ||
            checkName(dataCategory, searchCategory)
          );
        })
    );
  }, [category, data]);
  return (
    <>
      <div className="header-myfilm">
        <h1>My List Film</h1>
        <input
          type="text"
          placeholder="Filter Film"
          className="searchbox"
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
      </div>

      {filterCategory && filterCategory.length > 0 ? (
        <>
          <Pagination
            Card={Card}
            data={filterCategory}
            title="myfilms"
            limit={42}
          />
        </>
      ) : (
        <div className="nopost">
          <h1>No Film to display</h1>
        </div>
      )}
    </>
  );
};

export default MyFilm;
