const path=require('path')
const {URL}=require('url')
const util=require('./util')
const config=require('./setting')
const pull=require('./src/pull')
const controller=require('./src/controller')
let href='https://aa.github.com:888/bsspirit/async_demo/blob/master/each.js';
let myurl=new URL(href);
//console.log(myurl.host);
controller.run('meituan')
