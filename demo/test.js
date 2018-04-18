const cheerio=require('cheerio')
const fs=require('fs')
const path=require('path')
const model=require(path.join(process.cwd(),'model'))
const {util,Controller}=require(path.join(process.cwd(),'main'))
class Taobao extends Controller{
    constructor(){
        super();
        this.baseUrl='https://s.taobao.com/search?q=%E5%A5%B3%E6%80%A7%E4%B8%AD%E9%95%BF%E6%AC%BE%E5%A4%96%E5%A5%97';
    }
    parse(self,res,extraData){
        let $=cheerio.load(res.text);
        let items=$('#mainsrp-itemlist .m-itemlist div.items item');
        console.log(items);
        items.each((index,item)=>{
            let title=$('div.row.row-2.title a').text();
            self._titleEnd(title)
        })
        //super.create(self,self.baseUrl)
    }
    _titleEnd(title){
        console.log(title);
    }
}
module.exports=Taobao
