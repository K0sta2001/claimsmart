import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InsuranceGateway({ children }) {
  const [isInsuranceValid, setIsInsuranceValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInsurances = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URI}api/users/get-user`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
              "x-api-key": import.meta.env.VITE_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const user = await response.json();
        if (user?.insurances?.length > 0) {
          setIsInsuranceValid(true);
        } else {
          setIsInsuranceValid(false);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        setIsInsuranceValid(false);
      }
    };

    checkUserInsurances();
  }, []);

  useEffect(() => {
    if (isInsuranceValid === false) {
      navigate("/", { replace: true });
    }
  }, [isInsuranceValid, navigate]);

  if (isInsuranceValid === null) {
    return <div>Loading...</div>;
  }

  return <>{isInsuranceValid && children}</>;
}
