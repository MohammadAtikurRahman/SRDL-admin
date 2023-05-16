import React, { useState, useEffect } from 'react';

const Videotable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:2000/get-all");
      const json = await response.json();
      setData(json);
    };

    fetchData();
  }, []);

  return (
    <div>
      {data.map(user => (
        <div key={user._id}>
          <h2>{user.username}</h2>
          <table>
            <thead>
              <tr>
                <th>Video Name</th>
                <th>Location</th>
                <th>Player Start Time</th>
                <th>Start Time & Date</th>
                <th>Player End Time</th>
                <th>End Time & Date</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {user.video.map(video => (
                <tr key={video._id}>
                  <td>{video.video_name}</td>
                  <td>{video.location}</td>
                  <td>{video.pl_start}</td>

                  <td>{video.start_date_time}</td>
                  <td>{video.pl_end}</td>

                  <td>{video.end_date_time}</td>
                  <td>{video.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Videotable;
