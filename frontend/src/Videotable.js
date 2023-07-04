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
import moment from "moment-timezone";

const baseUrl = process.env.REACT_APP_URL;

const Videotable = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(baseUrl + "/get-allnew");
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
                      // position: "absolute",
                      // right: "87.2%",
                      width: "110px", // Add fixed width
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
                      // position: "absolute",
                      // right: "63.2%",
                      width: "350px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => toggleTable(eiin)}
                  >
                    <strong>School Name </strong> &nbsp;
                    {user.video.find((video) => video.eiin === eiin)
                      ?.school_name || "N/A"}
                  </Button>
                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      // position: "absolute",
                      // right: "52.6%",
                      width: "110px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => toggleTable(eiin)}
                  >
                    <strong>PC ID </strong> &nbsp;
                    {user.video.find((video) => video.eiin === eiin)?.pc_id ||
                      "N/A"}
                  </Button>

                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      // position: "absolute",
                      // right: "41.99%",
                      width: "110px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => toggleTable(eiin)}
                  >
                    <strong>LAB ID </strong> &nbsp;
                    {user.video.find((video) => video.eiin === eiin)?.lab_id ||
                      "N/A"}
                  </Button>


                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      // position: "absolute",
                      // right: "14.59%",
                      width: "370px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => toggleTable(eiin)}
                  >
                    <strong>Last Sync Time </strong> &nbsp;
                    {user.video.find((video) => video.eiin === eiin)
                      ? moment(
                          user.video.find((video) => video.eiin === eiin)
                            .updatedAt
                        )
                          .tz("Asia/Dhaka")
                          .locale("en-gb")
                          .format("LLL")
                      : "N/A"}
                &nbsp;    <strong>Sync </strong> &nbsp;
                    {user.video.find((video) => video.eiin === eiin)
                      ? moment(
                          user.video.find((video) => video.eiin === eiin)
                            .updatedAt
                        )
                          .tz("Asia/Dhaka")
                          .fromNow()
                      : "N/A"}
                  </Button>

                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      backgroundColor: "#2E8B57",
                      // position: "absolute",
                      // right: "3.9%",
                      width: "110px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => {
                      const csvData = user.video.filter((v) => v.eiin === eiin);
                      const replacer = (key, value) =>
                        value === null ? "" : value;
                      const header = Object.keys(csvData[0]);
                      const csv = [
                        header.join(","),
                        ...csvData.map((row) =>
                          header
                            .map((fieldName) =>
                              JSON.stringify(row[fieldName], replacer)
                            )
                            .join(",")
                        ),
                      ].join("\r\n");

                      const schoolName =
                        user.video.find((video) => video.eiin === eiin)
                          ?.school_name || "Unknown";
                      const fileName = `video_info_${schoolName.replace(
                        / /g,
                        "_"
                      )}_${eiin}.csv`;

                      var link = document.createElement("a");
                      link.setAttribute(
                        "href",
                        "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
                      );
                      link.setAttribute("download", fileName);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <strong>Download </strong> &nbsp;
                  </Button>
                  {/* <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      position: "absolute",
                      right: "11.5%",
                      width: "160px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => toggleTable(eiin)}
                  >
                    <strong>Last Sync </strong> &nbsp;
                    {user.video.find((video) => video.eiin === eiin)
                      ? moment(
                          user.video.find((video) => video.eiin === eiin)
                            .updatedAt
                        )
                          .tz("Asia/Dhaka")
                          .fromNow()
                      : "N/A"}
                  </Button> */}
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
