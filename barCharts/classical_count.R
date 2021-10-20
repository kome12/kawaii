library(ggplot2)
library(forcats)

data <- read.csv("/Users/ko/GitHub/kawaii/data/classical_bar_chart_count_data.csv", header=TRUE)

print(head(data))

theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

barChartSplit <- ggplot(data) +
  geom_bar(aes(x = fct_inorder(Category),fill=factor(Score)), position = position_dodge()) +
    scale_fill_manual(values=c("#FF5733", "#75FF33", "#33DBFF", "#BD33FF", "#8CA613", "#FF5733", "#FFBD33", "#DBFF33", "#67A613", "#33FF57", "#33FFBD", "#A62D13", "#A65213", "#A67713", "#A69B13"))
print(barChartSplit)