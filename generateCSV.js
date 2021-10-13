const fs = require("fs");

const ORIGINAL_DATA = "./original/test_data_google_spreadsheet.csv";
const SAVE_CSV = "./data/";

const NUM_STUDENTS = 20;
const NUM_PHOTOS = 180;
const NUM_CATEGORIES = 15;
// students choosing top 5 photos, 60 photos per category, 20 students
const TOTAL_POSSIBLE_POINTS = 18000;
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
const KAWAII_PHOTOS = [
  4, 5, 6, 7, 8, 12, 14, 17, 21, 24, 26, 29, 30, 31, 32, 33, 41, 42, 43, 44, 50,
  51, 52, 54, 56, 67, 73, 74, 75, 76, 79, 80, 83, 84, 86, 89, 92, 93, 94, 96,
  99, 102, 105, 109, 111, 114, 120, 123, 129, 133, 134, 140, 147, 159, 161, 164,
  170, 172, 176, 177,
];
const CLASSICAL_PHOTOS = [
  2, 3, 10, 15, 18, 20, 23, 25, 34, 37, 46, 47, 48, 53, 57, 58, 59, 61, 62, 63,
  64, 66, 71, 77, 85, 87, 90, 91, 100, 112, 115, 116, 117, 118, 119, 121, 127,
  130, 131, 132, 139, 141, 142, 143, 144, 145, 146, 149, 151, 152, 153, 155,
  158, 166, 167, 168, 173, 175, 178, 179,
];
const STREET_PHOTOS = [
  1, 9, 11, 13, 16, 19, 22, 27, 28, 35, 36, 38, 39, 40, 45, 49, 55, 60, 65, 68,
  69, 70, 72, 78, 81, 82, 88, 95, 97, 98, 101, 103, 104, 106, 107, 108, 110,
  113, 122, 124, 125, 126, 128, 135, 136, 137, 138, 148, 150, 154, 156, 157,
  160, 162, 163, 165, 169, 171, 174, 180,
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

const populateHashmap = (hashmap, array, categoryName) => {
  for (const photoNum of array) {
    hashmap[photoNum] = categoryName;
  }
};

const createHashmap = () => {
  const categoryHashmap = {};
  populateHashmap(categoryHashmap, KAWAII_PHOTOS, "kawaii");
  populateHashmap(categoryHashmap, CLASSICAL_PHOTOS, "classical");
  populateHashmap(categoryHashmap, STREET_PHOTOS, "street");
  return categoryHashmap;
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

  const categoryHashmap = createHashmap();
  const splitData = data.split("\n");
  for (let index = 1; index < splitData.length; index++) {
    const line = splitData[index];
    const splitLine = line.split(",");
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

    const header_aggregate = ["Photo", "Category", "Score", "Cluster"];
    const header = ["Photo", "Category", "Score"];
    const header_pie = ["Category", "Percentage"];
    const aggregatedData = [];
    const splitByCategoryData = {
      kawaii: [],
      classical: [],
      street: [],
    };

    const splitByCategoryDataPie = {
      kawaii: {},
      classical: {},
      street: {},
    };

    for (let index = 0; index < pointsPerCategoryPerPhoto.length; index++) {
      // for (let index = 0; index < 5; index++) {
      const photo = pointsPerCategoryPerPhoto[index];
      let sum = 0;

      for (const category in photo) {
        const categoryName = categoryHashmap[index + 1];

        aggregatedData.push(
          `${index + 1},${category},${photo[category]},${categoryName}`
        );

        splitByCategoryData[categoryName].push(
          `${index + 1},${category},${photo[category]}`
        );

        if (splitByCategoryDataPie[categoryName][category] === undefined) {
          splitByCategoryDataPie[categoryName][category] = photo[category];
        } else {
          splitByCategoryDataPie[categoryName][category] += photo[category];
        }
      }
    }

    console.log("splitByCategoryDataPie:", splitByCategoryDataPie);

    aggregatedData.unshift(header_aggregate.join(","));
    await writeToCSV(
      SAVE_CSV + "bar_chart_data.csv",
      aggregatedData.join("\n")
    );

    for (const categoryData in splitByCategoryData) {
      const data = splitByCategoryData[categoryData];
      data.unshift(header.join(","));
      await writeToCSV(
        SAVE_CSV + `${categoryData}_bar_chart_data.csv`,
        data.join("\n")
      );
    }

    for (const categoryData in splitByCategoryDataPie) {
      const categories = splitByCategoryDataPie[categoryData];
      // console.log("categories:", categories);
      // for (const category in categories) {
      //   total += categories[category];
      // }

      // console.log("total:", total);

      const data = [];
      for (const category in categories) {
        data.push(
          `${category},${
            Math.round((categories[category] / TOTAL_POSSIBLE_POINTS) * 1000) /
            10
          }`
        );
      }

      console.log("data:", data);
      data.unshift(header_pie.join(","));
      await writeToCSV(
        SAVE_CSV + `${categoryData}_pie_chart_data.csv`,
        data.join("\n")
      );
    }
  }
};

getAndFormatData();
