import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";

const Sticky = () => {
  const [open, setOpen] = useState(false);

  const handleToggleMenu = () => {
    setOpen(!open);
  };

  return (
    <div>
    <Dropdown show={open} onToggle={handleToggleMenu}>
      <Dropdown.Toggle variant="secondary" size="medium">
        <VideoLibraryIcon /> Vid Info  &nbsp;
     
      </Dropdown.Toggle>
  

      <Dropdown.Menu
        style={{
          minWidth: "140px",
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
        <Dropdown.Item href="/alternative">PC Info</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
  
  );
};

export default Sticky;
