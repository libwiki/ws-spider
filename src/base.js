module.exports={
	get(url,header={},callback){
		if(typeof callback === 'function'){
			callback();
		}else{
			this.start();
		}
	}
}
