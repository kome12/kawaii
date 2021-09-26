const fs = require("fs");

const ORIGINAL_DATA = "./original/test_data_google_spreadsheet.csv";
const SAVE_CSV = "./data/";

const NUM_STUDENTS = 20;
const NUM_PHOTOS = 180;
const NUM_CATEGORIES = 15;
const CATEGORIES = [
  "カジュアル",
  "かわいい",
  "ストリート",
  "ガーリー",
  "フェミニン",
  "モード",
  "かっこいい",
  "シンプル",
  "スポーティ",
  "クール",
  "きれい（きれいめ）",
  "大人っぽい（大人）",
  "ナチュラル",
  "ボーイッシュ",
  "レトロ",
];
const MAX_SCORE = 5;

const readData = (filePath = ORIGINAL_DATA) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        const errMsg = `Error reading file for ${filePath}: ${err}`;
        console.error(errMsg);
        reject(errMsg);
      }
      resolve(data);
    });
  });
};

const writeToCSV = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        const errMsg = `Error writing file for ${filePath}: ${err}`;
        console.error(errMsg);
        reject(errMsg);
      }
      resolve();
    });
  });
};

const createEmptyDataset = () => {
  return CATEGORIES.reduce((hashmap, category) => {
    hashmap[category] = 0;
    return hashmap;
  }, {});
};

const getAndFormatData = async () => {
  const data = await readData();
  const pointsPerCategoryPerPhoto = [];
  for (let index = 0; index < NUM_PHOTOS; index++) {
    pointsPerCategoryPerPhoto.push(createEmptyDataset());
  }

  const splitData = data.split("\n");
  // console.log("splitData:", splitData);
  for (let index = 1; index < splitData.length; index++) {
    const line = splitData[index];
    // console.log("line:", line);
    const splitLine = line.split(",");
    // console.log("splitLine:", splitLine);
    let i = 0;
    while (i < NUM_PHOTOS) {
      let categoryIndex = 0;
      for (
        let photoIndex = i * NUM_CATEGORIES;
        photoIndex < (i + 1) * NUM_CATEGORIES;
        photoIndex++
      ) {
        const score = splitLine[photoIndex];
        if (score !== "") {
          const category = CATEGORIES[categoryIndex];
          pointsPerCategoryPerPhoto[i][category] += MAX_SCORE - +score + 1;
        }
        categoryIndex += 1;
      }
      i += 1;
    }

    const header = ["Photo", "Category", "Score"];
    const aggregatedData = [];
    // for (let index = 0; index < pointsPerCategoryPerPhoto.length; index++) {
    for (let index = 0; index < 5; index++) {
      const photo = pointsPerCategoryPerPhoto[index];
      for (const category in photo) {
        aggregatedData.push(`${index + 1},${category},${photo[category]}`);
      }
    }

    aggregatedData.unshift(header.join(","));
    await writeToCSV(
      SAVE_CSV + "bar_chart_data.csv",
      aggregatedData.join("\n")
    );
  }
};

getAndFormatData();
