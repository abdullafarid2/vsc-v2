import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useAuth from "./useAuth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import useNotifications from "./useNotifications";
import Toast from "react-native-toast-message";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, url } = useAuth();
  const { orderConfirmationNotification, orderDelivered, orderCancelled } =
    useNotifications();

  const [pendingOrders, setPendingOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);

  const [myPendingOrders, setMyPendingOrders] = useState([]);
  const [myOngoingOrders, setMyOngoingOrders] = useState([]);
  const [myDeliveredOrders, setMyDeliveredOrders] = useState([]);
  const [myCancelledOrders, setMyCancelledOrders] = useState([]);

  const getPendingOrders = async () => {
    try {
      const res = await fetch(url + "/shops/pendingOrders/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setPendingOrders(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getOngoingOrders = async () => {
    try {
      const res = await fetch(url + "/shops/ongoingOrders/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setOngoingOrders(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getDeliveredOrders = async () => {
    try {
      const res = await fetch(url + "/shops/deliveredOrders/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setDeliveredOrders(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getCancelledOrders = async () => {
    try {
      const res = await fetch(url + "/shops/cancelledOrders/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setCancelledOrders(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getMyPendingOrders = async () => {
    try {
      const res = await fetch(url + "/user/pendingOrders/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setMyPendingOrders(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getMyOngoingOrders = async () => {
    try {
      const res = await fetch(url + "/user/ongoingOrders/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setMyOngoingOrders(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getMyDeliveredOrders = async () => {
    try {
      const res = await fetch(url + "/user/deliveredOrders/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setMyDeliveredOrders(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getMyCancelledOrders = async () => {
    try {
      const res = await fetch(url + "/user/cancelledOrders/" + user.id, {
        method: "GET",
      });

      const data = await res.json();

      setMyCancelledOrders(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const confirmOrder = async (
    orderId,
    accepted,
    date,
    time,
    customerId,
    ownerId,
    shopId
  ) => {
    let hours, minutes, dateFormat, expected_date;

    if (accepted) {
      hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      minutes =
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      dateFormat = date.toDateString() + ", " + hours + ":" + minutes;

      expected_date = new Date(dateFormat);

      if (expected_date.getTime() < new Date().getTime()) {
        Toast.show({
          type: "error",
          text1: "An error occurred.",
          text2: "Please check for valid date/time and try again.",
        });
        return;
      }
    }

    try {
      const res = await fetch(url + "/confirmOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          accepted,
          expected_date,
        }),
      });

      const data = await res.json();

      if (data) {
        orderConfirmationNotification(
          accepted,
          customerId,
          ownerId,
          shopId,
          dateFormat,
          new Date().toISOString()
        );
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateDeliveryDate = async (oid, date, time) => {
    let hours, minutes, dateFormat, expected_date;

    hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    minutes =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    dateFormat = date.toDateString() + ", " + hours + ":" + minutes;

    expected_date = new Date(dateFormat);

    if (expected_date.getTime() < new Date().getTime()) {
      Toast.show({
        type: "error",
        text1: "An error occurred.",
        text2: "Please check for valid date/time and try again.",
      });
      return;
    }

    try {
      const res = await fetch(url + "/updateDeliveryDate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oid,
          expected_date,
        }),
      });

      const data = await res.json();
    } catch (e) {
      console.log(e.message);
    }
  };

  const deliverOrder = async (oid, customerId, shopId) => {
    try {
      const res = await fetch(url + "/deliverOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oid }),
      });

      const data = await res.json();

      if (data) {
        orderDelivered(customerId, user.id, shopId);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const cancelOrder = async (oid, customerId, shopId) => {
    try {
      const res = await fetch(url + "/cancelOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oid }),
      });

      const data = await res.json();

      if (data) {
        orderCancelled(customerId, user.id, shopId);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (user) {
      getPendingOrders();
      getOngoingOrders();
      getDeliveredOrders();
      getCancelledOrders();
    }
  }, [user]);

  const memoedValue = useMemo(
    () => ({
      pendingOrders,
      ongoingOrders,
      deliveredOrders,
      cancelledOrders,
      myPendingOrders,
      myOngoingOrders,
      myDeliveredOrders,
      myCancelledOrders,
      getCancelledOrders,
      getPendingOrders,
      getOngoingOrders,
      getDeliveredOrders,
      getMyPendingOrders,
      getMyOngoingOrders,
      getMyDeliveredOrders,
      getMyCancelledOrders,
      confirmOrder,
      updateDeliveryDate,
      deliverOrder,
      cancelOrder,
    }),
    [
      pendingOrders,
      ongoingOrders,
      deliveredOrders,
      cancelledOrders,
      myPendingOrders,
      myOngoingOrders,
      myDeliveredOrders,
      myCancelledOrders,
    ]
  );
  return (
    <OrderContext.Provider value={memoedValue}>
      {children}
    </OrderContext.Provider>
  );
};

export default function useOrders() {
  return useContext(OrderContext);
}
