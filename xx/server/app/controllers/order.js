const {OrderModel} = require('../models/order');




const order_list = async (ctx, next) => {
    console.log(ctx.request.body)
    const {_id}=ctx.request.body
   let result= await OrderModel.find({'creator':_id}).sort({
        "entryTime": -1
      })
    // console.log(result)
    ctx.body={
        code: 0,
        data:result
    }
    return
}
const order_create = async (ctx, next) => {
    console.log('add_news')
    console.log(ctx.request.body)
    // const { title, content } = ctx.request.body;

    const result = await OrderModel.create(ctx.request.body);

    ctx.body = {
        code: 0,
        msg:'添加成功',
        data:result
    };
}
/*** 管理端 controller */
const order_manage_list = async (ctx, next) => {
    console.log(ctx.request.body)
    const {creator}=ctx.request.body
   let result= await OrderModel.find({}).sort({
        "entryTime": -1
      })
    // console.log(result)
    ctx.body={
        code: 0,
        data:result
    }
    return
}
const order_del=async (ctx, next) => {
    console.log('delnews')
    console.log(ctx.request.body) 
    const {_id}=ctx.request.body
    await OrderModel.deleteOne({_id})
    ctx.body={
        code: 0,
        msg:"删除成功"
        // data:result
    }
    return
}

 
module.exports = {
    order_list,
    order_create,
    order_manage_list,
    order_del
};