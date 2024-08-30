import React, { useState } from "react";
import CustomInput from "../../components/custom-input/CustomInput";
import { useAuthContext } from "../../context-provider/auth-provider";
import loginImage from "../../assets/login_image.png";

const Operations = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { login, register, errorText, authLoading, operation, setOperation } =
    useAuthContext();

  const handleToggleOperation = () => {
    setOperation((prevOperation) => {
      if (prevOperation === "login") {
        return "register";
      }
      return "login";
    });
  };

  const handleAuthButton = () => {
    if (!authLoading) {
      if (operation === "login") {
        login(email, password);
      } else if (operation === "register") {
        register(name, email, password);
      }
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="auth-title">
        {operation === "login"
          ? "Login"
          : operation === "register"
          ? "Register"
          : "Logout"}
      </h1>
      <div className="row sign-container justify-content-center align-items-center">
        <div className="d-none d-md-block col-md-6">
          <img src={loginImage} alt="login" className="login-image" />
        </div>
        <div className="input_container d-flex flex-column justify-content-center align-items-center col-12 col-md-6">
          {operation === "register" && (
            <CustomInput
              label="Name"
              onChangeHandler={(e) => setName(e.target.value)}
              type="text"
            />
          )}
          <CustomInput
            label="Email"
            onChangeHandler={(e) => setEmail(e.target.value)}
            type="text"
          />
          <CustomInput
            label="Password"
            onChangeHandler={(e) => setPassword(e.target.value)}
            type="password"
          />
          <p className="error-text">{errorText}</p>
          <button
            className="operation-button"
            disabled={authLoading}
            onClick={handleAuthButton}
          >
            {authLoading
              ? "Loading..."
              : operation === "login"
              ? "Login"
              : operation === "register"
              ? "Register"
              : "Logout"}
          </button>
          <button
            className="register-prompt"
            disabled={authLoading}
            onClick={handleToggleOperation}
          >
            {operation === "login"
              ? "Not a user yet? Register"
              : "Already a user? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Operations;
