module.exports={
	appPath:'',
	entryName:"parse", // 默认入口方法名称
	baseUrlName:"baseUrl", // 起始链接 变量名称
	limit:3, // 并发量
	debug:true,
	timeout:3000, //超时 单位：ms
	speed:1000, // 限速 单位：ms
	retryCount:3, // 重试次数
	method:'get',
	charset:'utf-8',
	events:{
		taskPush:'ws-tash-push', // 新增task事件
		updateCookie:'ws-cookie', // cookie 更新
		newTask:'ws-new-task', // 用户创建新任务 事件
		parseData:'ws-parse-data',// 数据返回解析cookie事件
		_fetch:'ws-event-fetch', // 解析
	}
}
