const {ChatModel,CommentModel} = require('../models/chat');
 


const getlist = async (ctx, next) => {
    console.log(ctx.request.body)
   let result= await ChatModel.find({}).sort({//顺序有关系
        "state": 'desc',
        "entryTime": -1,
      })
    // console.log(result)
    ctx.body={
        code: 0,
        data:result
    }
    return
}
const create = async (ctx, next) => {
    console.log(ctx.request.body)
    let data=ctx.request.body
    const result = await ChatModel.create(data);
    ctx.body={
        code: 0,
        data:result
    }
     return
}
const like = async (ctx, next) => {
    console.log('like')
    console.log(ctx.request.body)
    const {_id,like}=ctx.request.body
   const result= await ChatModel.findByIdAndUpdate(_id, {
        like: like
      })
    ctx.body={
        code: 0,
        data:result
    }
    return

}
const comment_list = async (ctx, next) => {
    console.log('comment_list')
    console.log(ctx.request.query.chat_id)
    const _id=ctx.request.query.chat_id
    let result= await CommentModel.find({'chat_id':_id}).sort({
        "entryTime": -1
      })
    // console.log(result)
    ctx.body={
        code: 0,
        data:result
    }
    return

}
const comment_public = async (ctx, next) => {
    console.log('comment_public')
    console.log(ctx.request.body)
    const data=ctx.request.body
    const result = await CommentModel.create(data);
    ctx.body={
        code: 0,
        data:result
    }
    return
}


//管理端
const manage_chat_list=async (ctx, next) => {
    console.log(ctx.request.body)
   let result= await ChatModel.find({}).sort({
        "state": 'desc',
        "entryTime": -1,
      })
    // console.log(result)
    ctx.body={
        code: 0,
        data:result
    }
    return
}
const manage_comment_list=async (ctx, next) => {
    console.log('comment_list')
    console.log(ctx.request.query.chat_id)
    const _id=ctx.request.query.chat_id
    let result= await CommentModel.find({'chat_id':_id}).sort({
        "entryTime": -1
      })
    console.log(result)
    ctx.body={
        code: 0,
        data:result
    }
    return

}
const comment_del = async (ctx, next) => {
    console.log('del')
    console.log(ctx.request.body)
    const {_id}=ctx.request.body
    await CommentModel.deleteOne({_id})
    ctx.body={
        code: 0,
        // data:result
    }
    return
}
const chat_del = async (ctx, next) => {
    console.log('del')
    console.log(ctx.request.body)
    const {_id}=ctx.request.body
    await ChatModel.deleteOne({_id})
    ctx.body={
        code: 0,
        // data:result
    }
    return
}
const chat_up = async (ctx, next) => {
    console.log('up')
    console.log(ctx.request.body)
    const {_id,state}=ctx.request.body
    await ChatModel.findByIdAndUpdate(_id, {state})
    ctx.body={
        code: 0,
        // data:result
    }
    return
}
const comment_lock= async (ctx, next) => {
    console.log('up')
    console.log(ctx.request.body)
    const {_id,commentstate}=ctx.request.body
    await ChatModel.findByIdAndUpdate(_id, {commentstate})
    ctx.body={
        code: 0,
        // data:result
    }
    return
}

module.exports = {
    getlist,
    create,
    like,
    comment_list,
    comment_public,
    chat_del,
    chat_up,
    manage_chat_list,
    manage_comment_list,
    comment_del,
    comment_lock
};