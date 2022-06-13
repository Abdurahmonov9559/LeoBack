const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Category = require('../model/category')
const Page = require('../model/page')
const User = require('../model/user')
const Product = require('../model/product')
const Checkout = require('../model/checkout')
const Oneclick = require('../model/oneclick')
router.get('/',auth,async(req,res)=>{
    let category = await Category.find().sort({order:-1}).lean()
    let user = await User.find().lean()
    let product = await Product.find().lean()
    let checkout = await Checkout.find().populate('user').populate('cart._id').sort({_id:-1}).lean()
    checkout = checkout.map(cat=>{
        cat.products = ''
        cat.summa = 0
        cat.createdAt = cat.createdAt.toLocaleString()
        if (cat.cart.length>0){
            cat.cart.forEach(ord =>{
                cat.products += `${ord._id.title} x ${ord.count} шт <br>`
                if (ord._id.sale>0){
                    cat.summa += ord.count * ord._id.price * (100-ord._id.sale)/100
                } else {
                    cat.summa += ord.count * ord._id.price
                }
            })
        }

        switch(cat.status){
            case 0: 
                cat.status = '<span class="badge bg-warning">Не просмотрено</span>'
                break
            case 1: 
                cat.status = '<span class="badge bg-primary">Одобрено</span>'
                break
            case 2: 
                cat.status = '<span class="badge bg-success">Доставлено</span>'
                break
            case 3: 
                cat.status = '<span class="badge bg-danger">Отклонено</span>'
                break
        }
        return cat
    })
    let oneclick = await Oneclick.find().populate('product').sort({_id:-1}).lean()
    
    oneclick = oneclick.map(cat=>{
        cat.createdAt = cat.createdAt.toLocaleString()
        cat.status = cat.status == 1 ? '<span class="badge bg-success">Отвечено</span>' : '<span class="badge bg-warning">В ожидание</span>'
        return cat
    })
    res.render('page/index',{
        isHome:true,
        category,user,product, checkout, oneclick
    })
})

router.get('/page',auth,async(req,res)=>{
    let page = await Page.find().lean()
    page = page.map(b=>{
        b.status = b.status == 1 ? '<span class="badge bg-success">Актив</span>' : '<span class="badge bg-warning">Отключен</span>'
        b.menu = b.menu == 1 ? '<span class="badge bg-success">Да</span>' : '<span class="badge bg-warning">Нет</span>'
        switch(b.feedback){
            case 0:
                b.feedback = '<span class="badge bg-warning">Нету</span>'
                break
            case 1:
                b.feedback = '<span class="badge bg-success">Форма "Подписка"</span>'
                break
            case 2:
                b.feedback = '<span class="badge bg-success">Форма "Заполните форму"</span>'
                break
        }
        return b
    })
    res.render('page',{
        title:'Список страниц',
        page
    })
})

router.get('/page/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Page.findByIdAndRemove(_id)
    res.redirect('/page')
})

router.get('/page/status/:id',async(req,res)=>{
    let _id = req.params.id
    let page = await Page.findOne({_id})
    page.status = page.status == 0 ? 1 : 0
    await page.save()
    res.redirect('/page')
})



router.post('/page/',auth,async(req,res)=>{
    let {title,text,status,menu,slug,feedback} = req.body
    status = status || 0
    menu = menu || 0
    feedback = feedback || 0

    let newPage = await new Page({title,text,status,menu,slug,feedback})
    await newPage.save()
    res.redirect('/page')
})

router.post('/page/save',auth,async(req,res)=>{
    let {_id,title,text,status,menu,slug,feedback} = req.body
    status = status || 0
    menu = menu || 0
    feedback = feedback || 0
    let page = {title,text,status,menu,slug,feedback}

    await Page.findByIdAndUpdate(_id,page)
    res.redirect('/page')
})


module.exports = router