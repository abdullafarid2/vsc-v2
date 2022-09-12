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
  const { url } = useAuth();

  const [shops, setShops] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const getShops = async () => {
    try {
      const res = await fetch(url + "/shops", {
        method: "GET",
      });

      const data = await res.json();

      setShops(data);
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

    setLoadingInitial(false);
  }, []);

  const memoedValue = useMemo(
    () => ({
      shops,
      getShops,
      getShop,
    }),
    [shops]
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
