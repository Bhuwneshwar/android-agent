import fs from "fs";

const sourceFile = "history.json";
const destinationFile = "old-history.json";

fs.readFile(sourceFile, "utf8", (err, sourceData) => {
    if (err) return console.error("Error reading source file:", err);

    let sourceJson;
    try {
        sourceJson = JSON.parse(sourceData);
    } catch (err) {
        return console.error("Invalid JSON in source file:", err);
    }

    fs.readFile(destinationFile, "utf8", (err, destData) => {
        let destJson = [];

        if (!err && destData.trim()) {
            try {
                destJson = JSON.parse(destData);
                if (!Array.isArray(destJson)) destJson = [destJson];
            } catch (err) {
                return console.error("Invalid JSON in destination file:", err);
            }
        }

        // Append logic
        if (Array.isArray(sourceJson)) {
            destJson.push(...sourceJson);
        } else {
            destJson.push(sourceJson);
        }

        fs.writeFile(
            destinationFile,
            JSON.stringify(destJson, null, 2),
            err => {
                if (err)
                    return console.error(
                        "Error writing destination file:",
                        err
                    );
                console.log("Appended data to", destinationFile);
            }
        );

        fs.writeFile(sourceFile, "[]", err => {
            if (err) console.error("Error clearing source file:", err);
            else console.log("Source file cleared.");
        });
    });
});
