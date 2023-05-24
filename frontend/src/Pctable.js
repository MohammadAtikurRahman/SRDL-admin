import React, { useState, useEffect } from "react";
import Videotable from "./Videotable";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Fuse from "fuse.js";
import SearchIcon from "@material-ui/icons/Search";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
} from "@material-ui/core";
const Pctable = () => {
  const [data, setData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:2000/get-allnew");
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

<div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
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


      {(searchResults.length > 0 ? searchResults.map(result => result.item) : data).map(school => (
        <div key={school._id}>
          <div style={{ paddingTop: "30px", alignItems: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ width: '150px' }}
              onClick={() => handleButtonClick(school._id)}
              className={`school-button ${selectedSchool === school._id ? "active" : ""}`}
            >
              <b>EIN</b>&nbsp;
              {school.eiin}
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ width: '350px' }}
              onClick={() => handleButtonClick(school._id)}
              className={`school-button ${selectedSchool === school._id ? "active" : ""}`}
            >
              <b>School Name</b>&nbsp;
              {school.school_name}
            </Button>

            &nbsp;
                &nbsp;
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{   width: '150px',  // Add fixed width
             }}
                  onClick={() => handleButtonClick(school._id)}
                  className={`school-button ${
                    selectedSchool === school._id ? "active" : ""
                  }`}
                >
                  <b>PC ID</b> &nbsp;
                {school.pc_id}
                </Button>
                &nbsp;
                &nbsp;
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{   width: '150px',  // Add fixed width
            }}
                  onClick={() => handleButtonClick(school._id)}
                  className={`school-button ${
                    selectedSchool === school._id ? "active" : ""
                  }`}
                >
                  <b>LAB ID</b> &nbsp;
                {school.lab_id}
                </Button>
                &nbsp;
                &nbsp;
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<CloudDownloadIcon />}

                  style={{  backgroundColor: "#2E8B57", width: '150px',  // Add fixed width
          }}
                  onClick={() => handleButtonClick(school._id)}
                  className={`school-button ${
                    selectedSchool === school._id ? "active" : ""
                  }`}
                >
                  <b>Download Info</b> &nbsp;
                </Button>
            
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
                    {school.track.map((track) => (
                      <tr key={track._id}>
                        <td
                          style={{ border: "1px solid  #000000", padding: "5px" }}
                        >
                          {track.start_time}
                        </td>
                        <td
                          style={{ border: "1px solid  #000000", padding: "5px" }}
                        >
                          {track.end_time}
                        </td>
                        <td
                          style={{ border: "1px solid  #000000", padding: "5px" }}
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
