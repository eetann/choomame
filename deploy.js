import { zip } from "zip-a-folder";

let folderName = "./dist";

let zipName = "extension.zip";

class TestMe {
  static async main() {
    try {
      await zip(folderName, zipName);
      console.log(
        `Successfully zipped the ${folderName} directory and store as ${zipName}`
      );
    } catch (err) {
      console.log("oh no!", err);
    }
  }
}

TestMe.main();
