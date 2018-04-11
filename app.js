const path=require('path')
const {util}=require('./main')
util.setting({
    appPath:path.resolve(__dirname,'./app'),
})

util.run();
