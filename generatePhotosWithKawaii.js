import {
  CATEGORIES,
  createHashmap,
  KAWAII_INDEX,
  MAX_SCORE,
  NUM_CATEGORIES,
  NUM_PHOTOS,
  readData,
  SAVE_CSV,
  writeToCSV,
} from "./helpers.js";

const getAndFormatData = async () => {
  const data = await readData();
  const splitData = data.split("\n");
  const clusterHashmap = createHashmap();
  const splitByCluster = {
    kawaii: {},
    street: {},
    classical: {},
  };

  for (let index = 1; index < splitData.length; index++) {
    const line = splitData[index];
    const splitLine = line.split(",");
    let i = 0;
    while (i < NUM_PHOTOS) {
      const scores = [];

      for (
        let photoIndex = i * NUM_CATEGORIES;
        photoIndex < (i + 1) * NUM_CATEGORIES;
        photoIndex++
      ) {
        const score = splitLine[photoIndex].trim();
        if (score !== "") {
          scores.push(MAX_SCORE - +score + 1);
        } else {
          scores.push(0);
        }
      }

      const clusterName = clusterHashmap[i + 1];

      if (splitByCluster[clusterName][i + 1] === undefined) {
        splitByCluster[clusterName][i + 1] = {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
          0: 0,
          scores: new Array(NUM_CATEGORIES).fill(0),
        };
      }

      splitByCluster[clusterName][i + 1][scores[KAWAII_INDEX]] += 1;
      splitByCluster[clusterName][i + 1].scores = splitByCluster[clusterName][
        i + 1
      ].scores.map((score, index) => score + scores[index]);
      i += 1;
    }
  }

  const overallHeader = ["Photo"].concat(CATEGORIES);
  const header = [
    "Photo",
    "# of 5 points (Kawaii)",
    "# of 4 points (Kawaii)",
    "# of 3 points (Kawaii)",
    "# of 2 points (Kawaii)",
    "# of 1 points (Kawaii)",
    "# of 0 points (Kawaii)",
  ].concat(CATEGORIES);
  for (let clusterName in splitByCluster) {
    const cluster = splitByCluster[clusterName];
    const result = [];
    const overall = [];
    for (let photo in cluster) {
      const data = cluster[photo];
      overall.push(`${photo},${data.scores.join(",")}`);
      if (checkIfKawaiiIsMax(data)) {
        result.push(
          `${photo},${data[MAX_SCORE]},${data[MAX_SCORE - 1]},${
            data[MAX_SCORE - 2]
          },${data[MAX_SCORE - 3]},${data[MAX_SCORE - 4]},${
            data[MAX_SCORE - 5]
          },${data.scores.join(",")}`
        );
      }
    }

    overall.unshift(overallHeader.join(","));
    await writeToCSV(
      SAVE_CSV + `${clusterName}_all_photos.csv`,
      overall.join("\n")
    );

    result.unshift(header.join(","));
    await writeToCSV(
      SAVE_CSV + `${clusterName}_kawaii_top.csv`,
      result.join("\n")
    );
  }
};

const checkIfKawaiiIsMax = (scores) => {
  const kawaiiScore = scores[MAX_SCORE];
  for (let index = 0; index < MAX_SCORE; index++) {
    const score = scores[index];
    if (score > kawaiiScore) {
      return false;
    }
  }
  return true;
};

getAndFormatData();
