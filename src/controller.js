const async=require('async')
const {URL}=require('url')
const util=require('./util')
const task=require('./task')
const pull=require('./pull')

const _init=Symbol('_init')
const _parse=Symbol('_parse')
const _fetch=Symbol('_fetch')
class Controller{
    constructor(){
        this.cookie={}
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
    // 执行解析器
	[_fetch](m){
		let _this=this,
		    entryName=util.config.entryName,
		 	baseUrlName=util.config.baseUrlName;
		if(m[baseUrlName]&&m[baseUrlName].length){
			let data={
				url:m[baseUrlName],
				self:m
			}
			util.emit(util.config.events.newTask,data);
		}else{
			util.emit('error',`请先设置起始链接：`.baseUrlName);
			return;
		}
		if(typeof m[entryName] ==='function'){
			let newTask=task.shift(util.config.limit);
			if(newTask){
				async.each(newTask,(item,callback)=>{
					let headers=item.headers||{},
						method=item.method||util.config.method,
						charset=item.charset||util.config.charset,
						myurl=new URL(item.url);
					let Cookie=_this.cookie[myurl.host]||'';
					headers=Object(headers,{Cookie})
					pull.entry(item.url,headers,method,charset).then(rs=>{
						let data={
							self:item.self,
							data:rs,
							callbackName:item.callbackName,
							options:item.options
						}
						util.emit(util.config.events.parseData,data)
					}).catch(err=>{
						if(err)util.emit('error',err)
					})
					callback();
				},err=>{
					if(err)util.emit('error',err);
				})
			}
		}else{
			this.emit('error',`模块${item}上不存在入口方法${entryName}`)
		}
	}
    [_init](){
        // 用户创建新的链接请求
		util.on(util.config.events.newTask,(err,data)=>{
			if(err){
				util.emit('error',err)
			}
			if(!data||!data.url||!data.self){
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
        // cookie 更新
		util.on(util.config.events.updateCookie,data=>{
			if(!data||data.host||data.cookie){
				return;
			}
			this.cookie[data.host]=data.cookie;
		})
        // _
		util.on(util.config.events._fetch,data=>{
			this[_fetch](data)
		})
    }

}
module.exports=Controller
