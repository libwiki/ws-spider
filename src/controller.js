const util=require('./util')
const task=require('./task')

const _parse=Symbol('_parse')
const _init=Symbol('_init')
class Controller{
    constructor(){
        this[_init]()
    }

	// 创建新的链接请求
	create(url,self,callbackName,options){
		callbackName=callbackName||util.config.callbackName;
		if(url){
			if(typeof url==='string'){
				let taskItem={url,self,callbackName,options};
				task.push(taskItem);
			}else{
				url.forEach(item=>{
					let taskItem={url:item,self,callbackName,options};
					task.push(taskItem);
				})
			}
		}
	}
    // 获取用户解析数据 生成items
	[_parse](self,data,callbackName,options){
		if(!data)return;
		callbackName=callbackName||util.config.entryName;
		if(data.header&&data.request){
			let cookie=data.header['set-cookie'],
				host=data.request['host'];
			if(cookie&&host){
				util.emit(util.config.events.updateCookie,{host,cookie})
			}
		}
		self[callbackName](self,data,options);
	}
    [_init](){
        // 用户创建新的链接请求
		util.on(util.config.events.newTask,(err,data)=>{
			if(err){
				util.emit('error',err)
			}
			if(!data||data.url||data.self){
				return;
			}
			this.create(data.url,data.self,data.callbackName,data.options);
		})

		util.on(util.config.events.parseData,(err,data)=>{
			if(err){
				util.emit('error',err)
			}
			this[_parse](data.self,data.data,data.callbackName,data.options)
		})
    }
}
module.exports=Controller
