const request=require('request')
const util=require('./util')
const fs=require('fs')
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
			let headers=Object.assign({'User-Agent':userAgent},options.headers);
			request({
				method:options.method,
				url:href,
				headers,
				encoding:options.charset,
				jar:true,
				timeout:util.config.timeout,
				proxy:options.proxy,
			},(err,res,body)=>{
				if(err){
					//console.log(err.code==='ESOCKETTIMEDOUT');
					reject(err);
				}
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
