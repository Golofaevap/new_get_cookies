const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
// =================================================================
const GROUP = "STAS - " + new Date().toISOString().slice(0, 10);

const rootFolder = "./putLogsHere";
const resultsFolder = "./results";
var firstLevel = fs.readdirSync(rootFolder);
const firstLevelFolders = firstLevel.filter((a) => fs.statSync(path.join(rootFolder, a)).isDirectory());
// const firstLevelFiles = firstLevel.filter((a) => !fs.statSync(path.join(rootFolder, a)).isDirectory());
// =================================================================
if (!firstLevelFolders.length) {
    console.log("Root folder is empty. Add Logs. And Try Again", firstLevelFolders);
    return;
}
// =================================================================

let report = "";
let index = 1;
for (let flf of firstLevelFolders) {
    report = FindDedMorozCookies({ rootFolder, innerElement: flf, rootName: flf, report });
    // if (response.ok) continue;
}

fs.writeFileSync(GROUP, report);
// for (let g of geos) {
//     console.log(g);
// }
// =================================================================
readline.question(`In order to close type any text and press Enter`, (number) => {
    console.log(`Hi ${number}!`);

    readline.close();
});
// =================================================================
// =================================================================
function readSystemData({ rootFolder, innerElement: logName, rootName, contentOfFolder, row }) {
    row.osLang = "";
    row.keyboardLang = "";
    row.resolution = "";
    row.utc = "";
    const information = contentOfFolder.filter((a) => {
        const aLow = a.toLowerCase();
        return (
            !fs.statSync(path.join(rootFolder, logName, a)).isDirectory() &&
            a.toLowerCase().includes("information") &&
            a.toLowerCase().includes(".txt")
        );
    });
    for (let inf of information) {
        // console.log(information);
        let info = fs.readFileSync(path.join(rootFolder, logName, inf), "ucs2");
        info = info.split("\r\n");
        let stringWithSystemInfo = [];
        for (let l of info) {
            // console.log(info[l], info[l].charCodeAt(l));
            let llow = l.toLowerCase();
            if (llow.includes("language") && llow.includes("os")) {
                row.osLang = l;
            }
            if (llow.includes("language") && llow.includes("keyboard")) {
                row.keyboardLang = l;
            }
            if (llow.includes("utc")) {
                row.utc = l;
            }
            if (llow.includes("display") && llow.includes("resolution") && llow.includes("x")) {
                row.resolution = l;
            }
        }
        console.log(stringWithSystemInfo);
        break;
    }
}
// =================================================================
// =================================================================
function readDedMorozUserAgent({ rootFolder, logName, dm, row }) {
    // console.log(dm);
    row.ua = "";
    let dmFiles = fs.readdirSync(path.join(rootFolder, logName, dm));
    dmFiles = dmFiles.filter((a) => {
        const aLow = a.toLowerCase();
        return (
            !fs.statSync(path.join(rootFolder, logName, dm, a)).isDirectory() &&
            aLow.includes("user") &&
            aLow.includes("agent")
        );
    });
    const ua = fs.readFileSync(path.join(rootFolder, logName, dm, dmFiles[0]), "ascii");
    // console.log(ua);
    row.ua = ua;
}
// =================================================================
// =================================================================
function readDedMorozJsonCookies({ rootFolder, logName, dm, row }) {
    // console.log(dm);
    row.cookies = "";
    let dmFiles = fs.readdirSync(path.join(rootFolder, logName, dm));
    dmFiles = dmFiles.filter((a) => {
        const aLow = a.toLowerCase();
        return (
            !fs.statSync(path.join(rootFolder, logName, dm, a)).isDirectory() &&
            aLow.includes("json") &&
            aLow.includes("cookie")
        );
    });
    const cookies = fs.readFileSync(path.join(rootFolder, logName, dm, dmFiles[0]), "utf8");
    // console.log(cookies);
    row.cookies = cookies;
}
// =================================================================
// =================================================================
function readDedMorozFolder({ rootFolder, innerElement: logName, rootName, contentOfFolder, row }) {
    const dedMoroz = contentOfFolder.filter((a) => {
        const aLow = a.toLowerCase();
        return (
            fs.statSync(path.join(rootFolder, logName, a)).isDirectory() &&
            aLow.includes("ded") &&
            aLow.includes("moroz")
        );
    });
    // console.log(dedMoroz);
    for (let dm of dedMoroz) {
        // read UA
        readDedMorozUserAgent({ rootFolder, logName, dm, row });
        // read Cookie
        readDedMorozJsonCookies({ rootFolder, logName, dm, row });
    }
}

// =================================================================
// =================================================================
function FindDedMorozCookies({ rootFolder, innerElement, rootName, report }) {
    const row = {};
    var contentOfFolder = fs.readdirSync(path.join(rootFolder, innerElement));
    // read Cookie
    // read UA
    readDedMorozFolder({ rootFolder, innerElement, rootName, contentOfFolder, row });

    // read system Data
    readSystemData({ rootFolder, innerElement, rootName, contentOfFolder, row });
    // console.log(row);
    report += `${GROUP}@${innerElement} - ${row.resolution} - ${row.utc} - ${row.osLang} - ${row.keyboardLang}@http://whoer.to@${row.ua}@ip@ip@ip@ip@${row.cookies}\n`;
    // console.log(report);
    return report;
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
// =================================================================
// =================================================================

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
