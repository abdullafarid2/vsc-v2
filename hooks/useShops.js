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
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [userShops, setUserShops] = useState([]);

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

  useEffect(() => {
    getShops();
    getUserShops();
    setLoadingInitial(false);
  }, []);

  useEffect(() => {
    getShops();
    getUserShops();
  }, [shops]);

  const memoedValue = useMemo(
    () => ({
      shops,
      userShops,
      setShops,
      getShops,
      getShop,
      getUserShops,
    }),
    [shops, userShops]
  );
  return (
    <ShopContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </ShopContext.Provider>
  );
};

export default function useShops() {
  return useContext(ShopContext);
}
