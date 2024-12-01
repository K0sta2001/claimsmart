// lib
import React, { useState } from "react";

// components
import FileUpload from "./fileupload";

// assets
import "../../assets/styles/components/reusable/form.css";

export default function Form({ inputs, formType, formChange }) {
  const [inputValues, setInputValues] = useState({
    fullName: "",
    username: "",
    password: "",
    profilePhoto: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileUpload = (file) => {
    if (file) {
      setInputValues((prevValues) => ({
        ...prevValues,
        profilePhoto: file,
      }));
    }
  };

  const handleRegistration = async () => {
    if (
      !inputValues.fullName ||
      !inputValues.username ||
      !inputValues.password
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", inputValues.fullName);
    formData.append("username", inputValues.username);
    formData.append("password", inputValues.password);

    if (inputValues.profilePhoto) {
      formData.append("profilePhoto", inputValues.profilePhoto);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}api/users/register`,
        {
          method: "POST",
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
          body: formData,
        }
      );

      setLoading(false);

      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const handleLogin = async () => {
    const loginObject = {
      username: inputValues.username,
      password: inputValues.password,
    };

    if (!loginObject.username || !loginObject.password) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify(loginObject),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const user = {
          token: data.token,
          userId: data.userId,
          fullName: data.fullName,
          credits: data.credits,
          insurances: data.insurances,
        };
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleSubmit = () => {
    if (formType === "Registration") {
      handleRegistration();
    } else if (formType === "Login") {
      handleLogin();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div id="form" className="column z-high relative">
      <p className="white big boldlvl6" style={{ marginTop: 15 }}>
        Hello
      </p>
      {inputs.map((input) => {
        return React.cloneElement(input, {
          onChange: handleInputChange,
          onKeyPress: handleKeyPress,
        });
      })}
      {formType === "Registration" ? (
        <FileUpload
          key="fileUpload"
          name="profilePhoto"
          onFileChange={handleFileUpload}
        />
      ) : null}

      <div
        className="column items-center gap-medium"
        style={{ width: "100%", marginTop: 17 }}
      >
        <button type="button" onClick={handleSubmit} disabled={loading}>
          {formType === "Login" ? "Login" : "Register"}
        </button>
        <p
          className="pointer boldlvl5 medium white hover-fade"
          style={{ marginTop: "10px" }}
          onClick={formChange}
        >
          {formType === "Login" ? "Registration" : "Login"}
        </p>
        {loading && (
          <img
            src="/assets/images/spinner.png"
            alt="Loading..."
            className="spinner"
            style={{ width: "30px", marginTop: "10px" }}
          />
        )}
        <p
          className="small boldlvl5 absolute"
          style={{ bottom: "12px", color: "rgba(170, 50, 60, 0.8)" }}
        >
          {errorMessage}
        </p>
      </div>
    </div>
  );
}
