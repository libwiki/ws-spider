const orm=require('orm')
const async=require('async')
const model=require('./model')
const model1=require('./model')

model.db('area',db=>{
    console.log(123);
    db.get(142,(err,rs)=>{
        console.log(rs.name);
    })
})
model1.db('area',db=>{
    if(db){
        console.log(22222);
    }
})
