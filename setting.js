const path=require('path')
module.exports={
	root:__dirname,
	appPath:path.resolve(__dirname,'app/'),
    userAgentsPath:path.resolve(__dirname,'userAgents'),
	entryFileName:"index.js",
	itemFileName:"items.js"
}
