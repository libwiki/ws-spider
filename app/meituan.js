const cheerio=require('cheerio')
const {Controller}=require('../main')
class Meituan extends Controller{
    constructor(){
        super();
        this.baseUrl='http://hotel.meituan.com/alashanmeng/';
    }
    parse(self,res,extraData){
        let $=cheerio.load(res.text)
        $('#search-header-placeholder .city-wrapper .classify-content div:not(.hot-content) .classify-row').each((i,row)=>{
			let prefix=$(row).children('em').text().toUpperCase();
			$(row).find('a').each((index,a)=>{
				let href=$(a).attr('href');
				let text=$(a).text();
                self.end([prefix,text,href])
			})
		})
    }
    end(data){
        console.log(data);
    }
}
module.exports=Meituan
