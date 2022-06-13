const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Vakansi = require('../model/vakansi')

router.get('/',async(req,res)=>{
    let vakansi = await Vakansi.find().sort({_id:-1}).lean()
    vakansi = vakansi.map(b=>{
        b.createdAt = b.createdAt.toLocaleString()
        b.status = b.status == 1 ? '<span class="badge bg-success">Актив</span>' : '<span class="badge bg-warning">Отключен</span>'
        return b
    })
    res.render('vakansi',{
        title:'Вакансии',
        vakansi, isVakansi:true
    })
})  
router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Vakansi.findByIdAndRemove(_id)
    res.redirect('/vakansi')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let vakansi = await Vakansi.findOne({_id})
    vakansi.status = vakansi.status == 0 ? 1 : 0
    await vakansi.save()
    res.redirect('/vakansi')
})

// router.get('/view/:id',async(req,res)=>{
//     let _id = req.params.id
//     let vakansi = await Vakansi.findOne({_id}).lean()
//     res.render('')
// })

router.post('/',async(req,res)=>{
    let {title,text,order,status,condi} = req.body
    status = status || 0
      let newVakansi = await new Vakansi({title,order,text,status,condi})
    await newVakansi.save()
    res.redirect('/vakansi')
})

router.post('/save',async(req,res)=>{
    let {_id,title,text,order,status} = req.body
    status = status || 0
    let vakansi = {title,text,order,status}
 
    await Vakansi.findByIdAndUpdate(_id,vakansi)
    res.redirect('/vakansi')
})


module.exports = router