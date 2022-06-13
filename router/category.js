const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Category = require('../model/category')
const upload = require('../middleware/file')

router.get('/',async(req,res)=>{
    let category = await Category.find().sort({_id:-1}).lean()
    category = category.map(cat=>{
        cat.status = cat.status == 1 ? '<span class="badge bg-success">Актив</span>' : '<span class="badge bg-warning">Отключен</span>'
        return cat
    })
    res.render('category',{
        title:'Список категории',
        category, isCategory:true
    })
})  

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Category.findByIdAndRemove(_id)
    res.redirect('/category')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let category = await Category.findOne({_id})
    category.status = category.status == 0 ? 1 : 0
    await category.save()
    res.redirect('/category')
})



router.post('/',async(req,res)=>{
    let {title,order,status} = req.body
    status = status || 0
    if (req.files){
        let file = req.files.img
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
           let newCategory = await new Category({title,order,status,img:filepath})
            await newCategory.save()
            res.send(JSON.stringify('ok'))
        })}
})

router.put('/save',async(req,res)=>{
    let {_id,title,order,status} = req.body
    status = status || 0
    if (req.files){
        let file = req.files.img
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            await Category.findByIdAndUpdate(_id,{title,order,status,img:filepath})
            res.send(JSON.stringify('ok'))
        })} else {
            await Category.findByIdAndUpdate(_id,{title,order,status})
            res.send(JSON.stringify('ok'))
       }
})




module.exports = router
