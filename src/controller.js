const path=require('path')
const spider=require(rootPath+'/spider')
const pull=require('./pull')
const task=require('./task')

module.exports={
	run(){
		for(let item in spider){
			let App=require(rootPath+spider[item]);
			let baseUrl=App.baseUrl;
			if(baseUrl.length===0)return;
			task.add('baseUrl')
			pull.entry().then(rs=>{
				let app=App.start(rs);
				let run=false;
				while(!run){
					rs=app.next();
					console.log(rs)
					run =rs.done;
				}
			})

		}
		
	}
}
