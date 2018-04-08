const path=require('path')
module.exports={
	root:__dirname, // 根目录路径 通常 使用 process.cws() 代替
	appPath:path.resolve(__dirname,'app/'), // 模块项目路径
	wsPath:path.resolve(__dirname,'src/'), // 核心框架路径
    userAgentsPath:path.resolve(__dirname,'userAgents'),
	dataPath:path.resolve(__dirname,'data'), // 测试数据路径
	entryFileName:"index.js", // 入口文件 默认名称
	itemFileName:"items.js", // items 默认文件名称
	callbackName:'parse', // 默认入口方法
	limit:1, // 并发量
	debug:true,
	retryCount:3, // 重试次数
	method:'get',
	charset:'utf-8',
	events:{
		items:'ws-items', // items数据事件
		taskpush:'ws-tash-push', // 新增task事件
		cookie:'ws-cookie', // cookie 更新
		newTask:'ws-new-task', // 用户创建新任务 事件
	}
}
