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
let a={a:1,b:2}
let b={a:2,c:1}
console.log(Object.assign(a,b));
