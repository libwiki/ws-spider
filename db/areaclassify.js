const prefix='t_';
module.exports=function(orm,db,name){
    name=prefix+name.toLowerCase()
    db.define(name,{
        classify_id:Number,
        area_id:Number,
    })
}
