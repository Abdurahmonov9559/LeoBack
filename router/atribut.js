const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Atribut = require('../model/atribut')
const Category = require('../model/category')
router.get('/',async(req,res)=>{
    let atribut = await Atribut.find().populate('category').sort({_id:-1}).lean()
    let category = await Category.find({status:1}).lean()
    atribut = atribut.map(cat=>{
        cat.status = cat.status == 1 ? '<span class="badge bg-success">Актив</span>' : '<span class="badge bg-warning">Отключен</span>'
        return cat
    })
    res.render('atribut',{
        title:'Список атрибутов',
        atribut, isAtribut:true, category
    })
})  

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Atribut.findByIdAndRemove(_id)
    res.redirect('/atribut')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let atribut = await Atribut.findOne({_id})
    atribut.status = atribut.status == 0 ? 1 : 0
    await atribut.save()
    res.redirect('/atribut')
})



router.post('/',async(req,res)=>{
    let {title,order,status,category} = req.body
    status = status || 0
    let newAtribut = await new Atribut({title,order,status,category})
    await newAtribut.save()
    res.redirect('/atribut')
})

router.post('/save',async(req,res)=>{
    let {_id,title,order,status,category} = req.body
    status = status || 0
    let atribut = {title,order,status,category}
    await Atribut.findByIdAndUpdate(_id,atribut)
    res.redirect('/atribut')
})




module.exports = router
