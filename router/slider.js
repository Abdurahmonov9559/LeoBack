const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Slider = require('../model/slider')
const upload = require('../middleware/file')

router.get('/',async(req,res)=>{
    let slider = await Slider.find().sort({_id:-1}).lean()
    slider = slider.map(cat=>{
        cat.status = cat.status == 1 ? '<span class="badge bg-success">Актив</span>' : '<span class="badge bg-warning">Отключен</span>'
        return cat
    })
    res.render('slider',{
        title:'Список слайдеров',
        slider, isSlider:true
    })
})  

router.get('/delete/:id',async(req,res)=>{
    let _id = req.params.id
    await Slider.findByIdAndRemove(_id)
    res.redirect('/slider')
})

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let slider = await Slider.findOne({_id})
    slider.status = slider.status == 0 ? 1 : 0
    await slider.save()
    res.redirect('/slider')
})



router.post('/',async(req,res)=>{
    let {title,text,link,order,status} = req.body
    status = status || 0
    if (req.files){
        let file = req.files.img
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            let newSlider = await new Slider({title,text,link,order,status,img:filepath})
            await newSlider.save()
            res.send(JSON.stringify('ok'))
        })}
})

router.put('/save',async(req,res)=>{
    let {_id,title,text,link,order,status} = req.body
    status = status || 0
    if (req.files){
        let file = req.files.img
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filepath = `uploads/${uniquePreffix}_${file.name}`
        file.mv(filepath,async err => {
            if (err) res.send(JSON.stringify(err))
            await Slider.findByIdAndUpdate(_id,{title,text,link,order,status,img:filepath})
            res.send(JSON.stringify('ok'))
    })} else {
        await Slider.findByIdAndUpdate(_id,{title,text,link,order,status})
        res.send(JSON.stringify('ok'))
    }
})




module.exports = router
