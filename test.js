const orm=require('orm')
const model=require('./model')
const model1=require('./model')


model.db(db=>{
    city=db.models['t_city']
    city.get(103,(err,rs)=>{
        console.log(rs.name);
    })
})
model.db('area',db=>{
    db.get(142,(err,rs)=>{
        console.log(rs.name);
    })
})
model1.db('area',db=>{
    if(db){
        console.log(22222);
    }
})
