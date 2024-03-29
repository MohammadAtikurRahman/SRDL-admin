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
  function timeAgo(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return (
      (hours > 0 ? hours + " hours, " : "") +
      (minutes > 0 ? minutes + " minutes, " : "") +
      seconds +
      " seconds ago"
    );
  }

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
                      width: "250px", // Add fixed width
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
                      width: "250px", // Add fixed width
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
                      fontSize: "12px",
                      width: "310px", // Add fixed width
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
                  </Button>

                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      backgroundColor: "#2E8B57",
                      width: "110px",
                      height: "30px",
                    }}
                    onClick={() => {
                      let csvData = user.video.filter((v) => v.eiin === eiin);

                      csvData.forEach((data) => {
                        let start = moment(data.start_date_time);
                        data.start_date = start.format("DD/MM/YYYY");
                        data.start_time = start.format("HH:mm");

                        let end = moment(data.end_date_time);
                        data.end_date = end.format("DD/MM/YYYY");
                        data.end_time = end.format("HH:mm");

                        data.duration =
                          Math.round(data.duration * 100) / 100 + " minutes";

                        data.video_name = data.location.includes("/")
                          ? data.location
                              .split("/")
                              .pop()
                              .split(".")
                              .slice(0, -1)
                              .join(".")
                              .replace(/^[০১২৩৪৫৬৭৮৯]+\)/, "")
                          : data.location.replace(/^[০১২৩৪৫৬৭৮৯]+\)/, "");
                      });

                      // Sort by end_date_time in descending order (most recent first)
                      csvData.sort(
                        (a, b) =>
                          moment(b.end_date_time).valueOf() -
                          moment(a.end_date_time).valueOf()
                      );

                      const replacer = (key, value) =>
                        value === null ? "" : value;

                      const header = [
                        "video_name",
                        "location",
                        "start_date",
                        "start_time",
                        "end_date",
                        "end_time",
                        "duration",
                        "school_name",
                        "pl_start",
                        "pl_end",
                        "pc_name",
                        "eiin",
                        "pc_id",
                        "lab_id",
                      ];

                      let csvContent = "\uFEFF";
                      csvContent += [
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
                      const fileName = `vid_log_${schoolName.replace(
                        / /g,
                        "_"
                      )}_${eiin}.csv`;

                      const blob = new Blob(["\ufeff", csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", fileName);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <strong>Download </strong> &nbsp;
                  </Button>

                  <br />

                  {showTable[eiin] && (
                    <table
                      style={{
                        width: "98%",
                        fontSize: "1rem",
                        borderCollapse: "collapse",
                        margin: "0 auto",
                        marginTop: "30px",
                        fontWeight: "500",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ border: "1px solid black" }}>
                            Video Name
                          </th>

                          <th style={{ border: "1px solid black" }}>
                            Player Start Time
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Start Date
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Start Time
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Player End Time
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            End Date
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            End Time
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Duration
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {user.video
                          .slice()
                          .filter((v) => v.eiin === eiin)
                          .reduce((acc, v) => {
                            const found = acc.find(
                              (item) =>
                                item.pl_start === v.pl_start &&
                                item.start_date_time === v.start_date_time &&
                                item.pl_end === v.pl_end &&
                                item.end_date_time === v.end_date_time &&
                                item.duration === v.duration
                            );
                            if (!found) {
                              acc.push(v);
                            }
                            return acc;
                          }, [])
                          // Add sorting operation here
                          .sort(
                            (a, b) =>
                              moment(b.end_date_time).valueOf() -
                              moment(a.end_date_time).valueOf()
                          )
                          .map((v) => (
                            <tr key={v._id}>
                              <td style={{ border: "1px solid black" }}>
                                {v.location.includes("/")
                                  ? v.location
                                      .split("/")
                                      .pop()
                                      .split(".")
                                      .slice(0, -1)
                                      .join(".")
                                      .replace(/^[০১২৩৪৫৬৭৮৯]+\)/, "")
                                  : v.location.replace(/^[০১২৩৪৫৬৭৮৯]+\)/, "")}
                              </td>

                              <td style={{ border: "1px solid black" }}>
                                {v.pl_start}
                              </td>

                              <td style={{ border: "1px solid black" }}>
                                {moment(v.start_date_time).format("DD/MM/YYYY")}
                              </td>

                              <td style={{ border: "1px solid black" }}>
                                {moment(v.start_date_time).format("HH:mm")}
                              </td>

                              <td style={{ border: "1px solid black" }}>
                                {v.pl_end}
                              </td>

                              <td style={{ border: "1px solid black" }}>
                                {moment(v.end_date_time).format("DD/MM/YYYY")}
                              </td>

                              <td style={{ border: "1px solid black" }}>
                                {moment(v.end_date_time).format("HH:mm")}
                              </td>

                              <td style={{ border: "1px solid black" }}>
                                {v.duration} minutes
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
