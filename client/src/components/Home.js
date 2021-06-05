import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import Card from "./Card";
import LandingPage from "./landingPage";

import Loading from "../assets/Process.gif";
import Pagination from "./Pagination";
let socket;

const Home = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState([]);

  const loadFilms = async (socket) => {
    await socket.emit("get films");
    await socket.on("films", (data) => {
      setLoading(false);
      setFilms(data);
    });
  };
  useEffect(() => {
    socket = io("http://localhost:9000/films");
    loadFilms(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

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
      films &&
        films.filter((categories) => {
          var searchCategory = category.toLowerCase().substring(0, 3);
          var dataCategory = categories.category.name
            .substring(0, 3)
            .toLowerCase();
          var dataFilm = categories.title.substring(0, 3).toLowerCase();
          return (
            categories.category.name
              .toLowerCase()
              .includes(category.toLowerCase()) ||
            categories.title.toLowerCase().includes(category.toLowerCase()) ||
            checkName(dataFilm, searchCategory) ||
            checkName(dataCategory, searchCategory)
          );
        })
    );
  }, [category, films]);
  return (
    <div className="home">
      <div className="notfound">
        {loading && <img src={Loading} alt="Loading" />}
      </div>
      <LandingPage data={films} />
      <div className="header-listfilm">
        <h4 className="title-listfilm">List Film</h4>
        <input
          type="text"
          placeholder="Filter Film"
          className="searchbox home-search"
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="notfound">
        {loading && <img src={Loading} alt="Loading" />}
      </div>
      {filterCategory && filterCategory.length > 0 ? (
        <>
          <Pagination
            Card={Card}
            data={filterCategory}
            title="listFilms"
            limit={24}
          />
        </>
      ) : (
        <div className="nopost">
          <h1>No Film to display</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
