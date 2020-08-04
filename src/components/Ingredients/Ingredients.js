import React, { useCallback, useReducer, useMemo } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get here!");
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorData };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("Should not get here!");
  }
};

const Ingredients = (props) => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    axios
      .post(
        "https://react-hooks-update-227d7.firebaseio.com/ingredients.json",
        ingredient
      )
      .then((response) => {
        // setIsLoading(false);
        dispatchHttp({ type: "RESPONSE" });
        //   setUserIngredients((prevIngredients) => [
        //     ...prevIngredients,
        //     { id: response.data.name, ...ingredient },
        //   ]);
        dispatch({
          type: "ADD",
          ingredient: { id: response.data.name, ...ingredient },
        });
      })
      .catch((err) => {
        //setError("Something went wrong!");
        dispatchHttp({ type: "ERROR", errorData: "Something went wrong!" });
      });
  }, []);

  const removeIngredientHandler = useCallback((ingredientId) => {
    //setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    axios
      .delete(
        `https://react-hooks-update-227d7.firebaseio.com/ingredients/${ingredientId}.json`
      )
      .then((response) => {
        //setIsLoading(false);
        dispatchHttp({ type: "RESPONSE" });
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        // );
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((err) => {
        //setError("Something went wrong!")
        dispatchHttp({ type: "ERROR", errorData: "Something went wrong!" });
      });
  }, []);

  const clearError = useCallback(() => {
    //setError(null);
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const ingredientsList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientsList}
      </section>
    </div>
  );
};

export default Ingredients;
