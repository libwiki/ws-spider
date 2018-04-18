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
        this.tasking=[]
        this.running=false
        this[_init]()
        this.count=0;
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
                this.cookie[host]=cookie;
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
            this.create(m,m[baseUrlName]);
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
    [_runTask](){
        let _this=this,
            length=util.config.limit,
            limit=length*2;
        let _task=task._shift(limit)
        _this.tasking.push(..._task)

        if(_this.tasking.length){
            let newTask=_this.tasking.splice(0,length);
            async.mapLimit(newTask,length,(item,callback)=>{
                let headers=item.headers||{},
                    method=item.method||util.config.method,
                    proxy=item.proxy||'',
                    charset=item.charset||util.config.charset,
                    Host=new URL(item.url);
                let Cookie=_this.cookie[Host]||'';
                let options={
        			headers:Object(headers,{Cookie,Host}),
        			method,
        			proxy,
        			charset
        		};
                setTimeout(_=>{
                    util.emit('send',item); // 每次发送请求钩子
                    pull.entry(item.url,options).then(res=>{
                        _this[_inject](item.self,res,item.callbackName,item.data)
                        // 每完成一个任务则继续补加任务
                        _this[_runTask]();
                        // 该任务完成
                        task.finish(item._index)
                        callback(null,'results');
                    }).catch(err=>{
                        if(err){
                            if(!err.timeout){ //仅捕获非超时错误
                                util.emit('error',err);
                            }
                            // 本次任务失败 重试
                            process.nextTick(_=>{
                                console.log('setWaitTask...',item._repeat,_this.count++);
                                task.setWaitTask(item)
                            })
                        }
                    })
                },util.config.speed)
            },(err,results)=>{
                if(err)util.emit('error',err);
            })
        }
    }
    // 事件监听
    [_init](){
        // 初始化、首次执行解析器
		util.on(util.config.events._fetch,data=>{
			this[_fetch](data)
		})
        // 每次新增任务 则触发运行事件
        util.on(util.config.events.taskPush,data=>{
			this[_runTask]()
		})
        // 每次新增重试任务 则触发运行事件
        util.on(util.config.events.waitTaskPush,data=>{
			this[_runTask]()
		})
    }

}
module.exports=Controller
