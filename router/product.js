const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Product = require('../model/product')
const upload = require('../middleware/file')
const Atribut = require('../model/atribut')
const Category = require('../model/category')

router.get('/',async(req,res)=>{
    let product = await Product.find().populate('category').populate('atributes.atribut').sort({_id:-1}).lean()
    let category = await Category.find({status:1}).lean()
    
    product = product.map(pro=>{
        pro.img = pro.img[0]

        pro.top = pro.top == 1 ? '<span class="badge bg-success">Да</span>' : '<span class="badge bg-warning">Нет</span>'
        pro.news = pro.news == 1 ? '<span class="badge bg-success">Да</span>' : '<span class="badge bg-warning">Нет</span>'
        pro.leo = pro.leo == 1 ? 'Leo' : ''
        pro.gidrox = pro.gidrox == 1 ? 'Gidrox' : ''
        switch(pro.status){
            case 0: 
                pro.status = '<span class="badge bg-warning">Нет в наличие</span>'
                break
            case 1: 
                pro.status = '<span class="badge bg-success">Есть в наличие</span>'
                break
            case 2: 
                pro.status = '<span class="badge bg-primary">Предзаказ</span>'
                break
            case 3: 
                pro.status = '<span class="badge bg-danger">Отключено</span>'
                break
        }
        return pro
    })
    res.render('product/index',{
        title:'Список категории',
        product, isProduct:true, category
    })
})  

router.get('/view/:id',async(req,res)=>{
    let _id = req.params.id
    let pro = await Product.findOne({_id}).populate('category').populate('atributes.atribut').lean()
    pro.top = pro.top == 1 ? '<span class="badge bg-success">Да</span>' : '<span class="badge bg-warning">Нет</span>'
    pro.news = pro.news == 1 ? '<span class="badge bg-success">Да</span>' : '<span class="badge bg-warning">Нет</span>'
    switch(pro.status){
        case 0: 
            pro.status = '<span class="badge bg-warning">Нет в наличие</span>'
            break
        case 1: 
            pro.status = '<span class="badge bg-success">Есть в наличие</span>'
            break
        case 2: 
            pro.status = '<span class="badge bg-primary">Предзаказ</span>'
            break
        case 3: 
            pro.status = '<span class="badge bg-danger">Отключено</span>'
            break
    }
    pro.review = pro.review.map(rev=>{
        rev.createdAt = rev.createdAt.toLocaleString()
        rev.status = rev.status == 1 ? '<span class="badge bg-success">Активные</span>' : '<span class="badge bg-warning">Отключен</span>'
        return rev
    })
    res.render('product/view',{
        title: `${pro.title}`,
        product:pro
    })
})

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Product.findByIdAndRemove(_id)
    res.redirect('/product')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let product = await Product.findOne({_id})
    product.status = product.status == 0 ? 1 : 0
    await product.save()
    res.redirect('/product')
})

router.get('/review/:id/:index',async(req,res)=>{
    let _id = req.params.id
    let index = req.params.index
    let product = await Product.findOne({_id})
    product.review[index].status = product.review[index].status == 0 ? 1 : 0
    await product.save()
    res.redirect('/product/view/'+_id)
})

router.get('/delreview/:id/:index',async(req,res)=>{
    let _id = req.params.id
    let index = req.params.index
    let product = await Product.findOne({_id})
    product.review.splice(index,1)
    await product.save()
    res.redirect('/product/view/'+_id)
})

router.post('/',async(req,res)=>{
    let {title,order,status,price,category,text,atributes,sale,top,news,leo,gidrox} = req.body
    status = status || 0
    top = top || 0
    news = news || 0
    atributes = JSON.parse(atributes)
    if(req.files){
        let files = req.files.img1
        let img = []
        await Promise.all(files.map(async (file) =>{
            const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            let filepath = `uploads/${uniquePreffix}_${file.name}`
            await file.mv(filepath)
            img.push(filepath)
        }))
        let newProduct = await new Product({title,order,status,price,category,text,atributes,sale,top,news,img,leo,gidrox})
        await newProduct.save()
        res.send(JSON.stringify('ok'))
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.post('/save',upload.single('img'),async(req,res)=>{
    let {_id,title,order,status} = req.body
    status = status || 0
    let product = {title,order,status}
    if (req.file){
        product.img = req.file.path
    }
    await Product.findByIdAndUpdate(_id,product)
    res.redirect('/product')
})




module.exports = router
