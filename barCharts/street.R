library(ggplot2)

data <- read.csv("/Users/ko/GitHub/kawaii/data/street_bar_chart_data.csv", header=TRUE)

print(head(data))

theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

barChartSplit <- ggplot(data) +
  geom_col(aes(x = Category, y = Score))
print(barChartSplit)