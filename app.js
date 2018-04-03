const path=require('path')
global.rootPath=path.resolve(__dirname)
//const controller=require('./src/controller')

//controller.run()
const events= require('events')
const emitter=new events.EventEmitter();
global.emitter=emitter
emitter.on('pull',data=>{
	console.log('task:',data)
})
