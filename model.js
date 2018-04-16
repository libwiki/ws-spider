const orm=require('orm')
const async=require('async')
const {util}=require('./main')
const models={
    area:'./db/area',
    area_classify:'./db/areaclassify',
    city:'./db/city',
    classify:'./db/classify',
    hotel:'./db/hotel',
    locations:'./db/locations',
    locations_area:'./db/locationsarea',
}
const prefix='t_';
const _init=Symbol('_init')
const _runQueue=Symbol('_runQueue')
class Model{
    constructor(){
        this.queue=[]
        this.connection=null
        this[_init]()
    }
    db(name,callback){
        if(!name&&!callback){
            util.emit('error','db()方法缺少回调函数')
        }

        if(callback){
            name=prefix+name;
            this.queue.push({name,callback})
        }else{
            this.queue.push({name:null,callback:name})
        }

        this[_runQueue]();
    }
    [_runQueue](){
        let _this=this,
            connection=_this.connection;
            if(!connection){
                return;
            }
        let queue=_this.queue.splice(0);
        if(queue.length){
            async.eachLimit(queue,500,(item,cb)=>{
                if(typeof item.callback==='function'){
                    if(item.name){
                        let model=connection.models[item.name];
                        if(!model){
                            util.emit('error',`模型'${item.name}'未定义`)
                        }
                        item.callback(model)
                    }else{
                        item.callback(connection)
                    }
                }
                cb();
            },err=>{
                if(err)util.emit('error',err)
            })
        }
    }
    [_init](){
        let _this=this;
        orm.connect('mysql://root:root@127.0.0.1/addr?pool=true', function(err, db) {
    		if(err)util.emit('error',err);
    		//db.settings.set('instance.returnAllErrors', true);
            for(let key in models){
                require(models[key])(orm,db,key);
            }
    		_this.connection=db;
            process.nextTick(function(){
                _this[_runQueue]();
            })
    	});
    }
}
module.exports=new Model()
