require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const moment = require('moment');
const expressJwt = require('express-jwt');
const os = require('os');

const csv = require('csv-parser');
const fs = require('fs');

const multer = require("multer"),
    bodyParser = require("body-parser"),
    path = require("path");

const mongoose = require("mongoose").set("debug", false);
const {router} = require("./routes.js");
const {randomNumberNotInUserCollection} = require("./helpers/number");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});


const user = require("./model/user.js");

app.use(express.json({limit: "50mb"}));



app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.static("uploads"));
app.use(express.static("uploads1"));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);




app.use(router);



app.use("/", (req, res, next) => {
    try {
        if (
            req.path == "/login" ||
            req.path == "/register" ||
            req.path == "/" ||
            req.path == "/api" ||
            req.path == "/users" ||
            req.path == "/get-beneficiary" ||
            req.path == "/user-details" ||
            req.path == "/enumerator" ||
            req.path == "/get-enumerator" ||
            req.path == "/get-testscore" ||
            req.path == "/get-testscore" ||
            req.path == "/insert-data" ||
            req.path == "/insert-video-data" ||
            req.path == "/get-all" ||
            req.path == "/get-all/:id" ||
            req.path === "/get-vd" ||
            req.path === "/get-allnew" ||
            req.path == "/get-login" ||
            req.path == "/get-pc" ||
            req.path === "/get-vd" ||
            req.path == "/get-download" ||
            req.path == "/list-beneficiary" ||
            req.path === "/upload" ||

            req.path == "/beneficiary"
        ) {
            next();
        } else {
            /* decode jwt token if authorized*/
            jwt.verify(req.headers.token, "shhhhh11111", function (err, decoded) {
                if (decoded && decoded.user) {
                    req.user = decoded;
                    next();
                } else {
                    return res.status(401).json({
                        errorMessage: "User unauthorized!",
                        status: false,
                    });
                }
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: "Something went wrong!",
            status: false,
        });
    }
});

app.get("/", (req, res) => {
    res.send({});
});

app.get("/user-details", (req, res) => {
    res.send({});
});

/* user register api */
app.post("/register", async (req, res) => {
    try {
        const userId = await randomNumberNotInUserCollection();
        console.log(userId);
        if (req.body && req.body.username && req.body.password) {
            user.find({username: req.body.username}, (err, data) => {
                if (data.length == 0) {
                    let User = new user({
                        username: req.body.username,
                        password: req.body.password,
                        userId: userId,
                    });
                    User.save((err, data) => {
                        if (err) {
                            res.status(400).json({
                                errorMessage: err,
                                status: false,
                            });
                        } else {
                            res.status(200).json({
                                status: true,
                                title: "Registered Successfully.",
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        errorMessage: `Username ${req.body.username} already exist!`,
                        status: false,
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: "Add proper parameter first!",
                status: false,
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: "Something went wrong!",
            status: false,
        });
    }
});






app.post("/insert-video-data", async (req, res) => {
    const videoDataArray = req.body;
    const pcName = os.hostname();
      console.log(videoDataArray)
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

        return user.updateMany(
            {}, // This will match all documents
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
});









app.get("/api", (req, res) => {
    user.find((err, val) => {
        if (err) {
            console.log(err);
        } else {
            res.json(val);
        }
    });
});

app.post('/insert-data', async (req, res) => {
    const { schoolData } = req.body;

    if (schoolData.length > 0) {
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

        try {
            // Find a user with the same EIIN and update it, or create a new one if it doesn't exist
            await user.findOneAndUpdate(
                { 'school.eiin': newSchoolData.eiin },
                { $set: { 'school.$': newSchoolData } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            res.status(200).json({ message: 'Data inserted/updated successfully' });
        } catch (error) {
            console.error('Error inserting/updating data:', error);
            res.status(500).json({ message: 'Error inserting/updating data' });
        }
    } else {
        res.status(400).json({ message: 'Invalid request body' });
    }
});





// app.get("/get-all", (req, res) => {
//     user.find((err, val) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(val);
//         }
//     });
// });

app.get("/get-allnew", (req, res) => {
    user.find((err, users) => {
        if (err) {
            console.log(err);
        } else {
            let modifiedUsers = users.map(user => {
                let mergedSchools = {};

                user.school.forEach(school => {
                    if (mergedSchools[school.school_name]) {
                        mergedSchools[school.school_name].track.push(...school.track);
                    } else {
                        // Create a deep copy of the school object
                        mergedSchools[school.school_name] = JSON.parse(JSON.stringify(school));
                    }
                });

                // Convert mergedSchools object into an array of its values (the school objects)
                let schoolsArray = Object.values(mergedSchools);

                return {
                    username: user.username,
                    password: user.password,
                    userId: user.userId,
                    school: schoolsArray,
                    video: user.video.map(video => ({
                        video_name: video.video_name,
                        location: video.location,
                        pl_start: video.pl_start,
                        start_date_time: video.start_date_time,
                        pl_end: video.pl_end,
                        end_date_time: video.end_date_time,
                        duration: video.duration,
                        pc_name: video.pc_name,
                        eiin: video.eiin,
                        school_name: video.school_name,
                        pc_id: video.pc_id,
                        lab_id: video.lab_id,
                    })),
                };
            });

            res.json(modifiedUsers);
        }
    });
});


// app.get("/get-vd", async (req, res) => {
//     res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//     let users = await user
//       .find({})
//       .select("-username")
//       .select("-password")
//       .select("-createdAt")
//       .select("-updatedAt")
//       .select("-__v")
//       .select("-id")
//       .select("-_id")
//       .select("-userId")
//       .select("-beneficiary")
//       .select("-pc._id")
//       .select("-pc.win_start")
//       .select("-pc.win_end")
//       .select("-pc.total_time");
  
//     const formattedData = users[0].track;
//     const filteredData = formattedData.filter((obj, index, self) => {
//       return (
//         JSON.stringify(obj) !== JSON.stringify({}) &&
//         index === self.findIndex((o) => {
//           return JSON.stringify(o) === JSON.stringify(obj);
//         })
//       );
//     });
  
//     return res.status(200).json(filteredData);
//   });


app.get("/get-all/:userId", (req, res) => {
    const userId = req.params.userId;
  
    user.findById(userId, (err, val) => {
      if (err) {
        console.log(err);
      } else {
        res.json(val);
      }
    });
  });



app.get("/get-enumerator", async (req, res) => {
    let users = await user.find({}).select("-beneficiary");
    return res.status(200).json(users);
});

app.get("/get-testscore", async (req, res) => {
   
  });
  

// app.get("/get-pc", async (req, res) => {
//     let users = await user
//         .find({})
//         .select("-username")
//         .select("-password")
//         .select("-createdAt")
//         .select("-updatedAt")
//         .select("-__v")

//         .select("-id")
//         .select("-_id")
//         .select("-userId")
//         .select("-beneficiary")

//     // const data = users;

//     // const formatted_data = data[0];
//     // extact_data = formatted_data["beneficiary"];
//     const formattedData = users[0].pc;

//     // console.log(formattedData);
  
//     return res.status(200).json(formattedData);
// });




// app.get("/get-download", async (req, res) => {
//   let users = await user.find({})
//     .select("-username")
//     .select("-password")
//     .select("-createdAt")
//     .select("-updatedAt")
//     .select("-__v")
//     .select("-id")
//     .select("-_id")
//     .select("-userId")
//     .select("-beneficiary");

//   const formattedData = users[0].track;

//   // Group data by date
//   let dataByDate = {};
//   for (let data of formattedData) {
//     let dateObject = moment(data.win_end, "M/D/YYYY, h:mm:ss A");

//     // Check if the date is valid
//     if (!dateObject.isValid()) {
//       // If the date is not valid, skip this entry
//       continue;
//     }

//     let date = dateObject.format('YYYY-MM-DD');
//     if (!dataByDate[date]) {
//       dataByDate[date] = [];
//     }
//     dataByDate[date].push(data);
//   }

//   // For each date, sort by time and select the earliest start and latest end
//   let result = [];
//   for (let date in dataByDate) {
//     dataByDate[date].sort((a, b) => moment(a.win_start, "M/D/YYYY, h:mm:ss A").toDate() - moment(b.win_start, "M/D/YYYY, h:mm:ss A").toDate());
//     let earliestStart = dataByDate[date][0].win_start;

//     dataByDate[date].sort((a, b) => moment(b.win_end, "M/D/YYYY, h:mm:ss A").toDate() - moment(a.win_end, "M/D/YYYY, h:mm:ss A").toDate());
//     let latestEnd = dataByDate[date][0].win_end;

//     let total_time = dataByDate[date][0].total_time;
//     let formattedTotalTime = '';

//     if (total_time < 60) {
//       formattedTotalTime = `${total_time} minute${total_time !== 1 ? 's' : ''}`;
//     } else {
//       const hours = Math.floor(total_time / 60);
//       const minutes = total_time % 60;
//       formattedTotalTime = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
//     }

//     result.push({
//       earliestStart,
//       latestEnd,
//       total_time: formattedTotalTime
//     });
//   }

//   return res.status(200).json(result);
// });













app.get("/get-vd", async (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
    let users = await user
      .find({})
      .select("-username")
      .select("-password")
      .select("-createdAt")
      .select("-updatedAt")
      .select("-__v")
      .select("-id")
      .select("-_id")
      .select("-userId")
      .select("-beneficiary")
      .select("-pc._id")
      .select("-pc.win_start")
      .select("-pc.win_end")
      .select("-pc.total_time");
  
    const formattedData = users[0].pc;
    const filteredData = formattedData.filter((obj, index, self) => {
      return (
        JSON.stringify(obj) !== JSON.stringify({}) &&
        index === self.findIndex((o) => {
          return JSON.stringify(o) === JSON.stringify(obj);
        })
      );
    });
  
    return res.status(200).json(filteredData);
  });
  

app.get("/get-beneficiary", async (req, res) => {
    let users = await user
        .find({})
        .select("-_id")
        .select("-id")
        .select("-username")
        .select("-password")
        .select("-createdAt")

        .select("-beneficiary.test");

    const data = users;
    const data1 = users;
    const formatted_data = data[0];

    //   const formatted_data1= data1[1]

    // extact_data1 = formatted_data1['beneficiary']

    extact_data = formatted_data["beneficiary"];

    // let obj3 = Object.assign(extact_data, extact_data1);

    //  console.log(obj3)

    return res.status(200).json(extact_data);
});

app.get("/get-login", async (req, res) => {
    // let users = await user.find({}).select("-password").select("-username").select("-beneficiary.name").select("-beneficiary.f_nm")
    // .select("-beneficiary.ben_nid").select("-beneficiary.ben_id").select("-beneficiary.sl").select("-beneficiary.m_nm").select("-beneficiary.age").select("-beneficiary.dis")
    // .select("-beneficiary.sub_dis").select("-beneficiary.uni").select("-beneficiary.vill").select("-beneficiary.relgn").select("-beneficiary.job").select("-beneficiary.gen")

    // .select("-beneficiary.mob").select("-beneficiary.pgm").select("-beneficiary.pass").select("-beneficiary.bank").select("-beneficiary.branch").select("-beneficiary.r_out")

    // .select("-beneficiary.mob_1").select("-beneficiary.ben_sts").select("-beneficiary.nid_sts").select("-beneficiary.a_sts").select("-beneficiary.u_nm")

    // .select("-beneficiary.dob").select("-beneficiary.accre").select("-beneficiary.f_allow").select("-beneficiary.mob_own").select("-beneficiary.test")

    let users = await user.find({}).select("-beneficiary");
    return res.status(200).json(users);
});

app.get("/enumerator", (req, res) => {
    product.find((err, val) => {
        if (err) {
            console.log(err);
        } else {
            res.json(val);
        }
    });
});

app.post("/api", async (req, res) => {
    try {
        // const anotherData = JSON.parse(req.body)
        const saveData = req.body;
        const newData = new user({
            username: saveData.username,
            password: saveData.password,
        });
        await newData.save();
        res.status(201).json({success: true, data: newData});
    } catch (error) {
        res.status(400).json({success: false});
    }
});














app.listen(2002, (err, data) => {
    // console.log(err);
    console.log("Server is Runing On port 2002");
});
