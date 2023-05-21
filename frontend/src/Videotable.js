import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
} from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Pctable from "./Pctable";
const Videotable = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState([]);
  const [dataCount, setDataCount] = useState(1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [schoolAnchorEl, setSchoolAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const incrementCount = () => {
    setDataCount(dataCount + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:2000/get-allnew");
      const json = await response.json();
      setData(json);
      setShowTable(new Array(json.length).fill(false)); // Initialize showTable state with false for each user
    };

    fetchData();
  }, []);

  const toggleTable = (index) => {
    const newShowTable = [...showTable];
    newShowTable[index] = !newShowTable[index];
    setShowTable(newShowTable);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleClickSchool = (event) => {
    setSchoolAnchorEl(event.currentTarget);
  };

  const handleCloseSchool = () => {
    setSchoolAnchorEl(null);
  };

  return (
    <div style={{}}>
      {data.map((user, index) => (
        <div key={user._id}>
          <hr />
          <Button variant="contained" color="primary" size="small">
            S/N: {dataCount}
          </Button>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            // style={{ position: "absolute", right: "74.2%" }} // adjust these values as you need
            aria-controls={`school-menu-${index}`}
            aria-haspopup="true"
            onClick={handleClickSchool}          >
                     {user.school[0].eiin}

          </Button>



          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            // onClick={() => toggleTable(index)}
            aria-controls={`school-menu-${index}`}
            aria-haspopup="true"
            onClick={handleClickSchool}
          >
            {user.school[0].school_name}
          </Button>

          <Menu
            id={`school-menu-${index}`}
            anchorEl={schoolAnchorEl}
            keepMounted
            open={Boolean(schoolAnchorEl)}
            onClose={handleCloseSchool}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            getContentAnchorEl={null}
          >
            <MenuItem onClick={() => toggleTable(index)}>
              Video Information
            </MenuItem>
            <MenuItem onClick={handleCloseSchool}>PC Information</MenuItem>
          </Menu>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            style={{ background: "#5D6D7E" }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Download
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            getContentAnchorEl={null}
          >
            <MenuItem onClick={handleClose}>Video Information</MenuItem>
            <MenuItem onClick={handleClose}>PC Information</MenuItem>
          </Menu>





          <br />
          <br />
          {showTable[index] && (
            <table
              style={{
                width: "98%",
                fontSize: "0.8rem",
                borderCollapse: "collapse",
                margin: "0 auto",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid black" }}>Video Name</th>
                  <th style={{ border: "1px solid black" }}>Location</th>
                  <th style={{ border: "1px solid black" }}>
                    Player Start Time
                  </th>
                  <th style={{ border: "1px solid black" }}>
                    Start Time & Date
                  </th>
                  <th style={{ border: "1px solid black" }}>Player End Time</th>
                  <th style={{ border: "1px solid black" }}>End Time & Date</th>
                  <th style={{ border: "1px solid black" }}>Duration</th>
                </tr>
              </thead>
              
              <tbody>
                {user.video.slice().reverse().map((video) => (
                  <tr key={video._id}>
                    <td style={{ border: "1px solid black" }}>
                      {video.video_name}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {video.location}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {video.pl_start}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {video.start_date_time}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {video.pl_end}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {video.end_date_time}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {video.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* <tbody>
                {user.school.reverse().map((school) => (
                  <tr key={school._id}>
                    <td style={{ border: "1px solid black" }}>
                      {school.pc_name}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {school.eiin}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {school.school_name}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {school.start_date_time}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {school.pc_id}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {school.lab_id}
                    </td>
                 
                  </tr>
                ))}
              </tbody> */}
            </table>
          )}
       
        </div>
      ))}



    </div>
  );
};

export default Videotable;
