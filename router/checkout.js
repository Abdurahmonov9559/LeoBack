const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Checkout = require('../model/checkout')
const Category = require('../model/category')
router.get('/',async(req,res)=>{
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
    res.render('checkout',{
        title:'Список заказов',
        checkout, isCheckout:true
    })
})  

router.post('/getorders',async(req,res)=>{
    let {user} = req.body
    let checkout = await Checkout.find({user:user._id}).populate('cart._id').sort({_id:-1}).lean()
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
        cat.products += `Итого: <b>${cat.summa} сум</b>`

        switch(cat.status){
            case 0: 
                cat.status = 'Не просмотрено'
                break
            case 1: 
                cat.status = 'Одобрено'
                break
            case 2: 
                cat.status = 'Доставлено'
                break
            case 3: 
                cat.status = 'Отклонено'
                break
        }
        return cat
    })
    res.send(checkout)
})

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Checkout.findByIdAndRemove(_id)
    res.redirect('/checkout')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let checkout = await Checkout.findOne({_id})
    checkout.status = checkout.status == 0 ? 1 : 0
    await checkout.save()
    res.redirect('/checkout')
})



router.post('/',async(req,res)=>{
    let {title,order,status,category} = req.body
    status = status || 0
    let newCheckout = await new Checkout({title,order,status,category})
    await newCheckout.save()
    res.redirect('/checkout')
})

router.post('/save',async(req,res)=>{
    let {_id,title,order,status,category} = req.body
    status = status || 0
    let checkout = {title,order,status,category}
    await Checkout.findByIdAndUpdate(_id,checkout)
    res.redirect('/checkout')
})




module.exports = router
