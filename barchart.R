library(ggplot2)

# print(Sys.getlocale(category = "LC_CTYPE"))
# original_ctype <- Sys.getlocale(category = "LC_CTYPE")
# Sys.setlocale("LC_CTYPE","japanese")

aggregatedData <- read.csv("/Users/ko/GitHub/kawaii/data/bar_chart_data.csv", header=TRUE)

print(head(aggregatedData))

theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))

aggregatedBarChartSplit <- ggplot(aggregatedData) +
  geom_col(aes(x = Category, y = Score)) +
  facet_wrap("Photo")
print(aggregatedBarChartSplit)