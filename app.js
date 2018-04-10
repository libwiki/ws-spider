const path=require('path')
const async=require('async')
const {URL}=require('url')
const Test=require('./test')
const util=require('./src/util')
const config=require('./src/setting')
const pull=require('./src/pull')
const controller=require('./src/controller')
let href='https://aa.github.com:888/bsspirit/async_demo/blob/master/each.js';
let myurl=new URL(href);

//console.log(myurl.host);
//controller.run('meituan')

class Tests extends Test{
    constructor(){
        super();
        this.test(__filename)
    }
}
new Tests();
let arr=[1,2,3,4,5,6,7,8,9,10];
async.eachLimit(arr,2,(item,callback)=>{
    setTimeout(function(){
        console.log(item);
    },1000)
    callback();
},err=>{
    if(err)console.log('err:',err);
})
