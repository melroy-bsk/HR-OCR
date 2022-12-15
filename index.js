import readlineSync from "readline-sync";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import staffInfo from "./staffInfo.js";

const workIt = async () => {
  const currPath = "../Scans";
  // const moveTo = "./Docs";
  const outPut = "../Output";

  const hrops = ["Continuation of work", "Acceptance of Resignation"];
  let indexSel = readlineSync.keyInSelect(
    hrops,
    "Which type of Document you want to process"
  );

  let fileDesc;

  if (indexSel === 0) {
    console.log(`You have selected: ${hrops[indexSel]}`);
    fileDesc = readlineSync.question(
      "What would you name your file? eg. StaffCode - <Continuation Letter>: "
    );
    console.log("Performing some Black magic");
  } else {
    console.log(`You have selected: ${hrops[indexSel]}`);
    fileDesc = readlineSync.question(
      "What would you name your file? eg. StaffCode - <Acceptance of Resignation >: "
    );
    console.log("Performing some magic that even i dont know");
  }

  fs.readdir(currPath, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index) {
      // Make one pass and make the file complete
      const fromPath = path.join(currPath, file);
      // const toPath = path.join(moveTo, file);
      // const fileName = path.basename(fromPath);

      Tesseract.recognize(fromPath, "eng").then(({ data: { text } }) => {
        let staffName;

        if (indexSel === 0) {
          staffName = text
            .split("Dear")
            .splice(1, 1)[0]
            .toString()
            .split("The")[0]
            .trim();
        } else if (indexSel === 1) {
          staffName = text
            .split("Dear")
            .splice(1, 1)[0]
            .toString()
            .split("Thank")[0]
            .trim()
            .split("|")[0]
            .trim();
        }
        console.log("Name:", staffName);
        //get the staffCode
        for (var i = 0; i < staffInfo.length; i++) {
          if (staffInfo[i].preff_name === staffName) {
            const staffCode = staffInfo[i].staff_code;
            const newFileName = `${outPut}/${staffCode} - ${fileDesc}.jpg`;
            fs.copyFile(fromPath, newFileName, (err) => {
              if (err) {
                console.error("Error", err);
              }
              console.log(`Done for ${staffCode}`);
            });
          }
        }
      });
    });
  });
};

await workIt();
