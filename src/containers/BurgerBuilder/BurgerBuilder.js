import React, { Component } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal.js";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 2,
  bacon: 1,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 8.9,
    purchasable: true,
    purchasing: false,
    loading: false,
  };

  addIngredientHandler = (type) => {
    const oldCounter = this.state.ingredients[type];
    const updatedCounter = oldCounter + 1;

    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCounter;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
  };

  componentDidMount() {
    axios
      .get(
        "https://react-burgerapp-33d05-default-rtdb.firebaseio.com/ingredients.json"
      )
      .then((response) => {
        this.setState({ ingredients: response.data });
      });
  }

  removeIngredientHandler = (type) => {
    const oldCounter = this.state.ingredients[type];
    if (oldCounter >= 1) {
      const updatedCounter = oldCounter - 1;
      const updatedIngredients = {
        ...this.state.ingredients,
      };
      updatedIngredients[type] = updatedCounter;

      const priceAddition = INGREDIENT_PRICES[type];
      const oldPrice = this.state.totalPrice;
      const newPrice = oldPrice - priceAddition;
      this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
    }
  };

  sendBurgerInfo = () => {
    this.setState({
      loading: true,
    });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Adam",
        email: "test@test.com",
        address: {
          street: "Dubai Marina ",
          zipCode: "00000",
          country: "UAE",
        },
      },
    };
    axios
      .post("./orders.json", order)
      .then((response) => {
        alert("Your order has been sent to the kitchen");
        this.setState({
          loading: false,
          purchasing: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          purchasing: false,
        });
      });
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandle = () => {
    this.sendBurgerInfo();
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = this.state.ingredients[key] <= 0;
    }
    let orderSummary = null;

    if (this.state.loading) {
      orderSummary = <Spinner></Spinner>;
    }
    let burger = <Spinner></Spinner>;

    if (this.state.ingredients) {
      burger = (
        <>
          <Burger ingredients={this.state.ingredients}></Burger>
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
          ></BuildControls>
        </>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandle}
        ></OrderSummary>
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner></Spinner>;
    }

    return (
      <>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </>
    );
  }
}

export default BurgerBuilder;
