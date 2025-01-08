const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const glob = require("glob");
const checkDuplicates = require("./utils/validateSidebar");
const { referenceImports } = require("./utils/variables");
const { processFile } = require("./utils/processFile");
const print = require("./utils/print");

const projectRoot = process.cwd();

const copyFile = (path, dest) => {
  if (fs.existsSync(path)) {
    try {
      fse.copySync(path, dest);
    } catch (err) {
      print.error(`Error copying ${path} file: ${err.message}`);
      process.exit(1);
    }
  }
}

const checkAndCopyConfig = () => {
  const configPath = path.join(projectRoot, "config.json");
  const destConfigPath = path.join(__dirname, "../config.json");

  if (!fs.existsSync(configPath)) {
    print.error("config.json not found in the current directory.");
    process.exit(1);
  }

  try {
    fse.copySync(configPath, destConfigPath);
  } catch (err) {
    print.error(`Error copying config.json`);
    process.exit(1);
  }

  checkDuplicates(destConfigPath);

  const translationPath = path.join(projectRoot, "translations.json");
  const destTranslationPath = path.join(__dirname, "../translations.json");

  copyFile(translationPath, destTranslationPath);

  const cssPath = path.join(projectRoot, "custom.css");
  const destCssPath = path.join(__dirname, "../src/css/_custom.css");

  copyFile(cssPath, destCssPath);

  const homePath = path.join(projectRoot, "homepage.html");
  const destHomePath = path.join(__dirname, "../homepage.html");

  copyFile(homePath, destHomePath);
};

const clearCurrentMdx = (destPath) => {
  const destMdxPath = path.join(__dirname, destPath);

  try {
    fse.emptyDirSync(destMdxPath);
  } catch (err) {
    print.error(`Internal error copying ${destPath} folder`);
    process.exit(1);
  }
};

const copyMdx = (sourcePath, destPath) => {
  const sourceMdxPath = path.join(projectRoot, sourcePath);
  const destMdxPath = path.join(__dirname, destPath);

  if (!fs.existsSync(sourceMdxPath)) {
    print.error(`Folder ${sourcePath} not found in the current directory.`);
    if (sourcePath === 'docs') {
      process.exit(1);
    }
  }

  try {
    fse.copySync(sourceMdxPath, destMdxPath);
  } catch (err) {
    print.error(`Error copying ${sourcePath} folder: ${err.message}`);
    process.exit(1);
  }
};

const reloadMdxFiles = (sourcePath, destPath) => {
  clearCurrentMdx(destPath);
  copyMdx(sourcePath, destPath);
}

const updateMdxFiles = (folderPath) => {
  const docsPath = path.join(__dirname, folderPath);
  const mdxFiles = glob.sync(`${docsPath}/**/*.mdx`);

  mdxFiles.forEach(processFile);
};

const updateReferenceFiles = () => {
  const referencePath = path.join(__dirname, "../docs/reference");
  const mdxFiles = glob.sync(`${referencePath}/**/*.mdx`);

  mdxFiles.forEach((file) => {
    let fileContent = fs.readFileSync(file, "utf-8");

    // Check if the additional import lines are already there to avoid duplicates
    if (!fileContent.includes(referenceImports)) {
      // Insert the additional import lines after the metadata block (usually after the first `---`)
      const updatedContent = fileContent.replace(/^---\s*[\s\S]*?---\s*/, (match) => `${match}\n${referenceImports}\n`);
      fs.writeFileSync(file, updatedContent, "utf-8");
    }
  });
};

const copyMedia = () => {
  const sourceMediaPath = path.join(projectRoot, "media");
  const destMediaPath = path.join(__dirname, "../static/media");

  if (!fs.existsSync(sourceMediaPath)) {
    return;
  }

  try {
    fse.copySync(sourceMediaPath, destMediaPath, {
      overwrite: true,
      errorOnExist: false,
      recursive: true,
    });

  } catch (err) {
    print.error(`Error copying media folder: ${err.message}`);
    process.exit(1);
  }
};

const copyData = () => {
  const sourceMediaPath = path.join(projectRoot, "data");
  const destMediaPath = path.join(__dirname, "../data");

  if (!fs.existsSync(sourceMediaPath)) {
    return;
  }

  try {
    fse.copySync(sourceMediaPath, destMediaPath, {
      overwrite: true,
      errorOnExist: false,
      recursive: true,
    });

  } catch (err) {
    print.error(`Error copying data folder: ${err.message}`);
    process.exit(1);
  }
};

const copyComponents = () => {
  const sourceComponentsPath = path.join(projectRoot, "components");
  const destComponentsPath = path.join(__dirname, "../src/components");

  if (!fs.existsSync(sourceComponentsPath)) {
    return;
  }

  try {
    fse.copySync(sourceComponentsPath, destComponentsPath);
  } catch (err) {
    print.error(`Error copying components folder: ${err.message}`);
    process.exit(1);
  }
};

module.exports = {
  checkAndCopyConfig,
  reloadMdxFiles,
  updateMdxFiles,
  updateReferenceFiles,
  copyMedia,
  copyComponents,
  copyData,
};