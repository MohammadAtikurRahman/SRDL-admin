import React, { useState, useEffect } from "react";
import Videotable from "./Videotable";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:2000/get-allnew");
      const json = await response.json();
      setData(json);
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

  return (
    <div>
      {data.map((user) => (
        <div key={user._id}>
          {user.school.map((school) => (
            <div key={school._id}>
              <div
                style={{
                  paddingTop: "30px",
                  alignItems: "center",
                }}
              >
                {" "}
                {/* <h5 style={{ marginLeft: "10px", marginBottom: 0 }}>
                 Super Admin: {user.username}
                  {}
                </h5> */}
                &nbsp; &nbsp; &nbsp; &nbsp;
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
                  <b> EIN </b> &nbsp;
                  {school.eiin} 
                </Button>
                &nbsp;
                &nbsp;

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{   width: '350px',  // Add fixed width
                 }}
                  onClick={() => handleButtonClick(school._id)}
                  className={`school-button ${
                    selectedSchool === school._id ? "active" : ""
                  }`}
                >
                  <b> School Name </b> &nbsp;
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
                  <b>PC ID</b> &nbsp;
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
                {/* <div> faka
                  </div> */}
             
                &nbsp; &nbsp; &nbsp;
              </div>
              {selectedSchool === school._id && (
                <div style={{ clear: "both" }}>
                  <br></br>
                  {/* <Button
                    variant="contained"
                    // color="primary"
                    size="medium"
                    style={{ backgroundColor: "#34495E", color: "white", paddingRight: "400px"}}
                    // onClick={() => handleButtonClick(school._id)}
                    className={`school-button ${
                      selectedSchool === school._id ? "active" : ""
                    }`}
                  >
                    &nbsp;   &nbsp;     &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;   &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;   &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp; &nbsp;  Pc Name: {school.pc_name} &nbsp; EIIN: {school.eiin} &nbsp;
                    PC ID: {school.pc_id} &nbsp; Lab ID: {school.lab_id}
                  </Button> */}
                  {/* <br/>
                  <br/> */}

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
          ))}
          {/* <hr /> */}
        </div>
      ))}
    </div>
  );
};

export default Pctable;
