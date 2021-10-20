import {
  CATEGORIES,
  createHashmap,
  forceLineBreak,
  MAX_SCORE,
  NUM_CATEGORIES,
  NUM_PHOTOS,
  readData,
  SAVE_CSV,
  TOTAL_POSSIBLE_POINTS,
  writeToCSV,
} from "./helpers.js";

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

    const headerAggregatedBarChart = ["Category", "Score", "Cluster"];
    const header_aggregate = ["Photo", "Category", "Score", "Cluster"];
    const header = ["Photo", "Category", "Score", "Cluster"];
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

    const splitByCategoryDataAggregate = {
      kawaii: createEmptyDataset(),
      classical: createEmptyDataset(),
      street: createEmptyDataset(),
    };

    for (let index = 0; index < pointsPerCategoryPerPhoto.length; index++) {
      const photo = pointsPerCategoryPerPhoto[index];

      for (const category in photo) {
        const categoryName = categoryHashmap[index + 1];

        aggregatedData.push(
          `${index + 1},${category},${photo[category]},${categoryName}`
        );

        splitByCategoryData[categoryName].push(
          `${index + 1},${category},${photo[category]},${categoryName}`
        );

        const cluster = splitByCategoryDataAggregate[categoryName];
        cluster[category] += photo[category];

        if (splitByCategoryDataPie[categoryName][category] === undefined) {
          splitByCategoryDataPie[categoryName][category] = photo[category];
        } else {
          splitByCategoryDataPie[categoryName][category] += photo[category];
        }
      }
    }

    console.log("splitByCategoryDataAggregate:", splitByCategoryDataAggregate);

    const addAllClusterData = [];
    for (const clusterName in splitByCategoryDataAggregate) {
      const clusterData = splitByCategoryDataAggregate[clusterName];
      for (const category in clusterData) {
        addAllClusterData.push(
          `"${forceLineBreak(category)}",${
            clusterData[category]
          },${clusterName}`
        );
      }
    }

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

    addAllClusterData.unshift(headerAggregatedBarChart.join(","));
    await writeToCSV(
      SAVE_CSV + `aggregated_bar_chart_data.csv`,
      addAllClusterData.join("\n")
    );

    for (const categoryData in splitByCategoryDataPie) {
      const categories = splitByCategoryDataPie[categoryData];

      const data = [];
      for (const category in categories) {
        data.push(
          `${category},${
            Math.round((categories[category] / TOTAL_POSSIBLE_POINTS) * 1000) /
            10
          }`
        );
      }

      data.unshift(header_pie.join(","));
      await writeToCSV(
        SAVE_CSV + `${categoryData}_pie_chart_data.csv`,
        data.join("\n")
      );
    }
  }
};

getAndFormatData();
