const async=require('async')
const {URL}=require('url')
const util=require('./util')
const task=require('./task')
const pull=require('./pull')

const _init=Symbol('_init')
const _inject=Symbol('_inject')
const _fetch=Symbol('_fetch')
const _runTask=Symbol('_runTask')
class Controller{
    constructor(){
        this.cookie={}
        this.tisking=[]
        this.running=false
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
		if(typeof m[entryName] ==='function'){ // 执行任务
            _this[_runTask]();
		}else{
			this.emit('error',`模块${item}上不存在入口方法${entryName}`)
		}
	}
    // 执行任务
    [_runTask](isFirst=true){
        let _this=this,
            length=util.config.limit,
            limit=isFirst?length*2:1;
        if(this.tisking.length>=length){
            return;
        }
        let _task=task.shift(limit)
        _task.forEach(item=>{
            _this.tisking.push(item);
        })
        if(!_this.running&&_this.tisking.length){
            _this.running=true;
            let newTask=_this.tisking.splice(0,length);
            let maxDelay=util.config.delay;
            async.mapLimit(newTask,length,(item,callback)=>{
                let delay = parseInt((Math.random() * 10000000) % maxDelay, 10);
                setTimeout(function () {
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
                        // 每完成一个任务则继续补加任务
                        _this[_runTask](false);
                        // 该任务完成
                        task.finish(item._index)
                        callback(null,'results');
                    }).catch(err=>{
                        if(err){
                            util.emit('error',err);
                            // 本次任务失败 重试
                            task.setWaitTask(item)
                        }
                    })
                },delay);
            },(err,results)=>{
                if(err)util.emit('error',err);
                // 分段完成（任务流）
                util.emit('data');
            })
        }else{
            _this.running=false;
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

        // 用户结果数据注入
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
        // 初始化、首次执行解析器
		util.on(util.config.events._fetch,data=>{
			this[_fetch](data)
		})
        // 每次新增任务 则触发运行事件
        util.on(util.config.events.taskPush,data=>{
			this[_runTask]()
		})
    }

}
module.exports=Controller
