<template>
  <view class="content">
    <view class="uni-padding-wrap uni-common-mt">
      <view class="text-box-local" scroll-y="true">
        <text>当前定位：{{ getWeatherCity }}</text>
      </view>
    </view>

    <view class="box-ec">
      <view class=""> 未来几个小时天气预报 </view>
      <uni-ec-canvas
        class="uni-ec-canvas"
        id="uni-ec-canvas"
        ref="uni-ec-canvas"
        canvas-id="uni-ec-canvas"
        :ec="ec2"
        @inited="inited"
      ></uni-ec-canvas>
      <view class=""> 未来一周气温变化 </view>
      <uni-ec-canvas
        class="uni-ec-canvas"
        id="uni-ec-canvas"
        ref="uni-ec-canvas"
        canvas-id="uni-ec-canvas"
        :ec="ec3"
        @inited="inited"
      ></uni-ec-canvas>
      <view class=""> 未来几日天气预报 </view>
      <uni-ec-canvas
        class="uni-ec-canvas"
        id="uni-ec-canvas"
        ref="uni-ec-canvas"
        canvas-id="uni-ec-canvas"
        :ec="ec"
        @inited="inited"
      ></uni-ec-canvas>
    </view>
  </view>
</template>

<script>
import { getWeatherData } from "../../apis/index.js";
import uniEcCanvas from "../../components/uni-ec-canvas/uni-ec-canvas.vue";
export default {
  data() {
    return {
      ec: {
        option: option,
      },
      ec2: {
        option: option2,
      },
      ec3: {
        option: option3,
      },
    };
  },
  onReady() {
    this.$store.dispatch("getCity");
    setTimeout(() => {
      //数组内的数据要$set哦
      this.eventGetCity();
      console.log("折线图数据改变啦");
    }, 2000);
  },
  components: {
    uniEcCanvas,
  },
  computed: {
    nowWeatherList() {
      console.log("Now:", this.$store.state.weatherList);
      return this.$store.state.weatherList;
    },
    getWeatherCity() {
      return this.$store.state.city;
    },
  },
  methods: {
    inited(chart) {
      console.log("图表初始化完毕");
      console.log("chart实例", chart);
    },
    eventGetCity() {
      let aqi = this.nowWeatherList.aqi;
      let basic = this.nowWeatherList.basic;
      let daily_forecast = this.nowWeatherList.daily_forecast;
      let hourly_forecast = this.nowWeatherList.hourly_forecast;
      let now = this.nowWeatherList.now;
      let status = this.nowWeatherList.status;
      let suggestion = this.nowWeatherList.suggestion;

      let tmpHourlyList = hourly_forecast.map((item) => {
        return item.tmp;
      });

      let humHourlyList = hourly_forecast.map((item) => {
        return item.hum;
      });
      let popHourlyList = hourly_forecast.map((item) => {
        return item.pop;
      });
      let presHourlyList = hourly_forecast.map((item) => {
        return item.pres;
      });
      let dateHourlyList = hourly_forecast.map((item) => {
        return item.date.substr(11) + `\r\n${item.cond.txt}`;
      });

      //dailyCloudList
      let dailyCloudList = daily_forecast.map((item) => {
        return item.cloud;
      });
      let dailyHumList = daily_forecast.map((item) => {
        return item.hum;
      });
      let dailyVisList = daily_forecast.map((item) => {
        return item.vis;
      });
      let dailypcpnList = daily_forecast.map((item) => {
        return item.pcpn;
      });
      let dailypresList = daily_forecast.map((item) => {
        return item.pres;
      });
      let dailypopList = daily_forecast.map((item) => {
        return item.pop;
      });
      let dailyuvList = daily_forecast.map((item) => {
        return item.uv;
      });
      let maxDailyList = daily_forecast.map((item) => {
        return item.tmp.max;
      });
      let minDailyList = daily_forecast.map((item) => {
        return item.tmp.min;
      });
      let dailyDateList = daily_forecast.map((item) => {
        return (
          item.date.substr(6) + `\r\n${item.cond.txt_d}\r\n${item.wind.dir}`
        );
      });

      this.ec.option = {
        title: {
          text: "",
        },
        xAxis: {
          type: "category",
          data: dailyDateList,
        },
        series: [
          {
            name: "cloud云层",
            data: dailyCloudList,
          },
          {
            name: "hum相对湿度",
            data: dailyHumList,
          },
          {
            name: "pcpn降水量",
            data: dailypcpnList,
          },
          {
            name: "pop降水概率",
            data: dailypopList,
          },
          {
            name: "pres大气压",
            data: dailypresList,
          },
          {
            name: "uv紫外线指数",
            data: dailyuvList,
          },
          {
            name: "vis能见度",
            data: dailyVisList,
          },
        ],
      };

      this.ec2.option = {
        title: {
          text: "",
        },
        xAxis: {
          type: "category",
          data: dateHourlyList,
        },
        series: [
          {
            name: "tmp温度",
            data: tmpHourlyList,
          },
          {
            name: "hum相对湿度",
            data: humHourlyList,
          },
          {
            name: "pop降水概率",
            data: popHourlyList,
          },
          {
            name: "pres大气压",
            data: presHourlyList,
          },
        ],
      };

      this.ec3.option = {
        title: {
          text: "",
          subtext: "",
        },
        xAxis: {
          data: dailyDateList,
        },
        series: [
          {
            name: "最高气温",
            type: "line",
            data: maxDailyList,
          },
          {
            name: "最低气温",
            type: "line",
            data: minDailyList,
          },
        ],
      };
    },
  },
};

var option = {
  title: {
    text: "",
  },
  legend: {
    data: ["cloud", "hum", "pcpn", "pop", "pres", "uv", "vis"],
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      axis: "x",
      label: {
        backgroundColor: "#000000",
      },
    },
  },
  grid: {
    left: "6%",
    right: "6%",
    top: "6%",
    bottom: "6%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["2-12", "2-14", "2-16", "2-18", "2-20", "2-22", "2-24"],
    axisLine: {
      // y轴
      show: false,
    },
    axisTick: {
      // y轴刻度线
      show: false,
    },
    splitLine: {
      // 网格线
      show: false,
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      // y轴
      show: false,
    },
    axisTick: {
      // y轴刻度线
      show: false,
    },
    splitLine: {
      // 网格线
      show: false,
    },
  },
  series: [
    {
      name: "cloud云层",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 23, 52, 90, 230, 210],
    },
    {
      name: "hum相对湿度",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "pcpn降水量",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "pop降水概率",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: "pres大气压",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: "uv紫外线指数",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: "vis能见度",
      type: "line",
      stack: "总量",
      label: {
        show: true,
        position: "top",
      },
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};

var option2 = {
  title: {
    text: "",
  },
  legend: {
    data: ["tmp温度", "hum", "pcpn", "pop", "pres", "uv", "vis"],
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      axis: "x",
      label: {
        backgroundColor: "#000000",
      },
    },
  },
  grid: {
    left: "6%",
    right: "6%",
    top: "6%",
    bottom: "6%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["2-12", "2-14", "2-16", "2-18", "2-20", "2-22", "2-24"],
    axisLine: {
      // y轴
      show: false,
    },
    axisTick: {
      // y轴刻度线
      show: false,
    },
    splitLine: {
      // 网格线
      show: false,
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      // y轴
      show: false,
    },
    axisTick: {
      // y轴刻度线
      show: false,
    },
    splitLine: {
      // 网格线
      show: false,
    },
  },
  series: [
    {
      name: "tmp温度",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 23, 52, 90, 230, 210],
    },
    {
      name: "hum相对湿度",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "pop降水概率",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: "pres大气压",
      type: "line",
      stack: "总量",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [150, 232, 201, 154, 190, 330, 410],
    },
  ],
};

var option3 = {
  title: {
    text: "",
    subtext: "",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["最高气温", "最低气温"],
  },
  toolbox: {},
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value} °C",
    },
  },
  series: [
    {
      name: "最高气温",
      type: "line",
      data: [10, 11, 13, 11, 12, 12, 9],
      markPoint: {
        data: [
          { type: "max", name: "最大值" },
          { type: "min", name: "最小值" },
        ],
      },
      markLine: {
        data: [{ type: "average", name: "平均值" }],
      },
    },
    {
      name: "最低气温",
      type: "line",
      data: [1, -2, 2, 5, 3, 2, 0],
      markPoint: {
        data: [{ name: "周最低", value: -2, xAxis: 1, yAxis: -1.5 }],
      },
      markLine: {
        data: [
          { type: "average", name: "平均值" },
          [
            {
              symbol: "none",
              x: "90%",
              yAxis: "max",
            },
            {
              symbol: "circle",
              label: {
                position: "start",
                formatter: "最大值",
              },
              type: "max",
              name: "最高点",
            },
          ],
        ],
      },
    },
  ],
};
</script>

<style>
.content {
}
.box-ec {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.uni-ec-canvas {
  width: 100%;
  height: 750rpx;
  display: block;
}
.text-box-local {
  color: #999999;
  font-size: 26rpx;
  margin-top: 28rpx;
  font-weight: 400;
}
</style>
