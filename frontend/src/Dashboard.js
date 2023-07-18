import React, { Component } from "react";
import logo from "./logo.png"; // adjust the path as necessary
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Sticky from "./Sticky";
import moment from "moment";
import {
  TextField,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import swal from "sweetalert";

import { Link as MaterialLink } from "@material-ui/core";
import { Link } from "react-router-dom";
import BeneficiaryDelete, { beneficiarydelete } from "./BeneficiaryDelete";
import { searchBeneficiary } from "./utils/search";
import { EditBeneficiary } from "./EditBeneficiary";
import { AddBeneficiary } from "./AddBeneficiary";
import Previous from "./Previous";
import Pctable from "./Pctable";
import Userid from "./Userid";
import Videotable from "./Videotable";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
} from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";

const axios = require("axios");
const baseUrl = process.env.REACT_APP_URL;

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      openProductModal: false,
      openProductEditModal: false,
      id: "",
      lastData: {},
      ttime: {},
      selectedFile: null,
      files: [],

      name: "",
      f_nm: "",
      ben_nid: "",
      sl: "",
      ben_id: "",
      m_nm: "",

      age: "",
      dis: "",
      sub_dis: "",
      uni: "",
      vill: "",
      relgn: "",
      job: "",
      gen: "",
      mob: "",
      pgm: "",

      pass: "",
      bank: "",
      branch: "",
      r_out: "",
      mob_1: "",
      mob_own: "",
      ben_sts: "",
      nid_sts: "",
      a_sts: "",

      u_nm: "",
      dob: "",
      accre: "",
      f_allow: "",
      score1: "",
      score2: "",

      desc: "",
      price: "",
      discount: "",
      file: "",
      fileName: "",
      page: 1,
      search: "",
      beneficiaries: [],
      persons: [],
      pages: 0,
      loading: false,

      anchorEl: null,
      selectedItem: null,
      beneficiary: {},
      error: "",
      filteredBeneficiary: [],
      currentBeneficiary: "",
      dataSent: false,
      timeData: {
        totalDuration: 0,
        firstStartTime: "",
        lastStartTime: "",
      },
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleFileUpload = (event) => {
    this.setState({ files: [...event.target.files] }, () => {
      this.uploadAllFiles();
    });
  };

  uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetch(baseUrl + "/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  uploadAllFiles = async () => {
    const { files } = this.state;

    for (let file of files) {
      await this.uploadFile(file);
    }
    window.location.reload();
  };

  downloadCSV = () => {
    axios.get(baseUrl + "/get-allnew").then((response) => {
      const { data } = response;
      let csvContent = "\uFEFF";
  
      const columnNames = [
        "School Name",
        "EIIN",
        "Video Name",
        "Location",
        "Player Start Time",
        "PC Start Date",
        "PC Start Time",
        "Player End Time",
        "PC End Date",
        "PC End Time",
        "Total Time",
      ];
  
      csvContent += columnNames.join(",") + "\n";
  
      data.forEach((user) => {
        user.video.forEach((video) => {
          const pcStartTime = moment(video.start_date_time);
          const pcEndTime = moment(video.end_date_time);
          const duration = pcEndTime.diff(pcStartTime, "seconds") / 60;
  
          const videoLocationParts = video.location.split("/");
          const videoNameWithExtension = videoLocationParts.pop();
          const videoExtension = videoNameWithExtension.split(".").pop();
          const videoName = videoNameWithExtension.slice(0, -videoExtension.length - 1);
  
          const row = [
            video.school_name,
            video.eiin,
            `"${videoName.trim()}"`,
            `"${videoLocationParts.join("/")}"`,
            video.pl_start,
            pcStartTime.format("DD/MM/YYYY"),
            pcStartTime.format("HH:mm"),
            video.pl_end,
            pcEndTime.format("DD/MM/YYYY"),
            pcEndTime.format("HH:mm"),
            `"${duration.toFixed(2)} minutes"`,
          ];
  
          csvContent += row.map((value) => `${value}`).join(",") + "\n";
        });
      });
  
      const blob = new Blob(["\ufeff", csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "video_log.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  
  
  

  downloadCSV1 = () => {
    axios.get(baseUrl + "/get-allnew").then((response) => {
      const { data } = response;
      const uniqueTracks = new Set();
      let csvContent = "data:text/csv;charset=utf-8,";
  
      const columnNames = [
        "School Name",
        "EIIN",
        "Track Start Date",
        "Track Start Time",
        "Track End Date",
        "Track End Time",
        "Track Total Time",
      ];
  
      csvContent += columnNames.join(",") + "\n";
  
      data.forEach((user) => {
        user.school.forEach((school) => {
          const schoolName = school.school_name;
          const eiin = school.eiin;
  
          school.track.forEach((track) => {
            const trackKey = `${schoolName}-${eiin}-${track.start_time}-${track.end_time}`;
  
            if (!uniqueTracks.has(trackKey)) {
              const startTime = moment(track.start_time);
              const endTime = moment(track.end_time);
              const duration = moment.duration(endTime.diff(startTime));
              const totalMinutes = Math.round(duration.asMinutes());
  
              const row = [
                schoolName,
                eiin,
                startTime.format("DD/MM/YYYY"),
                startTime.format("HH:mm"),
                endTime.format("DD/MM/YYYY"),
                endTime.format("HH:mm"),
                totalMinutes + " minutes",
              ];
  
              csvContent += row.map((value) => `"${value}"`).join(",") + "\n";
              uniqueTracks.add(trackKey);
            }
          });
        });
      });
  
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "pc log.csv");
      document.body.appendChild(link);
      link.click();
    });
  };
  

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  handleSelect(item) {
    this.setState({ selectedItem: item });
    this.handleClose();
  }

  sendPcData = async (data) => {
    try {
      const response = await fetch(baseUrl + "/pcinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  convertToHoursAndMinutes(totalTime) {
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    }
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  componentDidMount = () => {
    this.fetchData();

    let token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getBeneficiaries();
      });
    }

    axios.get(baseUrl + "/user-details").then((res) => {
      const persons = res.data;
      this.setState({ persons });
    });

    const currentTime = new Date();
    const currentDate = currentTime.toLocaleDateString();
    const newTimeData = {
      windowsStartTime: currentTime.toLocaleString(),
    };

    const storedData = localStorage.getItem("timeData");
    if (storedData) {
      const timeArray = JSON.parse(storedData);
      const lastTimeData = timeArray[timeArray.length - 1];
      const lastStartTime = new Date(lastTimeData.windowsStartTime);
      const duration = Math.floor(
        (currentTime.getTime() - lastStartTime.getTime()) / (1000 * 60)
      );
      newTimeData.duration = duration;
      timeArray.push(newTimeData);

      localStorage.setItem("timeData", JSON.stringify(timeArray, null, 2));

      const todaysData = timeArray.filter((item) => {
        const itemDate = new Date(item.windowsStartTime).toLocaleDateString();
        return itemDate === currentDate;
      });

      if (todaysData.length > 0) {
        const firstStartTime = new Date(todaysData[0].windowsStartTime);
        const lastStartTime = new Date(
          todaysData[todaysData.length - 1].windowsStartTime
        );
        const totalDuration = Math.floor(
          (lastStartTime.getTime() - firstStartTime.getTime()) / (1000 * 60)
        );

        this.setState({
          timeData: {
            totalDuration,
            firstStartTime: todaysData[0].windowsStartTime,
            lastStartTime: todaysData[todaysData.length - 1].windowsStartTime,
          },
        });
      } else {
        console.log("No data for today yet");
      }
    } else {
      const timeArray = [newTimeData];
      localStorage.setItem("timeData", JSON.stringify(timeArray, null, 2));
      console.log("Time data saved to storage");
    }

    // After setting timeData, send the data to the server
    this.sendPcData(this.state.timeData);
  };

  sendData = async () => {
    const data = {
      userId: <Userid />,
      win_start: this.state.timeData.firstStartTime,
      win_end: this.state.timeData.lastStartTime,
      total_time: this.state.timeData.totalDuration,
    };

    try {
      const response = await axios.post(baseUrl + "/pcinfo", data);
      console.log(response.data);
      this.setState({ dataSent: true }, () => {
        window.location.reload();
        setTimeout(() => {
          window.location.reload();
        }, 100); // Adjust the delay (in milliseconds) as needed
      });
    } catch (error) {
      console.error(error);
    }
  };

  getBeneficiaries = () => {
    this.setState({ loading: true });
    axios
      .get(baseUrl + "/beneficiary", {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({
          loading: false,
          beneficiaries: res.data.beneficiaries,
          filteredBeneficiary: res.data.beneficiaries,
        });
      })
      .catch((err) => {
        swal({
          text: err,
          icon: "error",
          type: "error",
        });
        this.setState(
          { loading: false, beneficiaries: [], userinfo: [] },
          () => {}
        );
      });
  };
  logOut = () => {
    localStorage.setItem("token", null);
    this.props.history.push("/");
  };

  fetchData = async () => {
    try {
      const response = await axios.get(baseUrl + "/get-pc");
      const data = response.data;
      const ttime = data[data.length - 1];
      this.setState({ ttime });

      const today = new Date().toLocaleDateString(); // Get current date in the format "MM/DD/YYYY"

      let earliestStart = null;
      let latestEnd = null;

      for (let i = 0; i < data.length; i++) {
        const startDate = new Date(data[i].win_start);
        const endDate = new Date(data[i].win_end);

        const entryDate = startDate.toLocaleDateString(); // Get entry's date in the format "MM/DD/YYYY"

        if (entryDate === today) {
          if (!earliestStart || startDate < new Date(earliestStart)) {
            earliestStart = data[i].win_start;
          }

          if (!latestEnd || endDate > new Date(latestEnd)) {
            latestEnd = data[i].win_end;
          }
        }
      }

      const lastData = {
        earliestStart,
        latestEnd,
      };

      console.log("result", lastData);
      this.setState({ lastData });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // downloadCSV = () => {
  //   axios
  //     .get("http://172.104.191.159:2002/get-download")
  //     .then((response) => {
  //       const { data } = response;
  //       let csvContent = "data:text/csv;charset=utf-8,";

  //       // Add column headers
  //       const headers = ["Start Time", "End Time", "Total Time"];
  //       csvContent += headers.map((header) => `"${header}"`).join(",") + "\n";

  //       // Add data rows
  //       data.forEach((item) => {
  //         const startTime = item.earliestStart;
  //         const endTime = item.latestEnd;
  //         const totalTime = item.total_time;
  //         const row = [startTime, endTime, totalTime];
  //         csvContent += row.map((value) => `"${value}"`).join(",") + "\n";
  //       });

  //       // Create a download link
  //       const encodedUri = encodeURI(csvContent);
  //       const link = document.createElement("a");
  //       link.setAttribute("href", encodedUri);
  //       link.setAttribute("download", "data.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     })
  //     .catch((error) => {
  //       console.error("Error downloading CSV:", error);
  //     });
  // };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {});

    if (e.target.name === "search") {
      const needle = e.target.value;
      this.setState({
        filteredBeneficiary: searchBeneficiary(
          this.state.beneficiaries,
          needle
        ),
      });
    }
  };

  handleClick1 = () => {
    this.sendData();
    this.sendData();
    this.sendData();
  };

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      id: "",
      name: "",
      desc: "",
      price: "",
      discount: "",
      fileName: "",
    });
  };

  handleCsv = () => {
    this.setState({
      openProductModal: true,
      id: "",
      name: "",
      desc: "",
      price: "",
      discount: "",
      fileName: "",
    });
  };
  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  handleProductEditOpen = (row) => {
    this.setState({
      openProductEditModal: true,
      currentBeneficiary: row,
    });
  };

  handleProductEditClose = () => {
    this.setState({ openProductEditModal: false });
  };

  render() {
    const { dataSent } = this.state;
    const { lastData } = this.state;
    const { ttime } = this.state;

    return (
      <div>
        {this.state.openProductEditModal && (
          <EditBeneficiary
            beneficiary={this.state.currentBeneficiary}
            isEditModalOpen={this.state.openProductEditModal}
            handleEditModalClose={this.handleProductEditClose}
            getBeneficiaries={this.getBeneficiaries}
          />
        )}
        {this.state.openProductModal && (
          <AddBeneficiary
            isEditModalOpen={this.state.openProductModal}
            handleEditModalClose={this.handleProductClose}
            getBeneficiaries={this.getBeneficiaries}
          />
        )}
        <AppBar
          position="static"
          style={{ backgroundColor: "#1F8A7", height: "32px" }}
        >
          <Toolbar>
            <h5 style={{ paddingTop: "10px" }}></h5>
            <h6
              style={{
                fontFamily: "Arial",
                fontWeight: "bold",
                paddingBottom: "20px",
              }}
            >
              <b> D-Lab ADMIN PANEL VIDEO DASHBOARD </b>
            </h6>
            &nbsp; &nbsp;
          </Toolbar>
        </AppBar>

        <AppBar position="static" style={{ backgroundColor: "#1F8A70" }}>
          <Toolbar>
            <h5 style={{ paddingTop: "10px" }}>
              <img src={logo} alt="Logo" width="50" height="50" />
            </h5>
            <h6
              style={{
                paddingTop: "10px",
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            >
              <b> D-Lab Dashboard </b>
            </h6>
            &nbsp; &nbsp;
            <div>
              <input
                accept=".csv"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={this.handleFileUpload}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  style={{ fontSize: "13px" }}
                  startIcon={<CloudUploadIcon />} // Add this line
                >
                  Upload CSV
                </Button>
              </label>
            </div>
            {/* <Button
              className="button_style"
              variant="contained"
              color="secondary"
              size="medium"
              href="/alternative"
              startIcon={<VideoLibraryIcon />}
            >
              Video Info
            </Button> */}
            <div style={{ paddingLeft: "20px" }}>
              <Sticky />
            </div>
            {/* <IconButton>
              <SearchIcon style={{ color: "white" }} />
            </IconButton> */}
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp;
            {/* <InputBase
              placeholder="Search..."
              style={{ marginLeft: 1, color: "white" }}
              inputProps={{
                style: { color: "white" },
                placeholder: "Search by EIN & School",
              }}
            /> */}
            {/* <div>
              <input
                accept=".csv"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={this.handleFileUploadvd}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" color="primary" component="span">
                  Upload Video Info
                </Button>
              </label>
            </div> */}
            {this.state?.filteredBeneficiary
              ?.slice()
              .reverse()
              .map((row, index) => (
                <div key={index}>
                  <Button variant="contained" color="primary" href="/video">
                    PC INFO
                  </Button>
                  &nbsp; &nbsp;
                  <Button variant="contained" color="primary">
                    {" "}
                    {row.m_nm}{" "}
                  </Button>
                </div>
              ))}
            {/* <div style={{ flexGrow: 1 }} /> */}
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <Button
                  variant="contained"
                  size="small"
                  onClick={this.downloadCSV}
                  startIcon={<CloudDownloadIcon />}
                >
                  <b>Download Video Info</b>
                </Button>
                &nbsp; &nbsp;
                <Button
                  variant="contained"
                  size="small"
                  onClick={this.downloadCSV1}
                  startIcon={<CloudDownloadIcon />}
                >
                  <b> Download Pc Info </b>
                </Button>
                <Button
                  className="button_style"
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ width: "140px" }}
                  onClick={this.logOut}
                >
                  <ExitToAppIcon fontSize="small" /> &nbsp; &nbsp;
                  <MaterialLink
                    style={{
                      textDecoration: "none",
                      color: "white",
                      paddingTop: "3px",
                    }}
                    href="/"
                  >
                    LOG OUT
                  </MaterialLink>
                </Button>
              </div>
            </div>
          </Toolbar>
        </AppBar>

        <AppBar position="static" style={{ backgroundColor: "#3399CC" }}>
          {this.state?.filteredBeneficiary?.map((row, index) => (
            <Toolbar>
              <div>
                <div
                  style={{
                    backgroundColor: "#FF9933", // Adjust the color as desired
                    borderRadius: "4px",
                    display: "inline-block",
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  <Button
                    variant="h6"
                    href="/allcontent"
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px", // Adjust the font size as desired

                      padding: "4px",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                    }}
                  >
                    {row.name}
                  </Button>
                </div>
              </div>
              {/* <div style={{ flexGrow: 1 }} /> */}
              &nbsp; &nbsp; &nbsp; &nbsp;
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* <IconButton>
                  <SearchIcon style={{ color: "white" }} />
                </IconButton>
                <InputBase
                  placeholder="Search..."
                  style={{ marginLeft: 8, color: "white" }}
                  inputProps={{
                    style: { color: "white" },
                    placeholder: "SEARCH",
                  }}
                /> */}
                  <Button variant="contained" size="small">
                    <b>EIN: {row.beneficiaryId} </b>
                  </Button>
                  &nbsp; &nbsp;
                  <Button variant="contained" size="small">
                    <b> LAB ID: {row.u_nm} </b>
                  </Button>
                  &nbsp; &nbsp;
                  <Button variant="contained" size="small">
                    <b> PC ID: {row.f_nm} </b>
                  </Button>
                  &nbsp; &nbsp;
                  <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => this.handleProductEditOpen(row)}
                  >
                    Edit
                  </Button>
                  <BeneficiaryDelete row={row} />
                  &nbsp; &nbsp;
                </div>
              </div>
            </Toolbar>
          ))}
        </AppBar>

        <div>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead></TableHead>

              <TableBody>
                {this.state?.filteredBeneficiary
                  ?.reverse()
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {lastData.earliestStart}
                      </TableCell>

                      <TableCell align="center">
                        {" "}
                        {lastData.latestEnd}
                      </TableCell>

                      <TableCell align="center" component="th" scope="row">
                        {this.convertToHoursAndMinutes(ttime.total_time)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <div style={{ display: "inline" }}>
              <Videotable />
            </div>

            {/* <Previous /> */}

            <Pagination
              count={this.state.pages}
              page={this.state.page}
              onChange={this.pageChange}
              color="primary"
            />
          </TableContainer>
          {/* 
          <div className="App">
            <header className="App-header">
              <h1>React Frontend</h1>
              {dataSent ? (
                <p></p>
              ) : (
                <button onClick={this.handleClick1}>Computer Usages</button>
              )}
            </header>
          </div>

          <div>
            <p>win_start: {lastData.win_start}</p>
            <p>win_end: {lastData.win_end}</p>
            <p>total_time: {lastData.total_time}</p>
          </div> */}
        </div>
      </div>
    );
  }
}
