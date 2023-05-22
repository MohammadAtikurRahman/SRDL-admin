const csv = require('csv-parser');
const fs = require('fs');

// Define videoData and schoolData arrays
let videoData = [];
let schoolData = [];

// Define userAttributes and videoAttributes objects
let userAttributes = null;
let videoAttributes = null;

const stream = fs.createReadStream(req.file.path);
for await (const row of stream.pipe(csv())) {
  // Check if the row has a 'Video Information' field
  if(row.hasOwnProperty('Video Information')) {
    // If it does, handle it as part of the videoData
    if(row['Video Information'] === 'User Name') {
      userAttributes = row;
    } else if(row['Video Information'] === 'Video Name') {
      videoAttributes = row;
    } else if(userAttributes !== null) {
      const user = {
        "User Name": row['Video Information'],
        "EIIN": parseInt(row['_1'], 10),
        "School Name": row['_2'],
        "PC ID": parseInt(row['_3'], 10),
        "Lab ID": parseInt(row['_4'], 10)
      };
      videoData.push(user);
    } else if(videoAttributes !== null) {
      const video = {
        "Video Name": row['Video Information'],
        "Location": row['_1'],
        "Player Time": parseFloat(row['_2']),
        "PC Time Start": row['_3'],
        "Player End Time": parseFloat(row['_4']),
        "PC End Time": row['_5'],
        "Total Time": parseFloat(row['_6'])
      };
      videoData.push(video);
    }
  } else {
    // If it doesn't have a 'Video Information' field, handle it as part of the schoolData
    schoolData.push(row);
  }
}

console.log(videoData);
console.log(schoolData);
