library(ggplot2)

data <- read.csv("/Users/ko/GitHub/kawaii/data/classical_box_plot_data.csv", header=TRUE)

theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

boxPlot <- ggplot(data, aes(x=Category, y=Score, fill=Category)) +
  geom_boxplot(width = 0.2) +
  labs(title=" ", x=" ", y=" ", fill = " ")

print(boxPlot)