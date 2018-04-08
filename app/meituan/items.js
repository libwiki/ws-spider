const config=require(process.cwd()+'/setting')
const util=require(process.cwd()+'/util')
util.on(config.events.items,(err,item)=>{
    if(err)console.log(err);
    console.log('items:',item);
})
