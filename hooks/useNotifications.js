import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useAuth from "./useAuth";
import {
  collection,
  doc,
  onSnapshot,
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
    receiverId,
    shopId,
    orderId,
    message
  ) => {
    await setDoc(doc(db, "notifications"), {
      type: "New order",
      customerId: userId,
      ownerId,
      receiverId: ownerId,
      message,
      orderId,
      status: "Pending",
      read: false,
    });
  };

  useEffect(() => {
    if (user) {
      return onSnapshot(
        query(
          collection(db, "notifications"),
          where("receiverId", "==", user.id)
        ),
        (querySnapshot) => {
          setNotifications([]);
          querySnapshot.forEach((doc) => {
            setNotifications((notifications) => [...notifications, doc.data()]);
          });
        }
      );
    }
  }, [user]);

  useEffect(() => {
    setNumberOfNotifications(notifications.length);
  }, [notifications]);

  const memoedValue = useMemo(
    () => ({ notifications, numberOfNotifications, newOrderNotification }),
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
