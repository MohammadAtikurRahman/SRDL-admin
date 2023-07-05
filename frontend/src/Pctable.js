import React, { useState, useEffect } from "react";
import Videotable from "./Videotable";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Fuse from "fuse.js";
import SearchIcon from "@material-ui/icons/Search";
import moment from "moment-timezone";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
} from "@material-ui/core";
const baseUrl = process.env.REACT_APP_URL;

const Pctable = () => {
  const [data, setData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(baseUrl + "/get-allnew");
      const json = await response.json();

      // Flatten the data structure
      const schools = json.flatMap((user) => user.school);

      setData(schools);
      setFuse(
        new Fuse(schools, { keys: ["school_name", "eiin"], threshold: 0.3 })
      );
    };

    fetchData();
  }, []);

  const handleButtonClick = (schoolId) => {
    if (selectedSchool === schoolId) {
      setSelectedSchool(null); // Unselect if the same school button is clicked again
    } else {
      setSelectedSchool(schoolId);
    }
  };

  const handleSearch = (e) => {
    if (!fuse) return;
    setSearchResults(fuse.search(e.target.value));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        <div
          style={{
            height: "45px",
            width: "360px",
            border: "2px solid #000000",
            display: "flex",
            borderRadius: "30px",
            alignItems: "center",
            padding: "0 10px",
          }}
        >
          <SearchIcon style={{ marginRight: "10px" }} />
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>
      </div>

      {(searchResults.length > 0
        ? searchResults.map((result) => result.item)
        : data
      ).map((school, index) => (
        <div key={school._id}>
          <div style={{ paddingTop: "30px", alignItems: "center" }}>
            {/* <Button>
            <b>Serial {index * 1 + 1}</b>
            </Button> */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ width: "110px" }}
              onClick={() => handleButtonClick(school._id)}
              className={`school-button ${
                selectedSchool === school._id ? "active" : ""
              }`}
            >
              <b>EIN</b>&nbsp;
              {school.eiin}
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ width: "350px" }}
              onClick={() => handleButtonClick(school._id)}
              className={`school-button ${
                selectedSchool === school._id ? "active" : ""
              }`}
            >
              <b>School Name</b>&nbsp;
              {school.school_name}
            </Button>{" "}
            &nbsp;
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                width: "110px", // Add fixed width
              }}
              onClick={() => handleButtonClick(school._id)}
              className={`school-button ${
                selectedSchool === school._id ? "active" : ""
              }`}
            >
              <b>PC ID</b> &nbsp;
              {school.pc_id}
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                width: "110px", // Add fixed width
              }}
              onClick={() => handleButtonClick(school._id)}
              className={`school-button ${
                selectedSchool === school._id ? "active" : ""
              }`}
            >
              <b>LAB ID</b> &nbsp;
              {school.lab_id}
            </Button>{" "}
            &nbsp;
            
        

            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ width: "395px" }}
              onClick={() => handleButtonClick(school._id)}
              className={`school-button ${
                selectedSchool === school._id ? "active" : ""
              }`}
            >
              <b>Last Sync Time</b> &nbsp;
              {school.updatedAt
                ? moment(school.updatedAt)
                    .tz("Asia/Dhaka")
                    .locale("en-gb")
                    .format("LLL")
                : "N/A"}
               &nbsp; <b>Sync</b> &nbsp;
              {school.updatedAt
                ? moment(school.updatedAt).tz("Asia/Dhaka").fromNow()
                : "N/A"}
            </Button>{" "}
            &nbsp; 
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                backgroundColor: "#2E8B57",
                width: "110px", // Add fixed width
              }}
              onClick={() => {
                const csvData = school.track.map(
                  ({ start_time, end_time, total_time }) => ({
                    "Start Time": `"${start_time}"`,
                    "End Time": `"${end_time}"`,
                    "Total Time": `"${total_time}"`,
                  })
                );

                const fileName = `pc_info_${school.school_name.replace(
                  / /g,
                  "_"
                )}_${school.eiin}.csv`;
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += [
                  Object.keys(csvData[0]).join(","),
                  ...csvData.map((row) => Object.values(row).join(",")),
                ].join("\r\n");

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <b>Download</b> &nbsp;
            </Button>
            &nbsp;
            &nbsp;
            {/* <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ width: "460px" }}
              onClick={() => handleButtonClick(school._id)}
              className={`school-button ${
                selectedSchool === school._id ? "active" : ""
              }`}
            >
           
            </Button>{" "} */}
{selectedSchool === school._id && (
  <div style={{ clear: "both" }}>
    <br></br>
    <table
      style={{
        width: "98%",
        borderCollapse: "collapse",
        border: "1px solid #000000",
        margin: "0 auto",
      }}
    >
      <thead>
        <tr>
          <th
            style={{ border: "1px solid #000000", padding: "5px" }}
          >
            Start Time
          </th>
          <th
            style={{ border: "1px solid  #000000", padding: "5px" }}
          >
            End Time
          </th>
          <th
            style={{ border: "1px solid #000000", padding: "5px" }}
          >
            Total Time
          </th>
        </tr>
      </thead>

      <tbody>
        {school.track
          .reduce((unique, o) => {
            if (!unique.some(obj => obj.start_time === o.start_time && obj.end_time === o.end_time && obj.total_time === o.total_time)) {
              unique.push(o);
            }
            return unique;
          }, [])
          .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
          .map((track, index) => (
            <tr key={index}>
              <td
                style={{
                  border: "1px solid  #000000",
                  padding: "5px",
                }}
              >
                {track.start_time}
              </td>
              <td
                style={{
                  border: "1px solid  #000000",
                  padding: "5px",
                }}
              >
                {track.end_time}
              </td>
              <td
                style={{
                  border: "1px solid  #000000",
                  padding: "5px",
                }}
              >
                {track.total_time}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)}




          </div>
        </div>
      ))}
    </div>
  );
};

export default Pctable;
