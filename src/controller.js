const path=require('path')
const pull=require('./pull')
const task=require('./task')
const util=require('./util')
const config=require('../setting')

module.exports={
	run(name){
		if(!name)return;
		util.getModule(name).then(modules=>{
			let dirname=modules.dirname,index=modules.index,items=modules.items;
			let app=index.parse();
			let run=false;
			while(!run){
				rs=app.next();
				run =rs.done;
				if(!run){
					util.emit(config.events.items,rs.value)
				}
			}

		}).catch(err=>{
			console.log(err);
		})
	}
}
