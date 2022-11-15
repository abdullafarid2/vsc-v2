import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useAuth from "./useAuth";

const OfferContext = createContext();

export const OfferProvider = ({ children }) => {
  const { url, user } = useAuth();

  const [offers, setOffers] = useState([]);

  const getOffers = async (shopId) => {
    try {
      const res = await fetch(url + "/offers/" + shopId, {
        method: "GET",
      });

      const data = await res.json();

      setOffers(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getProductOffer = async (productId) => {
    try {
      const res = await fetch(url + "/offers/product/" + productId, {
        method: "GET",
      });

      return await res.json();
    } catch (e) {
      console.log(e.message);
    }
  };
  const addOffer = async (
    shopId,
    productId,
    discount_value,
    startDate,
    startTime,
    endDate,
    endTime
  ) => {
    startDate.setHours(startTime.getHours());
    startDate.setMinutes(startTime.getMinutes());
    startDate.setSeconds(startTime.getSeconds());

    endDate.setHours(endTime.getHours());
    endDate.setMinutes(endTime.getMinutes());
    endDate.setSeconds(endTime.getSeconds());

    try {
      const res = await fetch(url + "/offer/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          productId,
          discount_value,
          startDate,
          endDate,
        }),
      });

      return await res.json();
    } catch (e) {
      console.log(e.message);
    }
  };

  const deleteOffer = async (offerId) => {
    try {
      const res = await fetch(url + "/offer/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(),
          offerId,
        }),
      });

      const data = await res.json;

      return data;
    } catch (e) {
      console.log(e.message);
    }
  };

  const memoedValue = useMemo(
    () => ({
      offers,
      getOffers,
      getProductOffer,
      addOffer,
      deleteOffer,
    }),
    [offers]
  );

  return (
    <OfferContext.Provider value={memoedValue}>
      {children}
    </OfferContext.Provider>
  );
};

export default function useOffers() {
  return useContext(OfferContext);
}
