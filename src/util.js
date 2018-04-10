const crypto=require('crypto')
const fs=require('fs')
const {URL}=require('url')
const path=require('path')
const config=require('./setting')
const userAgents=require('./userAgents')
const emitter = require('./emitter');


const _init=Symbol('_init')
const _fetch=Symbol('_fetch')
class Util{
	constructor(){
		this.cookie={}
		this.config=config
		this.userAgents=userAgents
		this[_init]();
	}
	run(val=1){
		if(typeof val==='number'){
			const _this=this,
				entryFunction=_this.config.entryFunction,
				appPath=_this.config.appPath;
			_this.getModules().then(modules=>{
				async.eachLimit(modules,val,(item,callback)=>{
					// 这里执行每个模块的爬取
					let Item=require(path.join(appPath,item)),
						m=new Item();
					_this[_fetch](m,item,_this);
					callback();
				},err=>{
					if(err){
						this.emit('error',err);
					}
				})
			})
		}else if(typeof val==='string'){
			const _this=this,
			_this.getModule(val).then(m=>{

			})
		}
	}
	// 获取模块
	getModule(name){
		return new Promise((resolve,reject)=>{
			if(!name)reject('缺少一个关于模块名称的形参');
			this.getModules().then(modules=>{
				if(modules.indexOf(name)>=0){
					let modulePath=path.resolve(this.config.appPath,name)
					resolve(require(modulePath))
				}
			}).catch(err=>{
				reject(err)
			})
		})
	}
	// 遍历获取所有模块名
	getModules(){
		return new Promise((resolve,reject)=>{
			let dirpath=this.config.appPath;
			console.log(dirpath);
			fs.readdir(dirpath,(err,res)=>{
			    if(err){
			        reject(err);
			    }
				let modules=[];
				if(res){
				    res.forEach(item=>{
						let filepath=path.join(dirpath,item),
							stat=fs.statSync(filepath);
						if(stat.isFile()&&item.indexOf('.js')>0){
							modules.push(path.basename(item,'.js'));
						}
				    })
				}
				resolve(modules);
			})
		})
	}
	// md5 加密
	md5(val){
		let md5=crypto.createHash('md5');
		return md5.update(val).digest('hex')
	}
	// 事件注册
	emit(event,data={}){
		if(!event){
			return 'event 事件名称不可为空';
		}
		emitter.emit(event,data);
	}
	// 事件响应
	on(event,callback){
		if(typeof callback==='function'){
			if(!event){
				if(callback.length>1){
					let err='event 事件名称不可为空';
					callback(err);
				}
				return;
			}
			emitter.on(event, data => {
				if(callback.length>1){
					callback(undefined,data);
				}else{
					callback(data);
				}
			})
		}
	}
	// 初始化
	[_init](){
		// 所有错误监听
		this.on('error',err=>{
			if(err&&this.config.debug){
				console.log(err);
			}
		})
		// cookie 更新
		this.on(this.config.events.cookie,data=>{
			if(!data||data.host||data.cookie){
				return;
			}
			this.cookie[data.host]=data.cookie;
		})

	}
	// 执行解析器
	[_fetch](m,item,_this){
		_this=_this||this;
		if(typeof m[entryFunction] ==='function'){
			let newTask=task.shift(_this.config.limit);
			if(newTask){
				async.each(newTask,(item,callback)=>{
					let headers=item.headers||{},
						method=item.method||_this.config.method,
						charset=item.charset||_this.config.charset,
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
						_this.emit(_this.config.events.parseData,data)
					}).catch(err=>{
						if(err)_this.emit('error',err)
					})
					callback();
				},err=>{
					if(err)_this.emit('error',err);
				})
			}
		}else{
			this.emit('error',`模块${item}上不存在入口方法${entryFunction}`)
		}
	}

}
module.exports=new Util();
