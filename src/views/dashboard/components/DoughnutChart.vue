<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'
// import resize from '../components/mixins/resize'
import { getDeviceStatus } from '@/api/home'
export default {
//   mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      deviceStatus: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      getDeviceStatus().then((res) => {
        this.deviceStatus = res.data
        console.log(this.deviceStatus)

        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['离线', '在线', '总数']
          },
          series: [
            {
              name: '设备数量',
              type: 'pie',
              roseType: 'radius',
              radius: [40, 70],
              center: ['50%', '38%'],
              data: [
                { value: this.deviceStatus.Offline, name: '离线' },
                { value: this.deviceStatus.Online, name: '在线' },
                { value: this.deviceStatus.All, name: '总数' }
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      })
    }
  }
}
</script>
