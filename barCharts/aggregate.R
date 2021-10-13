library(ggplot2)
# install.packages("gridExtra")
library("gridExtra")

aggregatedData <- read.csv("/Users/ko/GitHub/kawaii/data/bar_chart_data.csv", header=TRUE)

theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

barChartSplit <- ggplot(aggregatedData) +
  geom_col(aes(x = Category, y = Score,fill=fct_inorder(Cluster)), position = position_dodge()) +
    scale_fill_manual(values=c("#FF5733", "#75FF33", "#33DBFF", "#BD33FF", "#FF5733", "#FFBD33", "#DBFF33", "#67A613", "#33FF57", "#33FFBD", "#A62D13", "#A65213", "#A67713", "#A69B13", "#8CA613"))
print(barChartSplit)

numPhotos <- 10;

# plotList <- list()
# for (i in 1:numPhotos)
# {
#   subsetData <- aggregatedData[aggregatedData$Photo==i,]
#   print(head(subsetData))
#   barChart <- ggplot(subsetData) +
#   geom_col(aes(x = Category, y = Score))
#   plotList <- c(plotList, barChart)
# }

# grid.arrange(plotList[0], ncol=2)

# subsetData1 <- aggregatedData[aggregatedData$Photo==1,]
#   print(head(subsetData))
#   barChart <- ggplot(subsetData) +
#   geom_col(aes(x = Category, y = Score))
# subsetData2 <- aggregatedData[aggregatedData$Photo==2,]
#   print(head(subsetData))
#   barChart <- ggplot(subsetData) +
#   geom_col(aes(x = Category, y = Score))

# grid.arrange(subsetData1, subsetData2, ncol=2)

# test <- multiplot(plotList=plotList, cols=2)

# print(test)