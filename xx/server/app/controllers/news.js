const {NewsModel} = require('../models/news');


/*** 管理端 controller */


const news_list = async (ctx, next) => {
    console.log(ctx.request.body)
   let result= await NewsModel.find({}).sort({
        "entryTime": -1
      })
    // console.log(result)
    ctx.body={
        code: 0,
        data:result
    }
    return
}
const add_news = async (ctx, next) => {
    console.log('add_news')
    console.log(ctx.request.body)
    // const { title, content } = ctx.request.body;
    const result = await NewsModel.create(ctx.request.body);
    ctx.body = {
        code: 0,
        msg:'添加成功',
        data:result
    };
}
//changeinfo
const change_news = async (ctx, next) => {
    console.log(ctx.request.body)
    const {_id,title,content}=ctx.request.body
   let result= await NewsModel.updateOne({ _id }, {title,content });
    // console.log(result)
    ctx.body={
        code: 0,
        msg:"修改成功",
        data:result
    }
    return
}
const del_news=async (ctx, next) => {
    console.log('delnews')
    console.log(ctx.request.body) 
    const {_id}=ctx.request.body
    
    await NewsModel.deleteOne({_id})
    ctx.body={
        code: 0,
        msg:"删除成功"
        // data:result
    }
    return
}
module.exports = {
    add_news,
    news_list,
    change_news,
    del_news
};