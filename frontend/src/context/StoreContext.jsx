import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  // const url = "https://fooddel-eta.vercel.app";

  const [token, setToken] = useState(null);
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});

  // ✅ Load token and cart on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && savedToken !== "undefined") {
      setToken(savedToken);
      loadCartData(savedToken);
    } else {
      const localCart = localStorage.getItem("cartItems");
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }

    fetchFoodList();
  }, []);

  // ✅ Save cart to localStorage if not logged in
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  // ✅ Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (err) {
      console.error("Error fetching food list:", err.message);
    }
  };

  // ✅ Load cart data from server
  const loadCartData = async (jwtToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const cartData = response.data?.cartData;
      if (cartData) {
        setCartItems(cartData);
        localStorage.removeItem("cartItems"); // ✅ Clear local cart backup
      } else {
        console.warn("No cart data received from server.");
      }
    } catch (error) {
      console.error("Failed to load cart:", error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  };

  // ✅ Add to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Add to cart error:", err.message);
      }
    }
  };

  // ✅ Remove from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Remove from cart error:", err.message);
      }
    }
  };

  // ✅ Total cart price
  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const item = food_list.find((food) => food._id === itemId);
      if (item) {
        total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;


// …or create a new repository on the command line
// echo "# food-web" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/Shivamkrtiwari55/food-web.git
// git push -u origin main
// …or push an existing repository from the command line
// git remote add origin https://github.com/Shivamkrtiwari55/food-web.git
// git branch -M main
// git push -u origin main