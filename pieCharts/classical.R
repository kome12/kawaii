library(ggplot2)
library(ggrepel)
library(tidyverse)

data <- read.csv("/Users/ko/GitHub/kawaii/data/classical_pie_chart_data.csv", header=TRUE)
df2 <- data %>% 
  mutate(csum = rev(cumsum(rev(Percentage))), 
         pos = Percentage/2 + lead(csum, 1),
         pos = if_else(is.na(pos), Percentage/2, pos))


theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

pieChartSplit <- ggplot(data, aes(x="", y=Percentage, fill=fct_inorder(Category))) +
  geom_bar(stat="identity", width=1) +
  coord_polar("y", start=0) +
  # geom_text(aes(label = paste0(Percentage, "%"), x = 1.0), position = position_stack(vjust=0.5)) +
  labs(x = NULL, y = NULL, fill = NULL) +
  geom_label_repel(data = df2,
                   aes(y = pos, label = paste0(Percentage, "%")),
                   size = 4.5, nudge_x = 1, show.legend = FALSE) +
  theme(axis.line = element_blank(),
          axis.text = element_blank(),
          axis.ticks = element_blank()) +
  scale_fill_manual(values=c("#FF5733", "#75FF33", "#33DBFF", "#BD33FF", "#FF5733", "#FFBD33", "#DBFF33", "#67A613", "#33FF57", "#33FFBD", "#A62D13", "#A65213", "#A67713", "#A69B13", "#8CA613"))

  print(pieChartSplit)