import scopackager from "simple-scorm-packager";
import path from 'path';
import { fileURLToPath } from 'url';

const SCORM_VERSION = {
  1.2: "1.2",
  2004: "2004 3rd Edition",
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  version: SCORM_VERSION["1.2"],
  organization: "Digit'Ed",
  title: "Course",
  language: "it-IT",
  masteryScore: 50,
  startingPage: "index.html",
  identifier: "course_20230629",
  source:  path.join(__dirname, "dist"),
  package: {
    version: process.env.npm_package_version,
    zip: true,
    author: "Digit'Ed",
    outputFolder: path.join(__dirname, "scorm_packages"),
    description: "scorm package",
    keywords: ["scorm", "course"],
    typicalDuration: "PT0H5M0S",
    rights: `©${new Date().getFullYear()} Digit'Ed. All right reserved.`,
    vcard: {
      author: "Digit'Ed",
      org: "Digit'Ed",
      tel: "(000) 000-0000",
      address: "Via San Vigilio, 1 | 20151 Milano",
      mail: "my@email.com",
      url: "https://www.digited.it",
    },
  },
};

scopackager(config, function (msg) {
  console.log(msg);
  process.exit(0);
});
