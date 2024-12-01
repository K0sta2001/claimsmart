// components
import icons from "../utils/IconsLoader";

// assets
import "../assets/styles/animation.css";

export default function IconBlanket() {
  const getRandomPosition = () => {
    const top = Math.floor(Math.random() * 100);
    const left = Math.floor(Math.random() * 100);
    return { top: `${top}%`, left: `${left}%` };
  };

  const IconsDisplay = () => {
    return (
      <div>
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon.src}
            alt=""
            className={`fixed z-null ${icon.animationClass}`}
            style={{
              ...getRandomPosition(),
              transform: index === 0 ? "rotate(-10deg)" : ""
            }}
          />
        ))}
      </div>
    );
  };

  return <div id="icons-blanket">{IconsDisplay()}</div>;
}
