<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'
// import resize from '../components/mixins/resize'
import { getGroupCount } from '@/api/home'
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
      groupCount: {},
      nameList: [],
      countList: []
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
      // this.setOptions(this.chartData)
      this.query()
    },
    query() {
      getGroupCount().then((res) => {
        this.groupCount = res.data
        console.log(this.groupCount)
        // const nameList = []
        // const countList = []
        for (let i = 0; i < this.groupCount.length; i++) {
          this.nameList.push(this.groupCount[i].Name)
          this.countList.push(this.groupCount[i].Cnt)
          console.log('namelist', this.nameList)
        }
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.nameList,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              max: 12,
              interval: 2
            }
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '60%',
              data: this.countList
            }
          ]
        })
        // return this.nameList
      })
    },
    setOptions({ expectedData, actualData } = {}) {
      // getGroupCount().then((res) => {
      //   this.groupCount = res.data
      //   console.log(this.groupCount)

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [
          {
            type: 'value'
          }
        ]
        // series: [
        //   {
        //     name: 'Direct',
        //     type: 'bar',
        //     barWidth: '60%',
        //     data: [10, 52, 200, 334, 390, 330, 220]
        //   }
        // ]
      })
      // xAxis: {
      //   data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      //   boundaryGap: false,
      //   axisTick: {
      //     show: false
      //   }
      // },
      // grid: {
      //   left: 10,
      //   right: 10,
      //   bottom: 20,
      //   top: 30,
      //   containLabel: true
      // },
      // tooltip: {
      //   trigger: 'axis',
      //   axisPointer: {
      //     type: 'cross'
      //   },
      //   padding: [5, 10]
      // },
      // yAxis: {
      //   axisTick: {
      //     show: false
      //   }
      // },
      // legend: {
      //   data: ['expected']
      // },
      // series: [{
      //   name: 'expected', itemStyle: {
      //     normal: {
      //       color: '#FF005A',
      //       lineStyle: {
      //         color: '#FF005A',
      //         width: 2
      //       }
      //     }
      //   },
      //   smooth: true,
      //   type: 'line',
      //   data: [1, 2, 3, 5],
      //   animationDuration: 2800,
      //   animationEasing: 'cubicInOut'
      // }
      // ]
    }
  }
}
</script>
