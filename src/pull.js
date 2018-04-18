const superagent=require('superagent')
const request=require('superagent-charset')(superagent)
require('superagent-proxy')(request);
const util=require('./util')
const fs=require('fs')
count=0;
module.exports={
	// 远程请求
	entry(href,options={}){
		options=Object.assign({
			headers:{},
			method:'get',
			proxy:'',
			charset:'utf-8'
		},options);
		return new Promise((resolve,reject)=>{
			//proxy='http://39.134.10.13:8088';
			let userAgent = util.userAgents[parseInt(Math.random() * util.userAgents.length)]
			request(options.method,href).set(Object.assign({'User-Agent':userAgent},options.headers))
			.timeout({response: util.config.timeout, deadline: util.config.timeout})
			.charset(options.charset)
			.proxy(options.proxy)
			.end((err,res)=>{
				//console.log('entry.......:',count++);
				if(err)reject(err);
				resolve(res);
			})
		})
	},
	// 下载图片
	saveImages(href,filename,dir){
		if(!href)return;
		dir=dir||__dirname;
		if(typeof href ==='string'){
			request.get(href).pipe(fs.createWriteStream(dir+filename))
		}else{
			href.forEach(item=>{
				request.get(item.src).pipe(fs.createWriteStream(dir+item.filename))
			})
		}

	},
}
