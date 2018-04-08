const path=require('path')
const config=require(process.cwd()+'/setting')
const util=require(path.resolve(config.wsPath,'util'))
util.on(config.events.items,(err,item)=>{
    if(err)console.log(err);
    console.log(item);
})
