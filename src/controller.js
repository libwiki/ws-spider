const {URL}=require('url')
const async=require('async')
const pull=require('./pull')
const task=require('./task')
const util=require('../util')
const config=require('../setting')

const controller={
	cookie:{},
	run(name){
		if(!name)return;
		util.getModule(name).then(modules=>{
			let dirname=modules.dirname,index=modules.index,items=modules.items;
			let err=this._create(index.baseUrl,index);
			if(err){
				util.emit('error',err)
				return ;
			}
			let newTask=task.shift(config.limit);
			if(newTask){
				const _this=this;
				async.each(newTask,(item,callback)=>{
					let headers=item.headers||{},
						method=item.method||config.method,
						charset=item.charset||config.charset,
						myurl=new URL(item.url);
					let Cookie=_this.cookie[myurl.host]||'';
					headers=Object(headers,{Cookie})
					pull.entry(item.url,headers,method,charset).then(rs=>{
						_this._parse(item.self,rs,item.callbackName,item.options)
					}).catch(err=>{
						util.emit('error',err)
					})
					callback();
				},err=>{
					util.emit('error',err);
				})
			}
		}).catch(err=>{
			util.emit('error',err);
		})
	},
	// 获取用户解析数据 生成items
	_parse(self,data,callbackName,options){
		if(!data)return;
		callbackName=callbackName||config.callbackName;
		if(data.header&&data.request){
			let cookie=data.header['set-cookie'],
				host=data.request['host'];
			if(cookie&&host){
				util.emit(config.events.cookie,{host,cookie})
			}
		}
		self[callbackName](self,data,options);
	},
	// 创建新的链接请求
	_create(url,self,callbackName,options){
		callbackName=callbackName||config.callbackName;
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
	},
}
// cookie 更新
util.on(config.events.cookie,data=>{
	if(!data||data.host||data.cookie){
		return;
	}
	controller.cookie[data.host]=data.cookie;
})

// 用户创建新的链接请求
util.on(config.events.newTask,(err,data)=>{
	if(err){
		util.emit('error',err)
	}
	if(!data||data.url||data.self){
		return;
	}
	controller._create(data.url,data.self,data.callbackName,data.options);
})
// 所有错误监听
util.on('error',err=>{
	if(err&&config.debug){
		console.log(err);
	}
})
module.exports=controller
