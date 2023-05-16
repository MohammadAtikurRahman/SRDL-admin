const User = require("../model/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const csv = require('csv-parser');

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
  let data = [];

  try {
    const stream = fs.createReadStream(req.file.path);
    for await (const row of stream.pipe(csv())) {
      data.push(row);
    }
    console.log('CSV file successfully processed');

    const userId = userid;

    // Retrieve users with the specified userId
    const users = await User.find({ userId: userId });

    // If users are found
    if (users.length > 0) {
      // Update the first user found with the new data
      const user = users[0];
      const newData = {
        pc_name: data[0]['User Name'],
        eiin: data[0]['EIIN'],
        school_name: data[0]['School Name'],
        pc_id: data[0]['PC ID'],
        lab_id: data[0]['Lab ID'],
        track: data.slice(2).map((row) => ({
          start_time: row['User Name'],
          end_time: row['EIIN'],
          total_time: row['School Name'],
        })),
      };

      user.school.push(newData);

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


// async function savevideoCsvpc(req, res) {
//    let data = [];
//     fs.createReadStream(req.file.path)
//         .pipe(csv())
//         .on('data', (row) => {
//             data.push(row);
//         })
//         .on('end', () => {
//             console.log('CSV file successfully processed');

//             // Convert data to JSON string with indentation
//             const jsonData = JSON.stringify(data, null, 2);

//             // Write JSON data to a file
//             const filePath = 'data2.json';
//             fs.writeFile(filePath, jsonData, (err) => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send({ message: 'There was an error processing the file.' });
//                 } else {
//                     console.log('Data written to file:', filePath);
//                     res.status(200).send({ message: 'CSV file successfully processed and saved as JSON.' });
//                 }
//             });
//         });
// }
  

module.exports = {getEnumerator, userLogin,
    saveCsvpc,
    

};
