import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import ComputerIcon from "@material-ui/icons/Computer";

const Dropdownbutton= () => {
  const [open, setOpen] = useState(false);

  const handleToggleMenu = () => {
    setOpen(!open);
  };

  return (
    <div>
    <Dropdown show={open} onToggle={handleToggleMenu}>
      <Dropdown.Toggle variant="secondary" size="medium">
      <ComputerIcon /> Pc Info
      </Dropdown.Toggle>
      <Dropdown.Menu
        style={{
          minWidth: "120px",
          maxWidth: "150px",
          backgroundColor: "#3949ab",
          color: "white",
          textAlign: "center",
          padding: "0",
        }}
      >
        <style>
          {`
            .dropdown-item:hover {
              background-color: #3949ab !important;
              color: white;
              border-radius: 10px;
              font-weight: 600;
            }
            .dropdown-item {
              height: 40px;
              line-height: 30px;
              font-size: 14px;
              padding: 4px 10px;
              color: white;
              font-weight: 600;

            }
          `}
        </style>
        <Dropdown.Item href="/dashboard">Video Info</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
  
  );
};

export default Dropdownbutton;
