const orm=require('orm')
const request=require('request')
const async=require('async')
const model=require('./model')
const model1=require('./model')
const pull=require('./src/pull')

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
for(let i=0;i<=50;i++){
    let random=Math.floor(Math.random()*2000)+100;
    console.log(random);
}
