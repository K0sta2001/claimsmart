// assets
import AI from "/assets/images/claimsmartai.png";
import Logout from "../../assets/images/logout.png";
// styles
import "../../assets/styles/animation.css";
import "../../assets/styles/components/reusable/header.css";

// lib
import { Link } from "react-router-dom";

export default function Header({ user }) {
  const logOut = () => {
    if (localStorage.getItem("user")) {
      localStorage.clear();
      window.location = "/";
    }
  };

  return (
    <div
      id="header"
      className="row tighten-padding space-between relative z-high"
    >
      <div className="column">
        <Link to="/" style={{ width: "fit-content" }}>
          <img src={AI} alt="VALIDATOR AI" style={{ margin: 0 }} id="AI"></img>
        </Link>
        <p className="medium" style={{ margin: 0 }}>
          CLAIMSMART
        </p>
      </div>

      {user ? (
        <div className="row gap-medium" id="user-profile">
          <div className="column">
            <p className="small boldlvl5" style={{ margin: 0 }}>
              {user?.fullName}
            </p>
            <p className="small boldlvl6 self-end" style={{ margin: 0 }}>
              {user?.credits}$
            </p>
          </div>
          <img
            className="pointer animation-wiggle"
            src={Logout}
            style={{ width: "33px" }}
            alt="Log out"
            onClick={logOut}
          ></img>
        </div>
      ) : (
        <div className="column">
          <img
            src={AI}
            alt="VALIDATOR AI"
            className="invert self-end"
            id="AI"
          ></img>
          <p className="medium" style={{ margin: 0 }}>
            TRAMSMIALC
          </p>
        </div>
      )}
    </div>
  );
}
