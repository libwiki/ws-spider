const events= require('events')
const emitter=new events.EventEmitter();
const util=require('./util')
module.exports={
	allUrl:new Set(), //url 去重
	task:[], //待执行任务
	tasking:{}, // 正在执行的任务
	tasked:[], // 已完成任务
	waitTask:[], // 失败等待重试任务
	failTask:[], // 失败任务
	// {url,headers} 新任务添加
	push(val){
		if(val[0]){
			val.forEach(item=>{
				if(!this.allUrl.has(item.url)){
					this.allUrl.add(item.url)
					this.task.push(item)
					emitter.emit('push',item)
				}
			})
		}else{
			if(!this.allUrl.has(val)){
				this.allUrl.add(val)
				this.task.push(val)
				emitter.emit('push',val)
			}
		}

	},
	//获取执行任务
	shift(length=1){
		if(length<1||this.isEmpty()){
			return;
		}
		let newTask=this.task.splice(0,length);
		let less=length-newTask;
		if(less){
			newTask.push(this.waitTask.splice(0,less))
		}
		newTask.map(item=>{
			if(typeof item._repeat==='undefined'){
				item._repeat=1;
			}else{
				item._repeat++;
			}
			if(!item._index){
				item._index=util.md5(item.url)
			}
			this.tasking[item._index]=item;
			return item;
		})
		return newTask;
	},
	// 任务完成
	endTask(index,type=true){
		if(!index){
			return;
		}
		let tasking=this.tasking;
		if(tasking[index]){
			if(type){
				this.tasked.push(tasking[index])
			}else{
				this.setWaitTask(tasking[index]);
			}
			delete this.tasking[index];
		}
	},
	// 任务失败设置等待任务
	setWaitTask(val=[]){
		if(!val||!val.length){
			return;
		}
		val.forEach(item=>{
			// 重复次数 应进行相应配置
			if(item._repeat<3){
				this.waitTask.push(item)
			}else{
				this.failTask.push(item)
			}
		})
	},
	reload(){
		this.allUrl=new Set();
		this.task=[];
		this.tasking={};
		this.tasked=[];
		this.waitTask=[];
		this.failTask=[];
	},
	// 任务列表是否为空
	isEmpty(){
		return this.task.length||this.waitTask.length;
	}
}
