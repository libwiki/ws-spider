module.exports={
	baseUrl:[
		'baidu.com',
		'alipay.com'
	],
	*parse(rs){
		let arr=rs.text;
		for(let item of arr){
			yield item;
		}
	},
}
