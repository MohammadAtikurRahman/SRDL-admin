import React, { useState, useEffect } from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
} from "@material-ui/core";
const Videotable = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:2000/get-allnew");
      const json = await response.json();
      setData(json);
      setShowTable(new Array(json.length).fill(false));  // Initialize showTable state with false for each user
    };

    fetchData();
  }, []);

  const toggleTable = index => {
    const newShowTable = [...showTable];
    newShowTable[index] = !newShowTable[index];
    setShowTable(newShowTable);
  };

  return (
    <div style={{}}>
      {data.map((user) => (
        <div key={user._id }>
          {user.video.reduce((acc, video) => {
            if (!acc.includes(video.eiin)) {
              acc.push(video.eiin);
            }
            return acc;
          }, []).map((eiin) => (
            <React.Fragment key={eiin}>
               <div style={{ paddingTop: "30.5px",
              
                                alignItems: "center",

              
              }}>

               </div>
              <Button
                className="button_style"
                variant="contained"
                color="primary"
                size="small"
                style={{
                  position: "absolute", right: "76.2%",
                  width: '150px',  // Add fixed width
                  height: '30px'  // Add fixed height

                }} // adjust these values as needed
                onClick={() => toggleTable(eiin)}
              >
                {showTable[eiin]
                  ? <> <strong>EIN </strong> &nbsp; {eiin} </>
                  : <> <strong>EIN </strong> &nbsp; {eiin} </>}



              </Button>
              {/* Add your new button here */}

              {user.school.map((school) => (
                <div key={school._id}>
                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      position: "absolute", right: "47.5%",
                      width: '350px',  // Add fixed width
                      height: '30px'  // Add fixed height
                    }} // adjust these values as needed
                    onClick={() => toggleTable(eiin)}
                  >
                    <b> School Name </b> &nbsp;
                    {school.school_name}

                  </Button>

                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      position: "absolute", right: "34.5%", width: '150px',  // Add fixed width
                      height: '30px'
                    }} // adjust these values as needed
                    onClick={() => toggleTable(eiin)}
                  >
                    <b> PC ID </b> &nbsp;
                    {school.pc_id}           </Button>
                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      position: "absolute", right: "21.5%", width: '150px',  // Add fixed width
                      height: '30px'
                    }} // adjust these values as needed
                    onClick={() => toggleTable(eiin)}
                  >
                    <b> LAB ID </b> &nbsp;
                    {school.lab_id}



                  </Button>

                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<CloudDownloadIcon />}

                    style={{
                      position: "absolute", right: "8.5%", width: '150px',  // Add fixed width
                      height: '30px', backgroundColor: "#2E8B57"
                    }} // adjust these values as needed
                    onClick={() => toggleTable(eiin)}
                  >
                    Download  Info       </Button>



                </div>
              ))}


              &nbsp;
              <br />

              {/* <br />   faka */}
              {showTable[eiin] && (
                <table
                  style={{
                    width: "98%",
                    fontSize: "0.8rem",
                    borderCollapse: "collapse",
                    margin: "0 auto",
                    marginTop: "30px"
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
                      <th style={{ border: "1px solid black" }}>
                        Player End Time
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        End Time & Date
                      </th>
                      <th style={{ border: "1px solid black" }}>Duration</th>
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








  );
}

export default Videotable;