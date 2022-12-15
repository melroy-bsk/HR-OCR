import readlineSync from "readline-sync";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import staffInfo from "./staffInfo.js";
//loop throught all the files in the folder

import axios from "axios";

const workIt = async () => {
  const currPath = "../Images";
  const moveTo = "./Docs";
  let AT;
  dotenv.config();

  // Wait for user's response.
  var fileDesc = readlineSync.question(
    "What would you name your file? eg. StaffCode - <Resignation for ... / Continuation Letter>: "
  );
  // console.log("Hi " + userName + "!");

  // // Handle the secret text (e.g. password).
  // var password = readlineSync.question("Please enter your password", {
  //   hideEchoBack: true, // The typed text on screen is hidden by `*` (default).
  // });
  // console.log("Oh, " + userName + " loves " + favFood + "!");

  //gen access-token
  // await axios
  //   .post(
  //     `https://${process.env.APISERVER_REPOSITORY_API_BASE_URL}/v1/Repositories/${process.env.REPOSITORY_ID}/Token`,
  //     {
  //       grant_type: `password&username=${userName}&password=${password}`,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     }
  //   )
  //   .then((response) => {
  //     AT = response.data.access_token;
  //   });

  fs.readdir(currPath, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index) {
      // Make one pass and make the file complete
      const fromPath = path.join(currPath, file);
      const toPath = path.join(moveTo, file);
      const fileName = path.basename(fromPath);

      console.log("File Name", fileName);

      Tesseract.recognize(fromPath, "eng").then(({ data: { text } }) => {
        const staffName = text
          .split("Dear")
          .splice(1, 1)[0]
          .toString()
          .split("Thank")[0]
          .trim()
          .split("|")[0]
          .trim();

        console.log(staffName);
        //get the staffCode
        for (var i = 0; i < staffInfo.length; i++) {
          if (staffInfo[i].preff_name === staffName) {
            const staffCode = staffInfo[i].staff_code;
            console.log(staffCode);
            //checking if the staffCode Folder Exists
            const empPath = `./Docs`;
            // const isFolderExist = fs.existsSync(empPath); //something staffcode
            // if (isFolderExist === false) {
            //   fs.mkdirSync(empPath);
            // }
            const newFileName = `${empPath}/${staffCode} - ${fileDesc}.jpg`;
            //save the file in that folder

            //upload to LF
            // await axios.post("https://api.laserfiche.com/repository/v1/Repositories/repoId/Entries/parentfolderid/${}")

            fs.copyFile(fromPath, newFileName, (err) => {
              if (err) {
                console.error("Error", err);
              }
              console.log(`Done for ${staffCode} `);
            });
          }
        }
      });
    });
  });
};

await workIt();
