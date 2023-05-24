import React, { useState, useEffect } from "react";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const Videotable = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:2000/get-allnew");
      const json = await response.json();
      setData(json);
    };

    fetchData();
  }, []);

  const toggleTable = (eiin) => {
    setShowTable((prevShowTable) => ({
      ...prevShowTable,
      [eiin]: !prevShowTable[eiin],
    }));
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = searchTerm
    ? data
        .map((user) => ({
          ...user,
          video: user.video.filter(
            (video) =>
              video.eiin.toString().includes(searchTerm) ||
              (video.school_name &&
                video.school_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          ),
        }))
        .filter((user) => user.video.length > 0)
    : data;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          ></IconButton>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                height: "45px",
                width: "360px",
                border: "2px solid #000000", // Change the border color here
                display: "flex",
                borderRadius: "30px",
                alignItems: "center",
              }}
            >
              <SearchIcon style={{ marginLeft: "10px", color: "#000000" }} />{" "}
              {/* Change the color of the search icon */}
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={handleChange}
                style={{
                  flex: 1,
                  marginLeft: "10px",
                  fontSize: "14px", // Change the font size here
                  color: "#000000", // Change the placeholder color here
                }}
              />
            </div>
          </div>
        </Toolbar>
      </div>

      <div style={{}}>
        {filteredData.map((user) => (
          <div key={user._id}>
            {user.video
              .reduce((acc, video) => {
                if (!acc.includes(video.eiin)) {
                  acc.push(video.eiin);
                }
                return acc;
              }, [])
              .map((eiin) => (
                <React.Fragment key={eiin}>
                  <div
                    style={{
                      paddingTop: "30.5px",
                      alignItems: "center",
                    }}
                  ></div>
                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      position: "absolute",
                      right: "76.2%",
                      width: "150px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => toggleTable(eiin)}
                  >
                    <strong>EIN </strong> &nbsp; {eiin}
                  </Button>
                  {/* Button for school_name */}
                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      position: "absolute",
                      right: "30.2%",
                      width: "350px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => toggleTable(eiin)}
                  >
                    <strong>School Name </strong> &nbsp;
                    {user.video.find((video) => video.eiin === eiin)
                      ?.school_name || "N/A"}
                  </Button>
                  <br />

                  {showTable[eiin] && (
                    <table
                      style={{
                        width: "98%",
                        fontSize: "0.8rem",
                        borderCollapse: "collapse",
                        margin: "0 auto",
                        marginTop: "30px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ border: "1px solid black" }}>
                            Video Name
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Location
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Player Start Time
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Start Time & Date
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Player End Time
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            End Time & Date
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.video
                          .filter((v) => v.eiin === eiin)
                          .map((v) => (
                            <tr key={v._id}>
                              <td style={{ border: "1px solid black" }}>
                                {v.video_name}
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                {v.location}
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                {v.pl_start}
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                {v.start_date_time}
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                {v.pl_end}
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                {v.end_date_time}
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                {v.duration}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </React.Fragment>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videotable;
