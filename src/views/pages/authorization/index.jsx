// components
import Login from "./login";
import Registration from "./registration";

// lib
import { useState } from "react";

export default function Authorization() {
  const [form, setForm] = useState("Login");

  const handleFormChange = () => {
    if (form === "Login") {
      setForm("Registration");
    } else {
      setForm("Login");
    }
  };

  return (
    <div>
      {form === "Login" ? (
        <Login formChange={handleFormChange} formType={form} />
      ) : (
        <Registration formChange={handleFormChange} formType={form} />
      )}
    </div>
  );
}
