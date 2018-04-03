const superagent=require('superagent')
const request=require('superagent-charset')(superagent)
const fs=require('fs')
const path=require('path')
const app=require('./app')
const userAgents=require(rootPath+'/userAgents')
const config=require('./setting')
//console.log(userAgents);
console.log(path.basename(__dirname));
let dirpath=config.appPath;
fs.readdir(dirpath,(err,res)=>{
    if(err){
        console.log(err);
    }
    res.forEach(item=>{
        let filepath=path.join(dirpath,item,config.entryFileName)
        let isfile=fs.existsSync(filepath)
        if(isfile){
            console.log(item);
        }
    })

})
