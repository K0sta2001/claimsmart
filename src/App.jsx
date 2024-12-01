// assets
import "./assets/styles/index.css";
import "./assets/styles/layout.css";
import "./assets/styles/typography.css";

// pages
import Home from "./views/pages/home";
import Chat from "./views/pages/chat";

// lib
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// modules
import IconBlanket from "./components/icon-blanket";

// reusable
import Header from "./components/reusable/header";

// others
import InsuranceGateway from "./views/pages/insurances/InsuranceGateway";

function App() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (user && user.token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URI}api/check-token`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log(data.message);
          } else {
            window.location.reload();
            localStorage.clear();
          }
        } catch (error) {
          console.error("Error checking token validity:", error);
        }
      } else {
      }
    };

    checkTokenValidity();
  }, []);

  return (
    <div id="App">
      <div id="App-layout" className="column items-center">
        <IconBlanket />
        <Router>
          <Header user={user} />
          <Routes>
            <Route path="*" element={<Home user={user} />} />
            <Route
              path="/validate"
              element={
                <InsuranceGateway>
                  <Chat user={user} />
                </InsuranceGateway>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
