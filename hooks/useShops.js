import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useAuth from "./useAuth";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { url, user } = useAuth();

  const [shops, setShops] = useState([]);
  const [userShops, setUserShops] = useState([]);
  const [categories, setCategories] = useState([]);

  const getUserShops = () => {
    setUserShops(shops.filter((shop) => shop.owner_id === user.id));
  };

  const getShops = async () => {
    try {
      const res = await fetch(url + "/shops", {
        method: "GET",
      });

      const data = await res.json();

      setShops(data);
      getUserShops();
    } catch (err) {
      console.log(err);
    }
  };

  const getShop = async (shopId) => {
    try {
      const res = await fetch(url + "/shop/" + shopId, {
        method: "GET",
      });

      return await res.json();
    } catch (e) {
      console.log(e.message);
    }
  };

  const getCategories = async () => {
    try {
      const res = await fetch(url + "/categories", {
        method: "GET",
      });

      const data = await res.json();

      setCategories(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateShop = async (
    shopId,
    name,
    email,
    phone,
    description,
    category,
    logo
  ) => {
    try {
      const res = await fetch(url + "/updateShop", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          name,
          email,
          phone,
          description,
          category,
          logo,
        }),
      });

      return await res.json();
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (user) {
      getShops();
      getUserShops();
    }
  }, [user, shops]);

  useEffect(() => {
    getCategories();
  }, []);

  // useEffect(() => {
  //   if(user) {
  //     getShops();
  //     getUserShops();
  //   }
  // }, [shops]);

  const memoedValue = useMemo(
    () => ({
      shops,
      userShops,
      setShops,
      categories,
      getShops,
      getShop,
      getUserShops,
      updateShop,
    }),
    [shops, userShops, categories]
  );
  return (
    <ShopContext.Provider value={memoedValue}>{children}</ShopContext.Provider>
  );
};

export default function useShops() {
  return useContext(ShopContext);
}
