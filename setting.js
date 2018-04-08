const path=require('path')
module.exports={
	root:__dirname,
	appPath:path.resolve(__dirname,'app/'),
	wsPath:path.resolve(__dirname,'src/'),
    userAgentsPath:path.resolve(__dirname,'userAgents'),
	entryFileName:"index.js",
	itemFileName:"items.js",
	events:{
		items:'ws-items',
	}
}
