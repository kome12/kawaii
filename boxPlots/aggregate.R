library(ggplot2)

aggregatedData <- read.csv("/Users/ko/GitHub/kawaii/data/bar_chart_data.csv", header=TRUE)

theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

boxPlot <- ggplot(aggregatedData, aes(x = Type, y = Rank, fill = Type)) +
  geom_boxplot(width = 0.2) +
  labs(title=" ", x=" ", y=" ", fill = " ")