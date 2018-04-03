module.exports={
	baseUrl:[
		'baidu.com',
		'alipay.com'
	],
	*start(rs){
		let arr=rs.text;
		for(let item of arr){
			yield item;
		}
	},
}
