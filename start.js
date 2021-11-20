const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});


const rootFolder = "./putLogsHere";
const resultsFolder = "./results";
var folders = fs.readdirSync(rootFolder);
folders = folders.filter((a) => fs.statSync(path.join(rootFolder, a)).isDirectory());
if (!folders.length) {
    console.log("Root folder is empty. Add Logs. And Try Again", folders);
    return;
}

var files = fs.readdirSync(resultsFolder);
if (files.length) {
    console.log("Results folder is not empty. Clear. And Try Again", files);
    return;
}

for (let f in folders) {
    const folder = folders[f];
    let geo = folder.toLowerCase().split("ads")[1];
    if (!geo) {
        console.log("some trouble with log: ", folder);
        continue;
    }
    geo = geo
        .replace(/[^a-z]/g, "")
        .toUpperCase()
        .slice(0, 2);
    // .join();

    let id = folder
        .toLowerCase()
        .split("ads")[0]
        .replace(/[^0-9]/g, "")
        .slice(0, 4);
    // id = `${id}`;
    // id = id
    // console.log(geo, id);
    if (!geo) geo = "--";
    if (!id) id = "XXXX";

    var innerFolders = fs.readdirSync(path.join(rootFolder, folder));
    innerFolders = innerFolders.filter((a) => fs.statSync(path.join(rootFolder, folder, a)).isDirectory());
    let isDone = false;
    for (let iF in innerFolders) {
        const innerFolder = innerFolders[iF];
        const lowInFol = innerFolder.toLowerCase();
        if (lowInFol.includes("sant") && lowInFol.includes("sant")) {
            const cookFiles = fs.readdirSync(path.join(rootFolder, folder, innerFolder));
            for (let ci in cookFiles) {
                const cookFile = cookFiles[ci];
                if (cookFile.toLowerCase().includes("json")) {
                    fs.copyFileSync(
                        path.join(rootFolder, folder, innerFolder, cookFile),
                        path.join(resultsFolder, `${id} CRA ${geo} ${folder}.txt`)
                    );
                    console.log(`${id} CRA ${geo} ${folder};${id};${geo}`);
                    isDone = true;
                    break;
                }
            }
        }
    }
    if (!isDone) {
        console.log("Operation was not executed for folder ", folder);
    }
}


readline.question(`In order to close type any text and press Enter`, (number) => {
    console.log(`Hi ${number}!`);
    

    readline.close();
});