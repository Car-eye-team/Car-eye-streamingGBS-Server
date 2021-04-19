const COLORS = ['#337ab7', '#7FFFD4']

const TEXT_STYLE = {
    fontFamily: 'PingFang SC'
}

export const memoryOption = {
    title: {
        text: '内存使用',
        left: 'center',
        subtext: ''
    },
    textStyle: TEXT_STYLE,
    grid: {
        top: 60,
        left: 10,
        right: 30,
        bottom: 5,
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        },
        formatter(p) {
            p = p[0]
            return `<div style="margin-bottom: 5px;">${p.axisValue}</div>${p.marker}<span style="margin-left: 5px; font-weight: bold;">${p.data ? p.data.toFixed(2) : 0} %</span>`
        }
    },
    dataZoom: {
        type: 'inside',
        startValue: 1,
        zoomLock: true,
        moveOnMouseWheel: false,
        moveOnMouseMove: false
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine:{
            show: true
        },
        axisLabel: {
            // rotate: 45,
            showMinLabel: true,
            showMaxLabel: true,
            formatter: v => v.slice(10)
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: {
            show: false
        },
        axisLabel: {
            show: true,
            formatter: val => val + '%'
        },
        axisTick: {
            show: false
        },
        splitLine:{
            show: true
        }
    },
    series: {
        name: '使用',
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
            color: COLORS[0]
        },
        lineStyle: {
            color: COLORS[0],
            width: 1
        },
        areaStyle: {
            opacity: 0.7
        },
        emphasis: {
            label: {
                show: true,
                formatter: v => v.value.toFixed(2) + ' %',
                fontWeight: 'bold'
            }
        }
    }
}

export const cpuOption = {
    color: COLORS,
	title: {
		text: 'CPU使用',
		left: 'center'
	},
    textStyle: TEXT_STYLE,
    grid: {
        top: 60,
        left: 10,
        right: 30,
        bottom: 5,
        containLabel: true
    },
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'line'
		},
		// formatter(params) {
        //     const data = params[0].data;
        //     const time = data.time.slice(10);
        //     const marker = params[0].marker;
        //     const seriesName = params[0].seriesName;
        //     return `<span class="line-height: 1.5;">${time}</span><br>${marker}${seriesName}<span style="float: right; margin-left: 10px; font-weight: bold;">${(data.used).toFixed(2)}%</span>`
        // }
        formatter(p) {
            p = p[0]
            return `<div style="margin-bottom: 5px;">${p.axisValue}</div>${p.marker}<span style="margin-left: 5px; font-weight: bold;">${p.data ? p.data.toFixed(2) : 0} %</span>`
        }
	},
    dataZoom: {
        type: 'inside',
        startValue: 1,
        zoomLock: true,
        moveOnMouseWheel: false,
        moveOnMouseMove: false
    },
	xAxis: {
		type: 'category',
        boundaryGap: false,
        axisLine: {
        	show: false
        },
        axisTick: {
			show: false
		},
        splitLine:{
        	show: true
        },
        axisLabel: {
            // rotate: 45,
            showMinLabel: true,
            showMaxLabel: true,
            formatter: v => v.slice(10)
        }
    },
    yAxis: {
    	type: 'value',
    	min: 0,
    	max: 100,
    	axisLine: {
        	show: false
        },
        axisLabel: {
        	show: true,
        	formatter: val => val + '%'
        },
        axisTick: {
			show: false
		},
        splitLine:{
        	show: true
        }
    },
    series: {
    	name: '使用',
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
            color: COLORS[1]
        },
        lineStyle: {
            color: COLORS[1],
            width: 1
        },
        areaStyle: {
            opacity: 0.7
        },
        emphasis: {
            label: {
                show: true,
                formatter: v => v.value.toFixed(2) + ' %',
                fontWeight: 'bold'
            }
        }
    }
}

export const diskOption = {
    color: COLORS,
    title: {
		text: '存储使用',
		left: 'center'
	},
    textStyle: TEXT_STYLE,
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'line'
		}
	},
	legend: {
		data: ['已使用(G)', '剩余(G)'],
		bottom: 0,
        icon: 'circle'
	},
	grid: {
		top: 40,
		left: '3%',
        right: '4%',
        bottom: '13%',
		containLabel: true
	},
	xAxis: {
		type: 'value',
		axisTick: {
			show: false
		},
		axisLine: {
			show: false
		}
	},
	yAxis: {
		type: 'category',
		axisTick: {
			show: false
		},
		axisLine: {
			show: false
		},
        axisLabel: {
            width: 80,
            overflow: 'truncate'
        },
		data: []
	},
	series: [{
		name: '已使用(G)',
		type: 'bar',
		stack: '磁盘使用',
		barMaxWidth: 20,
		data: [],
        emphasis: {
            // focus: 'series',
            label: {
                show: true
            }
        }
	}, {
		name: '剩余(G)',
		type: 'bar',
		stack: '磁盘使用',
		barMaxWidth: 20,
		data: [],
        emphasis: {
            // focus: 'series',
            label: {
                show: true
            }
        }
	}]
}

export const bandwidthOption = {
    title: {
		text: '下行带宽使用',
		left: 'center',
        subtext: '0 Mbps'
	},
    textStyle: TEXT_STYLE,
    grid: {
        top: 60,
        left: 5,
        right: 10,
        bottom: 0,
        containLabel: true
    },
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'line'
		},
		formatter(params) {
			const data = params[0].data
        	const marker = params[0].marker
            return `<div style="margin-bottom: 5px;">${data.time}</div>${marker}<span style="margin-left: 5px; font-weight: bold;">${data.down ? data.down.toFixed(3) : 0} ${data.unit}</span>`
        }
	},
	dataset: {
		dimensions: ['time', 'down'],
        source: []
    },
	xAxis: {
		type: 'time',
        boundaryGap: false,
        axisLine: {
        	show: false
        },
        axisTick: {
			show: false
		},
        splitLine:{
        	show: true
        },
        axisLabel: {
            rotate: 45,
            //showMinLabel: true,
            showMaxLabel: true,
            formatter: '{HH}:{mm}:{ss}'
        }
    },
    yAxis: {
    	type: 'value',
        min: 0,
        minInterval: 1,
    	axisLine: {
        	show: false
        },
        axisTick: {
			show: false
		},
        splitLine:{
        	show: true
        },
        axisLabel: {
            formatter: v => v + ' Mbps'
        }
    },
    series: {
        name: '使用',
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
            color: COLORS[1]
        },
        lineStyle: {
            color: COLORS[1],
            width: 1
        },
        areaStyle: {
            opacity: 0.7
        },
        emphasis: {
            label: {
                show: true,
                formatter: v => v.data.down.toFixed(3) + ' Mbps',
                fontWeight: 'bold'
            }
        }
    }
}

export const flowOption = {
	color: COLORS,
	title: {
		text: '流量统计',
		left: 'center',
		subtext: '{bold|↑} 0 K/s  {bold|↓} 0 K/s',
        subtextStyle: {
            rich: {
                bold: {
                    fontWeight: 'bolder',
                    color: '#000'
                }
            }
        }
	},
    textStyle: TEXT_STYLE,
    grid: {
		top: 60,
		left: '3%',
        right: '4%',
        bottom: '8%',
		containLabel: true
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'none'
		}
	},
	legend: {
		data: ['上行流量(G)', '下行流量(G)'],
		bottom: 0,
        icon: 'circle',
        selectedMode: false
	},
	xAxis: {
		show: false,
		type: 'category',
		data: ['流量统计'],
		axisTick : {
			show : false
		},
		axisLine : {
			show : false
		}
	},
	yAxis: {
		type: 'value',
		axisTick: {
			show: false
		},
		axisLine: {
			show: false
		}
	},
	series: [{
		name: '上行流量(G)',
		type: 'bar',
		barWidth: '10%',
		barGap: '150%',
		data: [],
        emphasis: {
            label: {
                show: true,
                position: 'top'
            }
        }
	}, {
		name: '下行流量(G)',
		type: 'bar',
		barWidth: '10%',
		barGap: '150%',
		data: [],
        emphasis: {
            label: {
                show: true,
                position: 'top'
            }
        }
	}],
    animationDurationUpdate: 0
}

export function getSuitableUnit(rawData) {
	let unit = 'B/s'
	if (rawData >= 1024) {
		const lt = rawData < 1048576
		unit = lt ? 'K/s' : 'M/s'
		rawData = lt ? rawData / 1024 : rawData / 1048576
	}
	return rawData.toFixed(2) + ' ' + unit
}