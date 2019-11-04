const fs = require('fs-extra');
const oFS = require('fs');
const ora = require('ora');
const path = require('path');
const {
    TesseractWorker
} = require('tesseract.js');

startIt();

async function startIt() {
    console.log("\nREADING IMAGES FOR ANY EXISTING TEXT ^_^ :");
    const folderPath = path.join(__dirname, 'input');
    const inputFolder = await fs.readdir(folderPath);
    const worker = new TesseractWorker({
        langPath: path.join(__dirname, 'LangPath'),
    });
    for (let index = 0; index < inputFolder.length; index++) {
        const file = inputFolder[index];
        const filePath = path.join(folderPath, file);
        let stat = oFS.statSync(filePath).isDirectory();
        if (!stat) {
            const spinner = ora(file);
            spinner.spinner = {
                interval: 80,
                frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
            };
            spinner.start();
            await worker
                .recognize(filePath)
                .then(async result => {
                    spinner.succeed();
                    await fs.writeFile(path.join(__dirname, "output", file + ".txt"), result.text);
                    if (index == inputFolder.length - 1)
                        process.exit();

                });

        }
    }
}