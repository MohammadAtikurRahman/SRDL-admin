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

const Videotable = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:2000/get-allnew");
      const json = await response.json();
      setData(json);
      setShowTable(new Array(json.length).fill(false));
    };

    fetchData();
  }, []);

  const toggleTable = (index) => {
    const newShowTable = [...showTable];
    newShowTable[index] = !newShowTable[index];
    setShowTable(newShowTable);
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
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <CloudDownloadIcon />
          </IconButton>
          <Typography variant="h6">Video</Typography>
          <div>
            <InputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </Toolbar>
      </AppBar>

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
                    {showTable[eiin] ? (
                      <>
                        <strong>EIN </strong> &nbsp; {eiin}
                      </>
                    ) : (
                      <>
                        <strong>EIN </strong> &nbsp; {eiin}
                      </>
                    )}
                  </Button>
                  {/* Button for school_name */}
                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{
                      position: "absolute",
                      right: "30.2%", // Adjust position as needed
                      width: "350px", // Add fixed width
                      height: "30px", // Add fixed height
                    }}
                    onClick={() => toggleTable(eiin)} // Adjust function as needed
                  >
                    <strong>School Name </strong> &nbsp;
                    {user.video.find((video) => video.eiin === eiin)
                      ?.school_name || "N/A"}
                  </Button>
                  <br />
                </React.Fragment>
              ))}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Videotable;
