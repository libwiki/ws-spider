const crypto=require('crypto')
const config=require('./setting')
const emitter = require('./src/emitter');
const fs=require('fs')
const path=require('path')
const cheerio=require('cheerio')

module.exports={
	// 获取模块
	getModule(name){
		return new Promise((resolve,reject)=>{
			if(!name)reject('The name parameters do not exist');
			this.getModules().then(modules=>{
				if(modules.indexOf(name)>=0){
					let data={},
						indexPath=path.resolve(config.appPath,name,config.entryFileName),
						itemsPath=path.resolve(config.appPath,name,config.itemFileName);
					data.dirname=path.resolve(config.appPath,name)
					data.index=require(indexPath);
					data.items=require(itemsPath);
					resolve(data)
				}
			}).catch(err=>{
				reject(err)
			})
		})
	},
	// 遍历获取所有模块名
	getModules(){
		return new Promise((resolve,reject)=>{
			let dirpath=config.appPath;
			fs.readdir(dirpath,(err,res)=>{
			    if(err){
			        reject(err);
			    }
				let modules=[];
			    res.forEach(item=>{
					// 确保必须每个模块下必须存在入口文件
			        let filepath=path.join(dirpath,item,config.entryFileName);
					if(fs.existsSync(filepath)){
						modules.push(item);
					}
			    })
				resolve(modules);
			})
		})
	},
	parse(text){
		if(text){
			return cheerio.load(text);
		}
	},
	// md5 加密
	md5(val){
		let md5=crypto.createHash('md5');
		return md5.update(val).digest('hex')
	},
	// 事件注册
	emit(event,data={}){
		if(!event){
			return 'The event parameters do not exist';
		}
		emitter.emit(event,data);
	},
	// 事件响应
	on(event,callback){
		if(typeof callback==='function'){
			if(!event){
				if(callback.length>1){
					let err='The event parameters do not exist';
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
}
