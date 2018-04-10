const app=require('./app')
class Test{
    constructor(){
        this.arr=[];
        console.log('test constructor');
    }
    test(val){
        console.log('testval:',val);
        console.log('testname:',__filename);
    }
    run(){
        console.log(this.arr);
    }
    add(val){
        this.arr.push(val)
    }
}
module.exports=Test
