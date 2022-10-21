import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useAuth from "./useAuth";
import findIndex from "lodash.findindex";
import Toast from "react-native-toast-message";
import useNotifications from "./useNotifications";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, url } = useAuth();
  const { newOrderNotification } = useNotifications();

  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const calculateNumberOfItems = (data) => {
    setNumberOfItems(0);
    data.map((item) => {
      setNumberOfItems((numberOfItems) => numberOfItems + item.quantity);
    });
  };

  const calculateTotal = (data) => {
    setTotal(0);
    data.map((item) => {
      setTotal((total) => total + item.price * item.quantity);
    });
  };

  const getCartItems = async () => {
    try {
      const res = await fetch(url + "/cartItems/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setCartItems(data);
      calculateNumberOfItems(data);
      calculateTotal(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const addToCart = async (product, size, quantity, note) => {
    try {
      const res = await fetch(url + "/addToCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          product,
          size,
          quantity,
          note,
        }),
      });

      const data = await res.json();

      setCart(data);
    } catch (e) {
      console.log(e.message);
    }
  };
  const updateQuantity = async (cartItem, q) => {
    try {
      const res = await fetch(url + "/updateQuantity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartItem.cartId,
          q,
        }),
      });

      const data = await res.json();

      const index = findIndex(cart, data.cartItem);

      if (index !== -1) {
        if (data.updatedItem === null) {
          cart.splice(index, 1);
        } else {
          cart[index] = data.updatedItem;
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const placeOrder = async (address) => {
    try {
      const res = await fetch(url + "/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          cart,
          total,
          address,
          date: new Date(),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.cart);
      } else {
        setCart([]);
        setCartItems([]);

        newOrderNotification();

        Toast.show({
          type: "success",
          text1: "Order placed successfully!",
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(url + "/clearCart/" + user.id, {
        method: "DELETE",
      });

      if (await res.json()) {
        setCart([]);
        getCartItems();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    const getCart = async () => {
      try {
        if (user) {
          const res = await fetch(url + "/cart/" + user.id, {
            method: "GET",
          });

          const data = await res.json();

          setCart(data);
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    if (user) {
      getCart();
      getCartItems();
    }
  }, [user]);

  const memoedValue = useMemo(
    () => ({
      cart,
      cartItems,
      numberOfItems,
      total,
      error,
      addToCart,
      updateQuantity,
      getCartItems,
      clearCart,
      placeOrder,
      setError,
    }),
    [cart, cartItems, numberOfItems, total, error]
  );
  return (
    <CartContext.Provider value={memoedValue}>{children}</CartContext.Provider>
  );
};

export default function useCart() {
  return useContext(CartContext);
}
