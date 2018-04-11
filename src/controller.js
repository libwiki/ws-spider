const async=require('async')
const {URL}=require('url')
const util=require('./util')
const task=require('./task')
const pull=require('./pull')

const _init=Symbol('_init')
const _inject=Symbol('_inject')
const _fetch=Symbol('_fetch')
class Controller{
    constructor(){
        this.cookie={}
        this[_init]()
    }
    // 创建新的链接请求
    // options={callbackName,data,headers,method,charset}
	create(self,url,options={}){
        if(!self){
            util.emit('error','Controller/create()方法必须传递当前实例(self)')
            return;
        }
        if(!url){
            util.emit('error','Controller/create()方法必须url参数')
            return;
        }
        options.self=self;
		options.callbackName=options.callbackName||util.config.entryName;
        if(typeof url==='string'){
            options.url=url
            task.push(options);
        }else{
            url.forEach(item=>{
                options.url=item;
                task.push(options);
            })
        }
	}

    // 自动保存cookie 注入用户解析数据
	[_inject](self,res,callbackName,data){
		if(!res)return;
		callbackName=callbackName||util.config.entryName;
		if(res.header&&res.request){
			let cookie=res.header['set-cookie'],
				host=res.request['host'];
			if(cookie&&host){
				util.emit(util.config.events.updateCookie,{host,cookie})
			}
		}
		self[callbackName](self,res,data);
	}
    // 初始化、首次执行解析器
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
							res:rs,
							callbackName:item.callbackName,
							data:item.data
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
    // 事件监听
    [_init](){
        // 用户创建新的链接请求
		util.on(util.config.events.newTask,(err,data)=>{
			if(err){
				util.emit('error',err)
			}
			if(!data||!data.url||!data.self){
				return;
			}
            let options={
                callbackName:data.callbackName,
                data:data.data,
                headers:data.headers
            }
            this.create(data.self,data.url,options);
		})

		util.on(util.config.events.parseData,(err,data)=>{
			if(err){
				util.emit('error',err)
			}
			this[_inject](data.self,data.res,data.callbackName,data.data)
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
