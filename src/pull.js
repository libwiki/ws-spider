const superagent=require('superagent')
const request=require('superagent-charset')(superagent)
const util=require('./util')
const fs=require('fs')

module.exports={
	// 远程请求
	entry(href,headers={},method='get',charset='utf-8'){
		return new Promise((resolve,reject)=>{
			let userAgent = util.userAgents[parseInt(Math.random() * util.userAgents.length)]
			request(method,href).set(Object.assign({'User-Agent':userAgent},headers))
			.timeout({response: util.config.timeout, deadline: util.config.timeout})
			.charset(charset)
			.end((err,res)=>{
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
