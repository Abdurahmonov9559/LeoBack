const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Blog = require('../model/blog')
const upload = require('../middleware/file')

router.get('/',async(req,res)=>{
    let blog = await Blog.find().sort({_id:-1}).lean()
    blog = blog.map(b=>{
        b.createdAt = b.createdAt.toLocaleString()
        b.status = b.status == 1 ? '<span class="badge bg-success">Актив</span>' : '<span class="badge bg-warning">Отключен</span>'
        return b
    })
    res.render('blog',{
        title:'Список новостей',
        blog, isBlog:true
    })
})  

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Blog.findByIdAndRemove(_id)
    res.redirect('/blog')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let blog = await Blog.findOne({_id})
    blog.status = blog.status == 0 ? 1 : 0
    await blog.save()
    res.redirect('/blog')
})



router.post('/',async(req,res)=>{
    let {title,text,order,status,description} = req.body
    status = status || 0
    let file = req.files.img
    const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let filepath = `uploads/${uniquePreffix}_${file.name}`
    file.mv(filepath,async err => {
        if (err) res.send(JSON.stringify(err))
        let newBlog = await new Blog({title,order,text,status,img:filepath,description})
        await newBlog.save()
        res.send(JSON.stringify('ok'))
    })
})

router.put('/save',async(req,res)=>{
    let {_id,title,order,status,text,description} = req.body
    status = status || 0
    if (req.files){
        let file = req.files.img
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            await Blog.findByIdAndUpdate(_id,{title,order,status,text,description,img:filepath})
            res.send(JSON.stringify('ok'))
        })} else {
            await Blog.findByIdAndUpdate(_id,{title,order,status,text,description})
            res.send(JSON.stringify('ok'))
       }
})




module.exports = router
