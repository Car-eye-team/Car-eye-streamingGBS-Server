import * as echarts from 'echarts/core'

import { CanvasRenderer } from 'echarts/renderers'

import {
  BarChart,
  LineChart
} from 'echarts/charts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  DataZoomComponent
} from 'echarts/components'

// 注册必须的组件
echarts.use([
  CanvasRenderer,

  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  DataZoomComponent,

  BarChart,
  LineChart
])

export * from 'echarts/core'