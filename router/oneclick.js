const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Oneclick = require('../model/oneclick')
const upload = require('../middleware/file')

router.get('/',auth,async(req,res)=>{
    let oneclick = await Oneclick.find().populate('product').sort({_id:-1}).lean()
    
    oneclick = oneclick.map(cat=>{
        cat.createdAt = cat.createdAt.toLocaleString()
        cat.status = cat.status == 1 ? '<span class="badge bg-success">Отвечено</span>' : '<span class="badge bg-warning">В ожидание</span>'
        return cat
    })
    res.render('oneclick',{
        title:'Список oneclick',
        oneclick, isOneclick:true
    })
})  

router.get('/delete/:id', async(req,res)=> {
    let _id = req.params.id
    await Oneclick.findByIdAndRemove({_id})
    res.redirect('/oneclick')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let oneclick = await Oneclick.findOne({_id})
    oneclick.status = oneclick.status == 0 ? 1 : 0
    await oneclick.save()
    res.redirect('/oneclick')
})







module.exports = router
