const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

const rootFolder = "./putLogsHere";
const resultsFolder = "./results";
var geoFolders = fs.readdirSync(rootFolder);
geoFolders = geoFolders.filter((a) => fs.statSync(path.join(rootFolder, a)).isDirectory());
if (!geoFolders.length) {
    console.log("Root folder is empty. Add Logs. And Try Again", geoFolders);
    return;
}

var files = fs.readdirSync(resultsFolder);
if (files.length) {
    console.log("Results folder is not empty. Clear. And Try Again", files);
    return;
}
const geos = [];
let index = 1;
for (let gf of geoFolders) {
    let geo = gf
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase()
        .slice(0, 2);

    let id = index++ + "";
    if (!geo) geo = "--";
    if (!id) id = "XXXX";
    let isDone = false;

    var accountFolders = fs.readdirSync(path.join(rootFolder, gf));
    console.log(gf, "geo:", geo, accountFolders);
    for (let accF of accountFolders) {
        const cookFiles = fs.readdirSync(path.join(rootFolder, gf, accF));
        for (let cookFile of cookFiles) {
            // const cookFile = cookFiles[ci];
            if (cookFile.toLowerCase().includes("json")) {
                fs.copyFileSync(
                    path.join(rootFolder, gf, accF, cookFile),
                    path.join(resultsFolder, `${id} CRA ${geo} ${accF}.txt`)
                );
                geos.push(geo);
                console.log(`${id} CRA ${geo} ${accF};${id};${geo}`);
                isDone = true;
                break;
            }
        }
        //     }
        // }
    }

    if (!isDone) {
        console.log("Operation was not executed for folder ", gf);
    }
}

for (let g of geos) {
    console.log(g);
}
readline.question(`In order to close type any text and press Enter`, (number) => {
    console.log(`Hi ${number}!`);

    readline.close();
});
