const cheerio=require('cheerio')
const fs=require('fs')
const model=require('../model')
const {util,Controller}=require('../main')
class Meituan extends Controller{
    constructor(){
        super();
        this.baseUrl='http://hotel.meituan.com/alashanmeng/';
        this.cate=[
            {id:1,name:'热门'},
            {id:2,name:'行政区/商圈'},
            {id:3,name:'地铁站'},
            {id:4,name:'高校'},
            {id:5,name:'车站/机场'},
            {id:6,name:'旅游景点'},
            {id:7,name:'医院'},
        ]
    }
    parse(self,res,extraData){
        let _this=this,
            $=cheerio.load(res.text);
        $('#search-header-placeholder .city-wrapper .classify-content div:not(.hot-content) .classify-row').each((i,row)=>{
			let prefix=$(row).children('em').text().toUpperCase();
            let a=$(row).find('a')[20] //仅获取第20座城市做爬取试验
            let href=$(a).attr('href');
            let text=$(a).text();
            if(text.length&&href.length){
                let itemData={prefix,name:text,href}
                let options={callbackName:'positionCate',data:itemData}
                super.create(_this,href,options)
            }
		})
    }
    // 位置分类（热门、行政区、地铁站、高校......）
    positionCate(self,res,extraData){
        let _this=this,
            cates=_this.cate,
            $=cheerio.load(res.text);
        let wrap=$('div.search-filter div.search-row-wrap');
        let cate=[];
        cates.forEach((item,index)=>{
            let classify=[];
            let row=wrap.find('div.search-filter-classify').children('div').eq(index).children('div.classify-row');
            row.first().children('a').each((index2,item2)=>{
                let content=[];
                row.eq(index2+1).children('a.classify-item').each((index3,item3)=>{
                    content.push({name:$(item3).text(),href:$(item3).attr('href')})
                })
                let classifyItem={
                    name:$(item2).text(),
                    items:content
                };
                classify.push(classifyItem);
            })
            let cateItem={
                id:item.id,
                name:item.name,
                classify
            };
            cate.push(cateItem);
        })
        extraData.positionCate=cate;
        _this._classifyEnd(extraData)
    }

    // 从城市到详细地址（每一条路）的保存
    _classifyEnd(data){
        let _this=this;
        //城市添加
        model.db('city',db=>{
            db.create({
                name:data.name,
                prefix:data.prefix,
                href:data.href,
            },(err,city)=>{
                if(err)util.emit('error',err);
                let positionCate=data.positionCate;
                if(city&&city.id&&positionCate){
                    // 区域添加
                    positionCate.forEach(item=>{
                        let classify=item.classify;
                        classify.forEach(classifyItem=>{
                            model.db('area',db=>{
                                db.create({
                                    name:classifyItem.name
                                },(err,area)=>{
                                    if(err)util.emit('error',err);
                                    if(area&&area.id){
                                        // 添加关系 calassify与area
                                        model.db('area_classify',db=>{
                                            db.create({
                                                classify_id:item.id,
                                                area_id:area.id,
                                            },(err,area)=>{
                                                if(err)util.emit('error',err);
                                            })
                                        })
                                        // 添加 locations地址
                                        if(!classifyItem.items){
                                            return;
                                        }
                                        let locationsArr=[];
                                        let hotelHref=[];
                                        classifyItem.items.forEach(item=>{
                                            locationsArr.push({
                                                name:item.name,
                                                href:item.href,
                                            })
                                            // 需要传递额外的数据  应在此处执行super.create()
                                            //hotelHref.push(item.href)
                                        })
                                        // 在这里 可爬取每个locations地址下的 酒店
                                        // options={callbackName,data,headers,method,charset}
                                        //super.create(_this,href,options)
                                        if(locationsArr.length){
                                            let items=[];
                                            model.db('locations',db=>{
                                                db.create(locationsArr,(err,locations)=>{
                                                    if(err)util.emit('error',err);
                                                    locations.forEach(item=>{
                                                        items.push({
                                                            locations_id:item.id,
                                                            area_id:area.id
                                                        })
                                                    })

                                                    // 添加 locations与area 的关系
                                                    if(items.length){
                                                        model.db('locations_area',db=>{
                                                            db.create(items,(err,area)=>{
                                                                if(err)util.emit('error',err);
                                                            })
                                                        })
                                                    }
                                                })
                                            })
                                        }

                                    }
                                })
                            })

                        })
                    })

                }
            })
        })
        // console.log(data);
        console.log("(====================================================================)")
        // if(data){
        //     if(typeof data==='object'){
        //         data=JSON.stringify(data)
        //     }
        //     fs.writeFile('./meituan.txt',data,{flag:'w'},err=>{
        //         if(err){
        //             console.log(err);
        //         }
        //     })
        // }
    }
}
module.exports=Meituan
