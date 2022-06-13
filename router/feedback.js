const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Feedback = require('../model/feedback')
const upload = require('../middleware/file')

router.get('/',auth,async(req,res)=>{
    let feedback = await Feedback.find().sort({_id:-1}).lean()
    
    feedback = feedback.map(cat=>{
        cat.createdAt = cat.createdAt.toLocaleString()
        cat.status = cat.status == 1 ? '<span class="badge bg-success">Отвечено</span>' : '<span class="badge bg-warning">В ожидание</span>'
        cat.type = cat.type == 1 ? '<span class="badge bg-success">По рассрочку</span>' : '<span class="badge bg-primary">Обратная связь</span>'
        return cat
    })
    res.render('feedback',{
        title:'Список обращение',
        feedback, isFeedback:true
    })
})  

router.get('/status/:id',async(req,res)=>{
    let _id = req.params.id
    let feedback = await Feedback.findOne({_id})
    feedback.status = feedback.status == 0 ? 1 : 0
    await feedback.save()
    res.redirect('/feedback')
})







module.exports = router
