// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const zipFolder = require("zip-folder");
let folderName = "./dist";

let zipName = "extension.zip";

zipFolder(folderName, zipName, function (err) {
  if (err) {
    console.log("oh no!", err);
  } else {
    console.log(
      `Successfully zipped the ${folderName} directory and store as ${zipName}`
    );
  }
});
