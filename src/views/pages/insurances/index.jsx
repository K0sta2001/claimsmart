// components
import Insurance from "./insurance";

// assets
import "../../../assets/styles/pages/insurances.css";

export default function Insurances(user) {
  const insurances = [{ name: "Health insurance", price: 100 }];

  return (
    <div id="insurances" className="row center gap-large">
      {insurances.map((insurance, index) => {
        return (
          <Insurance user={user?.user} key={index} insurance={insurance} />
        );
      })}
      <div id="insurance" className="column items-center gap-medium">
        <img
          style={{ width: "200px" }}
          src="https://res.cloudinary.com/diix3vysb/image/upload/v1733020231/profile_photos/rfelrj580luh635vxujg.png"
          alt="Insurance"
        />
        <p className="self-start boldlvl6 medium">Travel insurance</p>
        <p className="self-start boldlvl6 medium">30$/month</p>
        <button className="medium boldlvl4 pointer self-end">Details</button>
      </div>
    </div>
  );
}
