import React from "react";
import Select from "react-select";

const Navbar = ({ language, setLanguage }) => {
  const languages = [
    { value: "c", label: "C" },
    { value: "cpp", label: "CPP" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];
  return (
    <div>
      <div className="navbar">
        <h4 style={{ color: "#4aed88" }}>Online Compiler</h4>
        <Select
          className="lang_select"
          options={languages}
          value={language}
          onChange={(e) => setLanguage(e.value)}
          placeholder={language}
        />
      </div>
    </div>
  );
};

export default Navbar;
