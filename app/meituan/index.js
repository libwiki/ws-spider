const util = require(process.cwd()+'/util')
const config = require(process.cwd()+'/setting')
module.exports={
	baseUrl:[
		'http://hotel.meituan.com/nanning/',
	],
	parse(self,data,options){
		let $=util.parse(data.text);
		let main=$('#search-header-placeholder .city-wrapper .classify-content div:not(.hot-content) .classify-row');
		main.each((i,row)=>{
			let prefix=$(row).children('em').text().toUpperCase();
			$(row).find('a').each((index,a)=>{
				let href=$(a).attr('href');
				let text=$(a).text();
				util.emit(config.events.items,[prefix,text,href])
			})
		})
		// util.emit(config.events.newTask,{
		// 	url,
		// 	self,
		// 	options,
		// 	callbackName,
		// })
	},
	fun(self,data,options){
		//console.log(this.baseUrl[1]);
	}
}
