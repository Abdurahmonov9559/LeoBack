const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Promo = require('../model/promo')
const upload = require('../middleware/file')

router.get('/',async(req,res)=>{
    let promo = await Promo.find().sort({_id:-1}).lean()
    promo = promo.map(b=>{
        b.createdAt = b.createdAt.toLocaleString()
        b.status = b.status == 1 ? '<span class="badge bg-success">Актив</span>' : '<span class="badge bg-warning">Отключен</span>'
        return b
    })
    res.render('promo',{
        title:'Список акции',
        promo, isPromo:true
    })
})  

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Promo.findByIdAndRemove(_id)
    res.redirect('/promo')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let promo = await Promo.findOne({_id})
    promo.status = promo.status == 0 ? 1 : 0
    await promo.save()
    res.redirect('/promo')
})
router.post('/',upload.fields([
    {name:'img',maxCount:1},
    {name:'bigimg',maxCount:1},
]),async(req,res)=>{
    let {title,text,order,status} = req.body
    status = status || 0
    let img = bigimg = ''
    if(req.files){
        if (req.files.img){
            img = req.files.img[0].path
        }
        if (req.files.bigimg){
            bigimg = req.files.bigimg[0].path
        }
    }
    let newPromo = await new Promo({title,order,text,status,img,bigimg})
    await newPromo.save()
    res.redirect('/promo')
})

router.post('/save',upload.fields([{name:'img',maxCount:1},{name:'bigimg',maxCount:1},]),async(req,res)=>{
    let {_id,title,order,status,text} = req.body
    status = status || 0
    let promo = {title,order,status,text}
    if(req.files){
        if (req.files.img){
            promo.img = req.files.img[0].path
        }
        if (req.files.bigimg){
            promo.bigimg = req.files.bigimg[0].path
        }
    }
    await Promo.findByIdAndUpdate(_id,promo)
    res.redirect('/promo')
})




module.exports = router
