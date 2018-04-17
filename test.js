const orm=require('orm')
const async=require('async')
const model=require('./model')
const model1=require('./model')

// model.db('area',db=>{
//     console.log(123);
//     db.get(142,(err,rs)=>{
//         console.log(rs.name);
//     })
// })
// model1.db('area',db=>{
//     if(db){
//         console.log(22222);
//     }
// })
class Test{
    constructor(){
        this.arr=[];
        this.init()
        this.shifts();

    }
    init(){
        for(let i=0;i<=50;i++){
            this.arr.push(i);
        }
    }
    shifts(){
        for(let i=0;i<=20;i++){
            this.arr.splice(0,3);
            console.log(this.arr);
        }
    }
}

let test=new Test();
