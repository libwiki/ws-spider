const prefix='t_';
module.exports=function(orm,db,name){
    name=prefix+name.toLowerCase()
    db.define(name,{
        locations_id:Number,
        area_id:Number,
    })
}
