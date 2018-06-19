<!-- ECharts -- 运营概况 -->
<template>
  <div>
    <el-row>
      <el-col :span="2"><h3>运营概况</h3></el-col>
      <el-radio-group >
        <el-radio-button label="今日新增"></el-radio-button>
        <el-radio-button label="昨日新增"></el-radio-button>
        <el-radio-button label="本月新增"></el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row style="margin: 25px 7% auto 7%" :gutter="20">
      <el-col :span="3">浏览次数(PV)<br/>
        <h3>221</h3>
      </el-col>
      <el-col :span="3">独立访客(UV)<br/>
        <h3>221</h3>
      </el-col>
      <el-col :span="3">注册用户<br/>
        <h3>221</h3>
      </el-col>
      <el-col :span="3">付费用户<br/>
        <h3>221</h3>
      </el-col>
      <el-col :span="3">课程订单<br/>
        <h3>221</h3>
      </el-col>
      <el-col :span="3">订单收入<br/>
        <h3>221元</h3>
      </el-col>
    </el-row>
    <div id="sChart" :style="{width: '80%', height: '500px', marginTop: '50px'}"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        xAxis: [
          '00:00', '04:00', '08:00', '12:00', '16:00', '20:00'
        ]
      }
    },
    mounted() {
      this.drawLine()
    },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        const sChart = echarts.init(document.getElementById('sChart'))
        // 绘制图表
        sChart.setOption({
          // title: { text: '运营概况' },
          legend: {
            data: ['独立访客', '注册用户', '付费用户', '订单收入']
          },
          tooltip: {},
          xAxis: {
            // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            data: this.xAxis
          },
          yAxis: {},
          series: [
            {
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#87CEFA'
                  }
                }
              },
              name: '独立访客',
              type: 'line',
              data: [8, 5, 7, 13, 15, 10, 12],
              markPoint: {
                // data: [
                //   { type: 'max' },
                //   { type: 'min' }
                // ]
              }
            },
            {
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#32CD32'
                  }
                }
              },
              name: '注册用户',
              type: 'line',
              data: [4, 6, 8, 3, 6, 5, 7],
              markPoint: {
                // data: [
                //   { type: 'max' },
                //   { type: 'min' }
                // ]
              }
            },
            {
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#F0E68C'
                  }
                }
              },
              name: '付费用户',
              type: 'line',
              data: [2, 1, 4, 2, 6, 3, 3],
              markPoint: {
                // data: [
                //   { type: 'max' },
                //   { type: 'min' }
                // ]
              }
            },
            {
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#FF0000'
                  }
                }
              },
              name: '订单收入',
              type: 'line',
              data: [6, 12, 7, 9, 13, 10, 11],
              markPoint: {
                // data: [
                //   { type: 'max' },
                //   { type: 'min' }
                // ]
              }
            }
          ]
        })
      }
    }
  }
</script>

<style scoped>
  sChart{
    margin: 50px 2% auto 2%;
  }
</style>
