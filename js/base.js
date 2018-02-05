//测试路径url
var url = 'http://suyuan.test.91xinxiang.com';
var prefix_url = 'http://suyuan.test.91xinxiang.com';

//往页面中渲染数据
function render(url, container, html) {
	var count = 0,
		len, data = null,
		page = 1,
		time,
		str = "";

	mui.init({
		swipeBack: false,
		//		keyEventBind: {
		//			backbutton: false //关闭back按键监听
		//		},
		pullRefresh: {
			container: container,
			up: {
				contentrefresh: '正在加载...',
				auto: false,
				callback: pullupRefresh
			}
		}
	});

	/**
	 * 上拉加载具体业务实现
	 */
	//创建vue实例
	var vue = new Vue({
		el: '#app',
		data: {
			data: [],
			search: '',
			cate_name: ''
		},
		created: function() {
			var that = this;
			//初始化页面
			ajax(url, 1, undefined, that);
		},
		mounted: function() {},
		methods: {
			tapEvent: function(event, id, cate_name) {
				console.log(id)
				//页面跳转到新闻详情页
				console.log(event.currentTarget)

				mui.openWindow({
					url: html,
					id: html,
					extras: {
						code: id,
						cate_name: cate_name
					}
				});

			}
		}
	})
	//封装ajax，page：向服务器发送参数获取下拉刷新条数
	function ajax(url, page, loadingContent, that) {
		mui.ajax(url, {
			data: {
				page: page
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(msg) {

				//服务器返回响应，根据响应结果，分析是否登录成功；
				var update_time = "";
				console.log(JSON.stringify(msg))

				if(msg.data) {
					if(msg.data.data) {

						data = msg.data.data;
						if(data.length == 0) {
							console.log('看我的正则表达式写对没' + /keyword/gi.test(url))
							if(/keyword/gi.test(url)) {
								vue.search = '找不到你搜索的内容';
								console.log(vue.search)
							}
						}
					} else {
						data = msg.data;
						if(data.length == 0) {
							console.log('看我的正则表达式写对没' + /keyword/gi.test(url))
							if(/keyword/gi.test(url)) {
								vue.search = '找不到你搜索的内容';
							}
						}

					}

				} else if(msg) {
					if(msg.brand) {
						msg.brand = msg.brand.split(',');
					}
					data = msg;

				}
				if(data) {
					for(var i = 0, len = data.length; i < len; i++) {
						update_time = data[i].update_time;
						data[i].update_time = getDateDiff(update_time * 1000);
					}
				}
				if(data instanceof Array) {
					if(data.length && data[0].thumb) {
						data.forEach(function(item, index) {
							console.log(456565463)
							data[index].thumb = prefix_url + item.thumb;
						})
					}
				} else if(data instanceof Object) {
					data.thumb = prefix_url + data.thumb;
				}
				if(data instanceof Array) {

					if(data.length && data[0].pro_img) {
						data.forEach(function(item, index) {
							data[index].pro_img = prefix_url + item.pro_img;
						})
					}
				} else if(data instanceof Object) {
					data.pro_img = prefix_url + data.pro_img;
					if(data.brand && data.brand.length) {
						data.brand.forEach(function(item, index) {
							data.brand[index] = prefix_url + item;
						})
					}
				}
				console.log('最终的data' + JSON.stringify(data))

				if(loadingContent) {
					console.log('data到底有没有数据了' + JSON.stringify(data))
					loadingContent(data);
				}
				if(that) {
					that.data = data;
					if(data.cate_name) {
						that.cate_name = data.cate_name;
						console.log('这个cate_name是个啥' + that.cate_name)
					}
					if(data.brand) {
						console.log(data.brand)
						data.brand = data.brand.split(',');
						console.log(data.brand)
					}

//					console.log('最终的data' + JSON.stringify(that.data))
				}
				console.log('看看变没变' + JSON.stringify(data))
				console.log('行业动态:' + JSON.stringify(data));
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
			}
		});
	}
	//上拉加载
	function loadingContent(data) {
		setTimeout(function() {
			if(data.length == 0) {
				mui(container).pullRefresh().endPullupToRefresh(true);
			} else {
				mui(container).pullRefresh().endPullupToRefresh();
			}

			var table = document.body.querySelector('.mui-table-view');
			var cells = document.body.querySelectorAll('.mui-table-view-cell');
			vue.data = vue.data.concat(data);

		}, 1000);
	}

	function pullupRefresh() {
		page++;
		ajax(url, page, loadingContent);

	}

}
//js时间转化为几天前,几小时前，几分钟前
function getDateDiff(dateTimeStamp) {
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var year = month * 12;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0) {
		return;
	}
	var yearC = diffValue / year;
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if(yearC >= 1) {
		result = "" + parseInt(yearC) + "年前";
	} else if(monthC >= 1) {
		result = "" + parseInt(monthC) + "月前";
	} else if(weekC >= 1) {
		result = "" + parseInt(weekC) + "周前";
	} else if(dayC >= 1) {
		result = "" + parseInt(dayC) + "天前";
	} else if(hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前";
	} else if(minC >= 1) {
		result = "" + parseInt(minC) + "分钟前";
	} else
		result = "刚刚";
	return result;
}
//function getDateTimeStamp(dateStr){
// return Date.parse(dateStr.replace(/-/gi,"/"));
//}