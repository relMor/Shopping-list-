import React, { useState } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = (props) => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = (ingredient) => {
    axios
      .post(
        "https://react-hooks-update-227d7.firebaseio.com/ingredients.json",
        ingredient
      )
      .then((response) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: response.data.name, ...ingredient },
        ]);
      })
      .catch((err) => console.log(err));
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
