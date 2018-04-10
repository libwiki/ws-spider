const util=require('./src/util')
const Controller=require('./src/controller')
class WsSpider{
    constructor(config={},userAgents={}){
        util.setting(config,userAgents)
        this.util=util
        this.Controller=Controller
    }
}
module.exports=WsSpider
