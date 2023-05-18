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
const Videotable = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState([]);
  const [dataCount, setDataCount] = useState(1);
  const incrementCount = () => {
    setDataCount(dataCount + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:2000/get-all");
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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            onClick={() => toggleTable(index)}
          >
            {showTable[index]
              ? `Hide ${user.school[0].eiin}'s Table`
              : `Ein ${user.school[0].eiin}`}
          </Button>



          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            // style={{ position: "absolute", right: "74.2%" }} // adjust these values as you need
            onClick={() => toggleTable(index)}
          >
            {showTable[index]
              ? `Hide ${user.school[0].school_name}'s Table`
              : ` ${user.school[0].school_name}`}
          </Button>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            // style={{ position: "absolute", right: "74.2%" }} // adjust these values as you need
            onClick={() => toggleTable(index)}
          >
            {showTable[index]
              ? `Hide ${user.school[0].updatedat}'s Table`
              : ` ${user.school[0].updatedat}`}
          </Button>
          <Button
        className="button_style"
        variant="contained"
        color="primary"
        size="small"
        style={{ background: "#5D6D7E"}}
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
      >
        <MenuItem onClick={handleClose}>Video infromation</MenuItem>
        <MenuItem onClick={handleClose}>Pc infromation</MenuItem>
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
                {user.video.reverse().map((video) => (
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
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default Videotable;
