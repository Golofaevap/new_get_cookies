const { Console } = require("console");
const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

const rootFolder = "./putLogsHere";
const resultsFolder = "./results";
var firstLevelFolders = fs.readdirSync(rootFolder);
firstLevelFolders = firstLevelFolders.filter((a) => fs.statSync(path.join(rootFolder, a)).isDirectory());
if (!firstLevelFolders.length) {
    console.log("Root folder is empty. Add Logs. And Try Again", firstLevelFolders);
    return;
}

var files = fs.readdirSync(resultsFolder);
if (files.length) {
    console.log("Results folder is not empty. Clear. And Try Again", files);
    return;
}
const geos = [];
let index = 1;
for (let flf of firstLevelFolders) {
    // let geo = gf
    //     .replace(/[^a-zA-Z]/g, "")
    //     .toUpperCase()
    //     .slice(0, 2);

    let id = index++ + "";
    const geo = "{GEO}";
    if (!id) id = "XXXX";
    let isDone = false;

    let response = FindDedMorozCookies(rootFolder, flf, flf);
    if (response.ok) continue;
    // continue;
    response = FindAllCookies(rootFolder, flf, flf);
    if (response.ok) continue;
    var contentOfFolder = fs.readdirSync(path.join(rootFolder, flf));
    // console.log(gf, "geo:", geo, accountFolders);
    for (let element of contentOfFolder) {
        const elLow = element.toLowerCase();
        if (elLow.includes("all") && elLow.includes("cookie")) {
            break;
        }

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

function FindDedMorozCookies(rootFolder, innerElement, rootName) {
    var contentOfFolder = fs.readdirSync(path.join(rootFolder, innerElement));
    // console.log(contentOfFolder);
    const dedMoroz = contentOfFolder.filter((a) => {
        const aLow = a.toLowerCase();
        console.log(aLow);
        // console.log(a, a.toLowerCase().includes("ded"), a.toLowerCase().includes("moroz"));
        return (
            fs.statSync(path.join(rootFolder, innerElement, a)).isDirectory() &&
            a.toLowerCase().includes("ded") &&
            a.toLowerCase().includes("moroz")
        );
    });
    console.log(dedMoroz);
    for (let dm of dedMoroz) {
        const noJson = [];
        var contentOfFolder = fs.readdirSync(path.join(rootFolder, innerElement, dm));

        for (let element of contentOfFolder) {
            const elLow = element.toLowerCase();
            if (elLow.includes("json") && elLow.includes("cookie") && elLow.includes(".txt")) {
                fs.copyFileSync(
                    path.join(rootFolder, innerElement, dm, element),
                    path.join(resultsFolder, `${Math.round(Math.random() * 99999)} dm {geo} ${rootName}.txt`)
                );
                return { ok: true };
            } else {
                if (elLow.includes("cookie") && elLow.includes(".txt")) {
                    noJson.push(element);
                }
            }
        }
        if (noJson) {
            fs.copyFileSync(
                path.join(rootFolder, innerElement, dm, noJson[Math.floor(Math.random() * noJson.length)]),
                path.join(resultsFolder, `${Math.round(Math.random() * 99999)} {geo} ${rootName}.txt`)
            );
            return { ok: true };
        }
    }
    return { ok: false };
}

function FindAllCookies(rootFolder, innerElement, rootName) {
    var contentOfFolder = fs.readdirSync(path.join(rootFolder, innerElement));
    for (let element of contentOfFolder) {
        const elLow = element.toLowerCase();
        if (elLow.includes("all") && elLow.includes("cookie") && elLow.includes(".txt")) {
            fs.copyFileSync(
                path.join(rootFolder, innerElement, element),
                path.join(resultsFolder, `${Math.round(Math.random() * 99999)} {geo} ${rootName}.txt`)
            );
            return { ok: true };
        }
    }
    return { ok: false };
}
