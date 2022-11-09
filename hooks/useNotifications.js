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

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, url } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [numberOfNotifications, setNumberOfNotifications] = useState(0);

  const newOrderNotification = async (
    userId,
    ownerId,
    shopId,
    orderId,
    timestamp
  ) => {
    await addDoc(collection(db, "notifications"), {
      type: "New order",
      customerId: userId,
      ownerId,
      receiverId: ownerId,
      orderId,
      shopId,
      timestamp,
      message:
        "You have received a new order. Please accept or decline your order as soon as possible!",
      read: false,
    });
  };

  const orderConfirmationNotification = async (
    accepted,
    customerId,
    ownerId,
    shopId,
    expected_date,
    timestamp
  ) => {
    await addDoc(collection(db, "notifications"), {
      type: "Order confirmation",
      accepted,
      customerId,
      receiverId: customerId,
      ownerId,
      shopId,
      timestamp,
      message: accepted
        ? "Your order has been accepted. Expected delivery date: " +
          expected_date
        : "Your order has been declined.",
      read: false,
    });
  };

  const orderDelivered = async (customerId, ownerId, shopId) => {
    await addDoc(collection(db, "notifications"), {
      type: "Order Delivered",
      customerId,
      receiverId: customerId,
      ownerId,
      shopId,
      timestamp: new Date().toISOString(),
      message: "Your order has been delivered.",
      read: false,
    });
  };

  const orderCancelled = async (customerId, ownerId, shopId) => {
    await addDoc(collection(db, "notifications"), {
      type: "Order Cancelled",
      customerId,
      receiverId: customerId,
      ownerId,
      shopId,
      timestamp: new Date().toISOString(),
      message: "Your order has been cancelled.",
      read: false,
    });
  };

  useEffect(() => {
    if (user) {
      return onSnapshot(
        query(collection(db, "notifications"), orderBy("timestamp", "desc")),
        (querySnapshot) => {
          setNotifications([]);
          querySnapshot.forEach((doc) => {
            if (doc.data().receiverId == user.id) {
              setNotifications((notifications) => [
                ...notifications,
                { id: doc.id, ...doc.data() },
              ]);
            }
          });
        }
      );
    }
  }, [user]);

  useEffect(() => {
    setNumberOfNotifications(
      notifications.filter((n) => n.read === false).length
    );
  }, [notifications]);

  const memoedValue = useMemo(
    () => ({
      notifications,
      numberOfNotifications,
      newOrderNotification,
      orderConfirmationNotification,
      orderDelivered,
      orderCancelled,
    }),
    [notifications, numberOfNotifications]
  );
  return (
    <NotificationContext.Provider value={memoedValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default function useNotifications() {
  return useContext(NotificationContext);
}
