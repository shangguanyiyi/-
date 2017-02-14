					var commentSeries = [];
					var dayCommentsData = pieChartData.dayComments;
					var commentSeriesData = []
					for(channel in dayCommentsData){
						for(info in dayCommentsData[channel]){
							var vName = channelName[info]
							legend.push(vName);
							commentSeries.push(dayCommentsData[channel][info]);
						}
						commentSeriesData.push({name:vName,value:dayCommentsData[channel][info]})
					}
					var commentPieChart = {name:"日评论量",legend:legend,series:commentSeriesData};
					relationCountPieChart("dayComment",commentPieChart.name, commentPieChart.legend, commentPieChart.series);
					
					
					var playPlaytimesSeries = [];
					var playPlaytimesData = pieChartData.playPlayTimes;
					var playPlaytimesSeriesData = []
					for(channel in playPlaytimesData){
						for(info in playPlaytimesData[channel]){
							var vName = channelName[info]
							legend.push(vName);
							playPlaytimesSeries.push(playPlaytimesData[channel][info]);
						}
						playPlaytimesSeriesData.push({name:vName,value:playPlaytimesData[channel][info]})
					}
					var playPlaytimesPieChart = {name:"日评论量",legend:legend,series:playPlaytimesSeriesData};
					relationCountPieChart("tvPlayNums",playPlaytimesPieChart.name, playPlaytimesPieChart.legend, playPlaytimesPieChart.series);


function aa(arrA,variableA,arrB,variableB){
	var arrA = [];
	var variableA = pieChartData.playPlayTimes;
	var arrB = []
	for(channel in variableA){
		for(info in variableA[channel]){
			var vName = channelName[info]
			legend.push(vName);
			arrA.push(variableA[channel][info]);
		}
		arrB.push({name:vName,value:variableA[channel][info]})
	}
	var variableB = {name:"日评论量",legend:legend,series:arrB};
	relationCountPieChart("tvPlayNums",variableB.name, variableB.legend, variableB.series);
}
function bb(quanju){
	var commentSeries = [];
	var dayCommentsData = quanju.dayComments;
	var commentSeriesData = []
	for(channel in dayCommentsData){
		for(info in dayCommentsData[channel]){
			var vName = channelName[info]
			legend.push(vName);
			commentSeries.push(dayCommentsData[channel][info]);
		}
		commentSeriesData.push({name:vName,value:dayCommentsData[channel][info]})
	}
	var commentPieChart = {name:"日评论量",legend:legend,series:commentSeriesData};
	relationCountPieChart("dayComment",commentPieChart.name, commentPieChart.legend, commentPieChart.series);
	
					
}

dayComments\playPlayTimes接口得到的变量值
dayComment\tvPlayNums页面中的id值