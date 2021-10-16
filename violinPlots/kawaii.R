library(ggplot2)

data <- read.csv("/Users/ko/GitHub/kawaii/data/kawaii_box_plot_data.csv", header=TRUE)

theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

violin <- ggplot(data, aes(x = Category, y = Score, color = Category)) +
  geom_violin() + 
  stat_summary(fun = "mean", geom = "point", size = 1, color = "red") +
  labs(x=" ", y=" ", color=" ")

  print(violin)