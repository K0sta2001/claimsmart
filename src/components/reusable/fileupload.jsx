import { useState } from "react";

const FileUpload = ({
  name,
  onFileChange,
  buttonText = "Upload profile photo",
  divWidth = "80%",
  topMargin = "15px",
}) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <div
      className="self-center"
      style={{ width: divWidth, marginTop: topMargin }}
    >
      <button
        onClick={() => document.getElementById(name).click()}
        style={{ transform: "translateX(0)", width: "100%" }}
      >
        {buttonText}
      </button>

      <input
        type="file"
        id={name}
        name={name}
        style={{ display: "none", margin: 0 }}
        onChange={handleFileChange}
      />

      {fileName && (
        <p className="white small boldlvl4" style={{ marginTop: "10px" }}>
          {fileName}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
