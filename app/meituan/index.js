module.exports={
	baseUrl:[
		'baidu.com',
		'alipay.com'
	],
	*parse(rs){
		let arr=this.baseUrl;
		for(let item of arr){
			yield item;
		}
	},
	fun(){
		console.log(this.baseUrl[1]);
	}
}
