const prefix='t_';
module.exports=function(orm,db,name){
    name=prefix+name.toLowerCase()
    db.define(name,{
        name:String,
        href:String,
        remark:String,
        address:String,
        l_and_l:String,
        locations_id:{type:'integer',defaultValue:0},
        status:{type:'integer',defaultValue:1},
    })
}
