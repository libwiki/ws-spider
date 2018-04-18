const crypto=require('crypto')
const fs=require('fs')
const path=require('path')
const async=require('async')
const config=require('./setting')
const userAgents=require('./userAgents')
const emitter = require('./emitter');

const _init=Symbol('_init')
class Util{
	constructor(){
		this.config=config
		this.userAgents=userAgents
		this.startTime=0;
		this[_init]();
		this.count=0
	}
	run(val=1){
		if(this.startTime===0){
			this.emit('start'); //开始执行钩子
			this.startTime=new Date().getTime();
		}
		if(typeof val==='number'){
			const _this=this,
				entryName=_this.config.entryName,
				appPath=_this.config.appPath;
			_this.getModules().then(modules=>{
				async.eachLimit(modules,val,(item,callback)=>{
					// 这里执行每个模块的爬取
					let Item=require(path.join(appPath,item)),
						m=new Item();
					_this.emit(_this.config.events._fetch,m)
					callback();
				},err=>{
					if(err){
						this.emit('error',err);
					}
				})
			}).catch(err=>{
				if(err)_this.emit('error',err);
			})
		}else if(typeof val==='string'){
			const _this=this;
			_this.getModule(val).then(m=>{
				_this.emit(_this.config.events._fetch,m)
			}).catch(err=>{
				if(err)_this.emit('error',err);
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
				if(err)reject(err);
			})
		})
	}
	// 遍历获取所有模块名
	getModules(){
		return new Promise((resolve,reject)=>{
			let dirpath=this.config.appPath;
			fs.readdir(dirpath,(err,res)=>{
			    if(err){
			        reject(err);
			    }
				let modules=[];
				if(res){
				    res.forEach(item=>{
						let filepath=path.join(dirpath,item),
							stat=fs.statSync(filepath);
						if(stat.isDirectory()||(stat.isFile()&&item.indexOf('.js'))>0){
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
	// 深拷贝
	clone(data){
		let obj,
			type=null,
			_this=this,
			map = {
	          	'[object Array]':'array',
	          	'[object Object]':'object'
	      	};
      	if(typeof data==='object'){
      		type = Object.prototype.toString.call(data);
      		type=map[type];
      	}else{
      		type=typeof data;
      	}
       	if(type === 'array'){
           obj = [];
       	} else if(type === 'object'){
           obj = {};
       	} else {
           //不再具有下一层次
           return data;
       	}
       	for(let key in data){
           obj[key] = _this.clone(data[key]);
       	}
       	return obj;
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
	// 合并用户配置
	setting(config={},userAgents={}){
		if(config.events){
            delete config.events
        }
		this.config=Object.assign(this.config,config)
		this.userAgents=Object.assign(this.userAgents,userAgents)
	}
	// 初始化
	[_init](){
		// 所有错误监听
		this.on('error',err=>{
			if(err&&this.config.debug){
				console.log('错误:',err);
			}
		})
		// 任务完成监听
		this.on('start',data=>{
			console.log('开始执行...');
		})
		// 每一次爬取请求 触发的钩子 可以给用户一些交互反馈
		this.on('send',item=>{
			//console.log(item.url);
		})
		// 任务完成监听
		this.on('end',data=>{
			let duration=new Date().getTime()-this.startTime;
			console.log('任务完成...');
			console.log('总任务数：'+data.total);
			console.log('失败任务数：'+data.failTask.length);
			console.log('总耗时(ms)：'+duration);
		})
	}

}
module.exports=new Util();
