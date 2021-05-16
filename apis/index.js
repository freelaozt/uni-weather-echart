const baseUrl = ""

export const getWeatherData=params=>(
	// new Promise((resolve,reject)=>{
		uni.request({
			url:"https://bird.ioliu.cn/weather",
			data:params,
			header:{
				"content-type":"json"
			},
			// success(res){
			// 	resolve(res)
			// }
		})
	// })
)