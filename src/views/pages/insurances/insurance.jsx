// lib
import React, { useState } from "react";
import { Link } from "react-router-dom";

// assets
import "../../../assets/styles/components/insurance.css";

export default function Insurance({ user, insurance }) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [insuranceBought, setInsuranceBought] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generatingMessage, setGeneratingMessage] = useState("");

  const handleBuyClick = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleConfirmBuy = async () => {
    setPopupVisible(false);
    setGeneratingMessage("Generating contract!");

    setTimeout(async () => {
      setGeneratingMessage("");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URI}api/users/add-insurance`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
              "x-api-key": import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify(insurance),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const { token, userId, fullName, credits, insurances } = data;
          const updatedUser = { token, userId, fullName, credits, insurances };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          setInsuranceBought(true);
          setSuccessMessage("Insurance purchased successfully.");
          setTimeout(() => {
            setSuccessMessage("");
            window.location.reload();
          }, 3000);
        } else {
          const errorData = await response.json();
          console.error("Error adding insurance:", errorData.message);
        }
      } catch (error) {
        console.error("Error during API request:", error);
      }
    }, 2000);
  };

  return (
    <div id="insurance" className="column items-center gap-medium">
      <img
        style={{ width: "200px" }}
        src="https://res.cloudinary.com/diix3vysb/image/upload/v1733020231/profile_photos/rfelrj580luh635vxujg.png"
        alt="Insurance"
      />
      <p className="self-start boldlvl6 medium">{insurance?.name}</p>
      <p className="self-start boldlvl6 medium">{insurance?.price}$/month</p>
      {user?.insurances?.length > 0 || insuranceBought ? (
        <Link to="/Validate" className="medium boldlvl4 pointer self-end">
          Validate
        </Link>
      ) : (
        <button
          className="medium boldlvl4 pointer self-end"
          onClick={handleBuyClick}
        >
          Details
        </button>
      )}

      {isPopupVisible && (
        <>
          <div className="popup-overlay column" onClick={closePopup}>
            <div
              className="popup-content column gap-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <h1>Welfare Contract</h1>
              <p>
                <strong>Client:</strong> {user?.fullName || "Full Name"}
                <br />
                <strong>Company:</strong> The Insurance Company
              </p>
              <p>
                <strong>Terms:</strong>
              </p>
              <ol>
                <li>The price of this insurance is $100 per month.</li>
                <li>This is an automatic subscription-based renewal.</li>
                <li>
                  Insurance coverage is up to 80% of costs, with a maximum
                  payout of $1,000 per incident.
                </li>
                <li>
                  The client agrees not to file an insurance claim for the same
                  loss within two weeks after receiving payment for a previous
                  claim, even if the loss reoccurs in that time.
                </li>
                <li>
                  The client will have a unique AI bot which will validate the
                  loss whether it fits the insurance profile or not. By talking
                  to the bot, you must show signs of proof that the loss has
                  indeed occurred or not.
                </li>
              </ol>
              <p>
                By purchasing this insurance a smart contract is generated
                between the client and the company which will automate the
                insurance money transfer process and the client agrees to the
                following and trusts the process. The client also agrees to the
                terms outlined in this welfare contract.
              </p>
              <button
                className="pointer self-center"
                onClick={handleConfirmBuy}
                style={{ width: "fit-content", padding: "0" }}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </>
      )}

      {generatingMessage && (
        <div className="popup-overlay column">
          <div className="white big animation-fade boldlvl 6">
            {generatingMessage}...
          </div>
        </div>
      )}

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
}
