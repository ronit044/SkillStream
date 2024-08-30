import React, { useState, useEffect, useContext } from "react";
import {
  isValidEmail,
  isNameValid,
  isPasswordValid,
} from "../utils/StringUtils";
import axios from "axios";
import "../axios";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [authLoading, setAuthLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [operation, setOperation] = useState("login");

  const [favouriteCourseArray, setFavouriteCourseArray] = useState([]);
  const [favouriteCoursesLoading, setFavouriteCoursesLoading] = useState(false);

  const login = async (email, password) => {
    if (!isValidEmail(email)) {
      setErrorText("Please provide valid email");
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorText("Password does not match");
      return;
    }

    setErrorText("");
    setAuthLoading(true);
    try {
      let { data } = await axios.post(`/auth/login`, {
        email,
        password,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.user.name, token: data.token })
      );
      setUser({ name: data.user.name });
      setIsLoggedIn(true);
      setErrorText("Login Successful");
      setAuthLoading(false);

      //update favourite courses
      const response = await axios.get("/favourites");
      setFavouriteCourseArray(response.data.favouriteCourses);
    } catch (error) {
      setIsLoggedIn(false);
      setErrorText(error.response.data.msg);
      setAuthLoading(false);
    }
  };

  const register = async (name, email, password) => {
    if (!isNameValid(name)) {
      setErrorText("Name is too short");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorText("Please provide valid email");
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorText("Password length must be more than 6");
      return;
    }
    setErrorText("");
    setAuthLoading(true);
    try {
      const { data } = await axios.post(`/auth/register`, {
        name,
        email,
        password,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.user.name, token: data.token })
      );
      setUser({ name: data.user.name });
      setIsLoggedIn(true);
      setAuthLoading(false);
    } catch (error) {
      setErrorText(JSON.stringify(error.response.data.msg));
      setAuthLoading(false);
    }
  };

  const verify = async () => {
    setErrorText("");
    const localUser = localStorage.getItem("user");
    setAuthLoading(true);
    setFavouriteCoursesLoading(true);
    try {
      const { data } = await axios.get("/favourites");
      if (data.authorized === "true") {
        setFavouriteCourseArray(data.favouriteCourses);
        setErrorText("verification successful");
        setUser(JSON.parse(localUser));
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setErrorText("verification unsuccessful");
      }
      setAuthLoading(false);
      setFavouriteCoursesLoading(false);
    } catch (error) {
      setIsLoggedIn(false);
      setAuthLoading(false);
      setFavouriteCoursesLoading(false);

      setErrorText(JSON.stringify(error.msg));
    }
  };
  const logout = () => {
    setErrorText("");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setFavouriteCourseArray([]);
    setUser({});
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      verify();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        setUser,
        login,
        register,
        logout,
        errorText,
        user,
        authLoading,
        isLoggedIn,
        operation,
        setOperation,
        favouriteCourseArray,
        setFavouriteCourseArray,
        favouriteCoursesLoading,
        setFavouriteCoursesLoading,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
