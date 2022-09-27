import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Toast from "react-native-toast-message";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState(null);

  const url = "http://192.168.100.78:3000";

  const getUser = () => {
    return user;
  };

  const getAddresses = () => {
    return user.address;
  };

  const isAuthenticated = async () => {
    try {
      const res = await fetch(url + "/is-authenticated", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!data) {
        setUser(null);
        // await AsyncStorage.removeItem("userId");
      } else {
        setUser(data);
        // await AsyncStorage.setItem("userId", data.id);
      }
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  useEffect(() => {
    isAuthenticated();

    setLoadingInitial(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(url + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email.toLowerCase(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!data) {
        setUser(null);
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Invalid email/password combination",
          visibilityTime: 4000,
          topOffset: 50,
        });
      } else {
        setUser(data);
        // await AsyncStorage.setItem("userId", data.id);
        Toast.show({
          type: "success",
          text1: "Login Success",
          text2: "You have successfully logged in!",
          visibilityTime: 4000,
          topOffset: 50,
        });
      }
    } catch (err) {
      setError(err);
      console.error(err);
    }

    setLoading(false);
  };

  const register = async (
    firstName,
    lastName,
    email,
    password,
    phoneNumber
  ) => {
    setLoading(true);

    try {
      const res = await fetch(url + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
        }),
      });

      const data = await res.json();

      if (data === "User already exists.") {
        Toast.show({
          type: "error",
          text1: "Register Failed",
          text2: "Email already exists",
          visibilityTime: 4000,
          topOffset: 50,
        });
      } else {
        login(email.toLowerCase(), password);
      }
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      const res = await fetch(url + "/logout", {
        method: "GET",
      });

      const data = await res.json();

      setUser(null);
      // await AsyncStorage.removeItem("userId");
      Toast.show({
        type: "success",
        text1: "Logout Success",
        text2: "You have successfully logged out!",
        visibilityTime: 4000,
        topOffset: 50,
      });
    } catch (err) {
      setError(err);
      console.error(err);
    }

    setLoading(false);
  };

  const memoedValue = useMemo(
    () => ({
      user,
      url,
      loading,
      error,
      register,
      getUser,
      setUser,
      getAddresses,
      isAuthenticated,
      login,
      logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
