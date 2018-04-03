const crypto=require('crypto')
const emitter = require('./emitter');
const fs=require('fs')
const path=require('path')
const config=require('../setting')

module.exports={
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
					if(existsSync(filepath)){
						modules.push(item);
					}
			    })
				resolve(modules);
			})
		})
	},
	md5(val){
		let md5=crypto.creteHash('md5');
		return md5.update(val).digest('hex')
	},
	emit(event,data={}){
		if(!event){
			return 'Event parameters do not exist';
		}
		emitter.emit(event,data);
	},
	on(event,data={}){
		return new Promise((resolve,reject)=>{
			if(!event){
				reject('Event parameters do not exist');
			}
			emitter.on(event, data => {
				resolve(data);
		    })
		})
	}
}
