const User = require("../model/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const csv = require('csv-parser');
const os = require("os");
const user = require("../model/user");

var userid

async function getEnumerator(req, res) {
    const {id} = req.params;
    const enumerator = await User.findById(id);
    return res.status(200).json(enumerator);
}

async function getToken(data) {
    let token = await jwt.sign(
        {user: data.username, id: data._id, userId: data.userId},
        "shhhhh11111",
        {expiresIn: "1d"},
    );

    // console.log("token",token)
    let decoded = jwt.decode(token);
    userid = decoded.userId
    console.log("userid",userid)
    return token;
}

async function userLogin(req, res) {
    console.log(req.body);
    let user = await User.findOne({username: req.body.username});
    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({error: "Username or Password missing"});
    }
     if(!user){
        return res.status(401).json({error: "User Not Found"});
    }
    if (user.password === req.body.password ) {
        let token = await getToken(user);
        return res.status(200).json({
            message: "Login Successfully.",
            token: token,
            status: true,
        });
    }
    return res.status(500).json({message: "Something went wrong."});
}

async function saveCsvpc(req, res) {
  let schoolData = [];
  let videoData = [];

  try {
    const stream = fs.createReadStream(req.file.path);
    for await (const row of stream.pipe(csv())) {
      // Check if the row has a 'Location' field
      if(row.hasOwnProperty('Location')) {
        // If it does, add it to the videoData array
        console.log(videoData)

        videoData.push(row);
      } else {

        console.log(schoolData)
        schoolData.push(row);
      }
    }
    
    console.log('CSV file successfully processed');

    const userId = userid;

    // Retrieve users with the specified userId
    const users = await User.find({ userId: userId });

    // If users are found
    if (users.length > 0) {
      // Update the first user found with the new data
      const user = users[0];

      // Check if schoolData is not empty
      if(schoolData.length > 0) {
        // Prepare new school data
        const newSchoolData = {
          pc_name: schoolData[0]['User Name'],
          eiin: schoolData[0]['EIIN'],
          school_name: schoolData[0]['School Name'],
          pc_id: schoolData[0]['PC ID'],
          lab_id: schoolData[0]['Lab ID'],
          track: schoolData.slice(2).map((row) => ({
            start_time: row['User Name'],
            end_time: row['EIIN'],
            total_time: row['School Name'],
          })),
        };
        user.school.push(newSchoolData);
      }

      // Check if videoData is not empty
      if(videoData.length > 0) {
        // Prepare new video data
        const newVideoData = videoData.map((row) => ({
          video_name: row['Video Name'],
          location: row['Location'],
          pl_start: row['Player Time'],
          start_date_time: row['PC Time Start'],
          pl_end: row['Player End Time'],
          end_date_time: row['PC End Time'],
          duration: row['Total Time'],
          pc_name:row['User Name'],
          eiin: row['EIIN'],
          school_name: row['School Name'],
          pc_id: row['PC ID'],
          lab_id: row['Lab ID'],


        }));
        user.video.push(...newVideoData);
      }

      try {
        await user.save();
        console.log('User updated successfully');
        res.status(200).send({ message: 'User updated successfully.' });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'There was an error updating the user.' });
      }
    } else {
      res.status(404).send({ message: 'User not found.' });
    }
  } catch (err) {
    console.error('Error processing CSV file', err);
    res.status(500).send({ message: 'There was an error processing the CSV file.' });
  }
}

async function findUserid(req,res){
   console.log("userid",userid);
  res.send({userid});

}

async function getAllbyid(req, res){
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404).send('User not found');
  } else {
    res.json(user);
  }
};


async function videoinsert(req, res){
    const videoDataArray = req.body;
    const pcName = os.hostname();
    const userId =userid; // replace with the existing userId value

    console.log(videoDataArray);

    const promises = videoDataArray.map((videoData) => {
        const newVideo = {
            pc_name: pcName,
            eiin: videoData.eiin,
            school_name: videoData.school_name,
            pc_id: videoData.pc_id,
            lab_id: videoData.lab_id,
            video_name: videoData.video_name,
            location: videoData.location,
            pl_start: videoData.pl_start,
            start_date_time: videoData.start_date_time,
            pl_end: videoData.pl_end,
            end_date_time: videoData.end_date_time,
            duration: videoData.duration,
        };

        return user.findOneAndUpdate(
            { userId: userId }, // use the userId value
            { $push: { video: newVideo } },
            { new: true }
        );
    });

    try {
        await Promise.all(promises);
        res.status(200).json({ message: "Data insertion successful" });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: "Error inserting data" });
    }
}




module.exports = {getEnumerator, userLogin,
    saveCsvpc,
    findUserid,
    getAllbyid,
    videoinsert
    

};