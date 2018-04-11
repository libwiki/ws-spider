const async=require('async')
const fs=require('fs')
let arr=[1,2,3,4,5,6,7,8,9,10]
arr.forEach(item=>{
    fs.writeFile('./meituan.txt',item,{flag:'a'},err=>{
        if(err)console.log(err);
    })
})
