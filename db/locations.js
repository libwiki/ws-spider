const prefix='t_';
module.exports=function(orm,db,name){
    name=prefix+name.toLowerCase()
    db.define(name,{
        name:String,
        href:String,
        status:{type:'integer',defaultValue:1},
    })
}
