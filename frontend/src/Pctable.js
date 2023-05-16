import React, { useState, useEffect } from "react";
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
      const response = await fetch("http://localhost:2000/get-all");
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
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
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
                  onClick={() => handleButtonClick(school._id)}
                  className={`school-button ${
                    selectedSchool === school._id ? "active" : ""
                  }`}
                >
                  <b> PC INFO </b> &nbsp;
                  {school.school_name}
                </Button>
                <br />
                <br />
                &nbsp; &nbsp; &nbsp;
              </div>
              {selectedSchool === school._id && (
                <div style={{ clear: "both" }}>
                  <br></br>
                  <Button
                    variant="contained"
                    // color="primary"
                    size="small"
                    style={{ backgroundColor: "#138D75", color: "white"}}
                    // onClick={() => handleButtonClick(school._id)}
                    className={`school-button ${
                      selectedSchool === school._id ? "active" : ""
                    }`}
                  >
                    Pc Name: {school.pc_name} &nbsp; EIIN: {school.eiin} &nbsp;
                    PC ID: {school.pc_id} &nbsp; Lab ID: {school.lab_id}
                  </Button>
                  <br/>
                  <br/>

                  <table
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid #ccc",
                      margin: "0 auto",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{ border: "1px solid #ccc", padding: "5px" }}
                        >
                          Start Time
                        </th>
                        <th
                          style={{ border: "1px solid #ccc", padding: "5px" }}
                        >
                          End Time
                        </th>
                        <th
                          style={{ border: "1px solid #ccc", padding: "5px" }}
                        >
                          Total Time
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {school.track.map((track) => (
                        <tr key={track._id}>
                          <td
                            style={{ border: "1px solid #ccc", padding: "5px" }}
                          >
                            {track.start_time}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "5px" }}
                          >
                            {track.end_time}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "5px" }}
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
