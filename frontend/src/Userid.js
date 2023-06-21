import React, { useState } from "react";
import { useEffect } from "react";
const baseUrl = process.env.REACT_APP_URL;

const Userid = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(baseUrl +"/userid")
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <div>
      {user && (
          user.userid
      )}
    </div>
  );
};

export default Userid;
