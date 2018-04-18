module.exports={
	appPath:'',
	entryName:"parse", // 默认入口方法名称
	baseUrlName:"baseUrl", // 起始链接 变量名称
	limit:3, // 并发量
	delay:2000, //延迟(取该值以内的一个随机数) 单位：ms
	debug:true,
	timeout:3000, //超时 单位：ms
	speed:1000, // 限速 单位：ms
	retryCount:3, // 重试次数
	method:'get',
	charset:'utf-8',
	events:{
		taskPush:'ws-task-push', // 新增task事件
		waitTaskPush:'ws-wait-task-push', //重试任务
		updateCookie:'ws-cookie', // cookie 更新
		newTask:'ws-new-task', // 用户创建新任务 事件
		parseData:'ws-parse-data',// 数据返回解析cookie事件
		_fetch:'ws-event-fetch', // 解析
	}
}
