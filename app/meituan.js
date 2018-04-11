const cheerio=require('cheerio')
const fs=require('fs')
const {Controller}=require('../main')
class Meituan extends Controller{
    constructor(){
        super();
        this.baseUrl='http://hotel.meituan.com/alashanmeng/';
    }
    parse(self,res,extraData){
        let _this=this,
            $=cheerio.load(res.text);
        $('#search-header-placeholder .city-wrapper .classify-content div:not(.hot-content) .classify-row').each((i,row)=>{
			let prefix=$(row).children('em').text().toUpperCase();
            let a=$(row).find('a')[20]
            let href=$(a).attr('href');
            let text=$(a).text();
            if(text&&href){
                let itemData={prefix,text,href}
                let options={callbackName:'positionCate',data:itemData}
                super.create(self,href,options)
                //_this.end(itemData)
            }

            // $(row).find('a').each((index,a)=>{
			// 	let href=$(a).attr('href');
			// 	let text=$(a).text();
            //     let itemData=[prefix,text,href]
            //     let options={callbackName,itemData}
            //     this.create(self,href,options)
			// })
		})
    }
    // 位置分类（热门、行政区、地铁站、高校......）
    positionCate(self,res,extraData){
        let _this=this,
            $=cheerio.load(res.text);
        let wrap=$('div.search-filter div.search-row-wrap');
        let cate=[];
        wrap.find('div.search-row div.search-row-content .search-row-item').each((index,item)=>{
            let classify=[];
            let classifyRow=wrap.find('div.search-filter-classify').children('div').eq(index).children('div.classify-row');
            classifyRow.first().children('a').each((index2,item2)=>{
                let content=[];
                classifyRow.eq(index2+1).children('a.classify-item').each((index3,item3)=>{
                    content.push({text:$(item3).text(),href:$(item3).attr('href')})
                })
                let classifyItem={
                    title:$(item2).text(),
                    content
                };
                classify.push(classifyItem);
            })
            let cateItem={
                title:$(item).text(),
                classify
            };
            cate.push(cateItem);
        })
        extraData.positionCate=cate;
        _this.end(extraData)
    }
    end(data){
        console.log(data);
        console.log("(====================================================================)")
        if(data){
            if(typeof data==='object'){
                data=JSON.stringify(data)
            }
            fs.writeFile('./meituan.txt',','+data,{flag:'a'},err=>{
                if(err){
                    console.log(err);
                }

            })
        }
    }
}
module.exports=Meituan
