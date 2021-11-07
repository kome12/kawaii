import {
  CATEGORIES,
  createHashmap,
  forceLineBreak,
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
    orthodox: [],
    street: [],
    classic: [],
  };

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
        const clusterName = clusterHashmap[i + 1];
        const score = splitLine[photoIndex];
        if (score !== "") {
          const category = CATEGORIES[categoryIndex];
          splitByCluster[clusterName].push(
            `${i + 1},"${forceLineBreak(category)}",${MAX_SCORE - +score + 1},1`
          );
        } else {
          const category = CATEGORIES[categoryIndex];
          splitByCluster[clusterName].push(
            `${i + 1},"${forceLineBreak(category)}",0,1`
          );
        }
        categoryIndex += 1;
      }
      i += 1;
    }
  }

  const header = ["Photo", "Category", "Score", "Count"];

  for (const cluster in splitByCluster) {
    const data = splitByCluster[cluster];
    data.unshift(header.join(","));
    await writeToCSV(
      SAVE_CSV + `${cluster}_bar_chart_count_data.csv`,
      data.join("\n")
    );
  }
};

getAndFormatData();
