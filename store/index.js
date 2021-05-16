import Vue from 'vue'
import Vuex from 'vuex'
var QQMapWX = require('../static/js/qqmap-wx-jssdk.min.js');

Vue.use(Vuex);

import {getWeatherData} from '../apis'

export default new Vuex.Store({
	state: {
		city: '北京',
		weatherList:[]
	},
	mutations: {},
	actions: {
		getCity(context) {
			uni.showLoading({
			    title: '加载中'
			});
			//检测用户是否授权console.log(uni)
			uni.authorize({
				scope: "scope.userLocation",
				success() {
					// 引入腾讯Map api
					let qqmapsdk = new QQMapWX({
						key: '2N7BZ-ZHK33-GTZ3S-372LE-OQNG6-ZJFQS'
					});

					uni.getLocation({
						type: 'gcj02',
						success: function (res) {
							// console.log('当前位置的经度：' + res.longitude);
							// console.log('当前位置的纬度：' + res.latitude);
							
							qqmapsdk.reverseGeocoder({
								location: {
									latitude: res.latitude,
									longitude: res.longitude
								},
								success(res){
									context.state.city = res.result.ad_info.city
									console.log(res.result.ad_info.city)
									getWeatherData(
										{
											city:res.result.ad_info.city
										}
									).then((res)=>{
										let [error,data] = res
										context.state.weatherList = data.data
										// console.log(res)
										console.log(data.data)
										uni.hideLoading();
									})
								}
							})
						}
					});
					//console.log("OK");
				},
				fail(res) {
					// console.log(res);
					uni.showToast({
						icon:"none",
					    title: "需要获取您位置，否则部分功能不能使用",
					    duration: 2000
					});
				},
			})
		}
	}
})