library(ggplot2)

data <- read.csv("/Users/ko/GitHub/kawaii/data/classical_bar_chart_data.csv", header=TRUE)

print(head(data))

theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

barChartSplit <- ggplot(data) +
  geom_col(aes(x = Category, y = Score,fill=fct_inorder(Category))) +
    scale_fill_manual(values=c("#FF5733", "#75FF33", "#33DBFF", "#BD33FF", "#FF5733", "#FFBD33", "#DBFF33", "#67A613", "#33FF57", "#33FFBD", "#A62D13", "#A65213", "#A67713", "#A69B13", "#8CA613"))
print(barChartSplit)