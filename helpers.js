import * as fs from "fs";

const ORIGINAL_DATA = "./original/test_data_google_spreadsheet.csv";
export const SAVE_CSV = "./data/";

export const NUM_STUDENTS = 20;
export const NUM_PHOTOS = 180;
export const NUM_CATEGORIES = 15;
// students choosing top 5 photos, 60 photos per category, 20 students
export const TOTAL_POSSIBLE_POINTS = 18000;
export const CATEGORIES = [
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
export const KAWAII_PHOTOS = [
  4, 5, 6, 7, 8, 12, 14, 17, 21, 24, 26, 29, 30, 31, 32, 33, 41, 42, 43, 44, 50,
  51, 52, 54, 56, 67, 73, 74, 75, 76, 79, 80, 83, 84, 86, 89, 92, 93, 94, 96,
  99, 102, 105, 109, 111, 114, 120, 123, 129, 133, 134, 140, 147, 159, 161, 164,
  170, 172, 176, 177,
];
export const CLASSICAL_PHOTOS = [
  2, 3, 10, 15, 18, 20, 23, 25, 34, 37, 46, 47, 48, 53, 57, 58, 59, 61, 62, 63,
  64, 66, 71, 77, 85, 87, 90, 91, 100, 112, 115, 116, 117, 118, 119, 121, 127,
  130, 131, 132, 139, 141, 142, 143, 144, 145, 146, 149, 151, 152, 153, 155,
  158, 166, 167, 168, 173, 175, 178, 179,
];
export const STREET_PHOTOS = [
  1, 9, 11, 13, 16, 19, 22, 27, 28, 35, 36, 38, 39, 40, 45, 49, 55, 60, 65, 68,
  69, 70, 72, 78, 81, 82, 88, 95, 97, 98, 101, 103, 104, 106, 107, 108, 110,
  113, 122, 124, 125, 126, 128, 135, 136, 137, 138, 148, 150, 154, 156, 157,
  160, 162, 163, 165, 169, 171, 174, 180,
];
export const MAX_SCORE = 5;

export const KAWAII_INDEX = 1;

export const readData = (filePath = ORIGINAL_DATA) => {
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

export const writeToCSV = (filePath, data) => {
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

export const populateHashmap = (hashmap, array, categoryName) => {
  for (const photoNum of array) {
    hashmap[photoNum] = categoryName;
  }
};

export const createHashmap = () => {
  const categoryHashmap = {};
  populateHashmap(categoryHashmap, KAWAII_PHOTOS, "orthodox");
  populateHashmap(categoryHashmap, CLASSICAL_PHOTOS, "classic");
  populateHashmap(categoryHashmap, STREET_PHOTOS, "street");
  return categoryHashmap;
};

export const forceLineBreak = (categoryName) => {
  if (categoryName.includes("（")) {
    return categoryName.replace("（", "\n（");
  }
  return categoryName;
};
