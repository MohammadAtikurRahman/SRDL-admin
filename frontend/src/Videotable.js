import React, { useState, useEffect } from 'react';
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
    <div key={user._id}>
      <hr />
      {user.video.reduce((acc, video) => {
        if (!acc.includes(video.eiin)) {
          acc.push(video.eiin);
        }
        return acc;
      }, []).map((eiin) => (
        <React.Fragment key={eiin}>
           <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            style={{ position: "absolute", right: "74.2%" }} // adjust these values as needed
            onClick={() => toggleTable(eiin)}
          >
            {showTable[eiin]
              ? `Hide ${eiin}'s Table`
              : `Video Info ${eiin}`}
           </Button>
            
           &nbsp;
           &nbsp;

          <br />
          <br />
          {showTable[eiin] && (
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
                  <th style={{ border: "1px solid black" }}>
                    Player End Time
                  </th>
                  <th style={{ border: "1px solid black" }}>
                    End Time & Date
                  </th>
                  <th style={{ border: "1px solid black" }}>Duration</th>
                  <th style={{ border: "1px solid black" }}>Ein</th>
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
                      <td style={{ border: "1px solid black" }}>
                        {v.eiin}
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