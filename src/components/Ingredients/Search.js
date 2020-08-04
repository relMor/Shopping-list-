import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        axios
          .get(
            "https://react-hooks-update-227d7.firebaseio.com/ingredients.json" +
              query
          )
          .then((response) => {
            const loadedIngredients = [];
            for (const key in response.data) {
              loadedIngredients.push({
                id: key,
                title: response.data[key].title,
                amount: response.data[key].amount,
              });
            }
            onLoadIngredients(loadedIngredients);
          })
          .catch((err) => console.log(err));
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
