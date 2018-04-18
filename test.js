const orm=require('orm')
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
let href='http://hotel.meituan.com/yulinyl/ba23807/';
pull.entry(href).then(rs=>{
    //console.log(rs);
})
