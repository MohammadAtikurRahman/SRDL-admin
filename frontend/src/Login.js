import { useState } from "react";
import swal from "sweetalert";
import { Button, TextField, Link } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import backgroundImage from "./bg.png"; // adjust the path to match your file structure

const axios = require("axios");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const baseUrl = process.env.REACT_APP_URL;

export default function Login(props) {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const onChange = (event) => {
    event.persist();
    setUser((user) => {
      return {
        ...user,
        [event.target.name]: event.target.value,
      };
    });
  };
  const login = () => {
    axios
      .post(baseUrl + "/login", {
        username: user.username,
        password: user.password,
      })

      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_id", res.data.id);
        if (res.status === 200) navigate("/dashboard");
        Swal.fire({
          title: "Your Logged In",
          text: "Successfully Login",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((err) => {
        Swal.fire({
          text: "Wrong Username or Password",
          icon: "error",
          type: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        if (
          err.response &&
          err.response.data &&
          err.response.data.errorMessage
        ) {
          swal({
            text: err.response.data.errorMessage,
            icon: "error",
            type: "error",
          });
        }
      });
  };
  const inputStyle = { WebkitBoxShadow: "0 0 0 1000px white inset" };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ marginTop: "100px", position: "relative" }}>
        <br />

        <div>
          <h5
            style={{
              color: "#1C6758",
              paddingTop: "10px",
              fontFamily: "Arial",
              fontWeight: "bold",
            }}
          >
            Admin Login
          </h5>

          <br />
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={user.username}
            onChange={onChange}
            placeholder="Username"
            required
            variant="outlined"
            style={{ width: "180px" }} // Inline CSS to reduce width
            size="small"
            inputProps={{
              style: {
                height: "30px",
                padding: "0px 10px", // Reducing vertical padding (first value) can reduce overall height
                fontSize: "12px", // Reducing font size can also reduce overall height
              },
            }}
          />
          <br />
          <br />
          <TextField
            size="small"
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            variant="outlined"
            value={user.password}
            onChange={onChange}
            style={{ width: "180px" }} // Inline CSS to reduce width
            placeholder="Password"
            required
            inputProps={{
              style: {
                height: "30px",
                padding: "0px 10px", // Reduce vertical padding
                fontSize: "12px", // Reduce font size
              },
            }}
          />
          <br />
          <br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="normal"
            disabled={user.username === "" && user.password === ""}
            onClick={login}
            style={{
              backgroundColor: "#1C6758",
              color: "white",
              marginRight: "-17px",
              width: "175px",
              textTransform: "none", // Add this line
            }}
          >
            Login
          </Button>{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/* <Link href="/register" size="normal" style={{ color: "#1C6758" }}>
            Register
          </Link> */}
        </div>
      </div>
    </div>
  );
}
