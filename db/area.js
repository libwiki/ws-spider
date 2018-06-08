const prefix='t_';
module.exports=function(orm,db,name){
    name=prefix+name.toLowerCase()
    db.define(name,{
        name:String,
        city_id:Number,
        status:{type:'integer',defaultValue:1},
    })
}
