const path=require('path')
const util=require('./util')
global.rootPath=path.resolve(__dirname)
const controller=require('./src/controller')

controller.run('meituan')
const events= require('events')
const emitter=new events.EventEmitter();
global.emitter=emitter
emitter.on('pull',data=>{
	console.log('task:',data)
})
