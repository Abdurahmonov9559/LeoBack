const {Router} = require('express')
const router = Router()
const Category = require('../model/category')
const Slider = require('../model/slider')
const Atribut = require('../model/atribut')
const Product = require('../model/product')
const Blog = require('../model/blog')
const Vakansi = require('../model/vakansi')
const Promo = require('../model/promo')
const Page = require('../model/page')
const Oneclick = require('../model/oneclick')
const Feedback = require('../model/feedback')
const User = require('../model/user')
const Checkout = require('../model/checkout')
const bcryptjs = require('bcryptjs')
const upload = require('../middleware/file')
const { v4: uuidv4 } = require('uuid');
const user = require('../model/user')



const kirlot = (text) => {
    let lat = {'a':'а','q':'қ','s':'с','d':'д','e':'е','r':'р','f':'ф','t':'т','g':'г','y':'й','h':'ҳ','u':'у','j':'ж','i':'и','k':'к','o':'о','l':'л','p':'п','z':'з','x':'х','s':'с','v':'в','b':'б','n':'н','m':'м','ch':'ч',' ':' '}
    let kir = {'а':'a','қ':'q','с':'s','д':'d','е':'e','р':'r','ф':'f','т':'t','г':'g','й':'y','ҳ':'h','у':'u','ж':'j','и':'i','к':'k','о':'o','л':'l','п':'p','з':'z','х':'x','с':'s','в':'v','б':'b','н':'n','м':'m','ш':'sh','ч':'ch', ' ':' '}
    let res = ''
    text = text.toLowerCase().split('')
    let letterCount = 0
    while (letterCount < text.length) {
        if (text[letterCount]+text[letterCount+1]=='sh') {
            res+='ш'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='ch') {
            res+='ч'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='yo') {
            res+='ё'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='ya') {
            res+='я'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=="o'") {
            res+='ў'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=="g'") {
            res+='ғ'
            letterCount+=2
            continue
        }
        if (lat[text[letterCount]]) {
            res+=lat[text[letterCount]]
        }
        if (kir[text[letterCount]]) {
            res+=kir[text[letterCount]]
        }
        letterCount++
    }

    return res
}

router.get('/search/:title',async(req,res)=>{
    const title = req.params.title
    if (title.length>0) {
        let othertitle = kirlot(title)
        let ads = await Product
            .find({
                $or: [
                    {
                        'title': {
                            $regex: new RegExp( title.toLowerCase(), 'i')
                        }
                    },
                    {
                        'title': {
                            $regex: new RegExp( othertitle.toLowerCase(), 'i')
                        }
                    }
                ]
            }
                ).sort({_id:-1}).limit(10).lean()
        ads = ads.map(ad => {   
            ad.img = ad.img[0]
            ad.img = ad.img.split('uploads\\').join('')
            return ad
        })
        if (ads.length > 0) {
            res.send(ads)
        } else {
            res.send('error')
        }
    } else {
        res.send('error')
    }
})

// CATEGORY
router.get('/category/get/:id',async(req,res)=>{
    let _id = req.params.id
    let category = await Category.findOne({_id}).lean()
    res.send(category)
})
router.get('/category/getall',async(req,res)=>{
    let category = await Category.find({status:1}).sort({order:-1}).lean()
    res.send(category)
})

router.get('/page/get/:id',async(req,res)=>{
    let page = await Page.findOne({_id:req.params.id}).lean()
    if (page){
        res.send(page)
    }
})
router.get('/page/slug/:slug',async(req,res)=>{
    let page = await Page.findOne({slug:req.params.slug}).lean()
    if (page){
        res.send(page)
    }
})
router.get('/page/all',async(req,res)=>{
    let page = await Page.find({status:1}).select(['_id','title','slug']).lean()
    res.send(page)
})

router.get('/category/products/:id',async(req,res)=>{
    let products = await Product.find({status:1,category:req.params.id})
    .sort({_id:-1})
    .populate('category')
    .select(['title','price','sale','img','review','top','news','_id','leo','gidrox'])
    .lean()
    products = products.map(pro=>{
        pro.leo = pro.leo == 1 ? 'Leo' : ''
        pro.gidrox = pro.gidrox == 1 ? 'Gidrox' : ''
        return pro
    })
    if (products){
        res.send(products)
    } else {
        res.send('error')
    }
})
// Atribut
router.get('/atribut/get/:id',async(req,res)=>{
    let _id = req.params.id
    let atribut = await Atribut.findOne({_id}).lean()
    res.send(atribut)
})
router.get('/atribut/bycat/:id',async(req,res)=>{
    let atribute = await Atribut.find({category: req.params.id}).lean()
    res.send(atribute)
})
router.get('/atribut/getall',async(req,res)=>{
    let atribut = await Atribut.find({status:1}).sort({order:-1}).lean()
    res.send(atribut)
})

// SLIDER
router.get('/slider/get/:id',async(req,res)=>{
    let _id = req.params.id
    let slider = await Slider.findOne({_id}).lean()
    res.send(slider)
})
router.get('/slider/getall',async(req,res)=>{
    let slider = await Slider.find({status:1}).limit(4).sort({order:-1}).lean()
    res.send(slider)
})

// products

router.get('/allproduct', async(req,res)=> {
    let products = await Product.find().sort({_id:-1}).populate('category').lean()
    products = products.map(pro=>{
        pro.leo = pro.leo == 1 ? 'Leo' : ''
        pro.gidrox = pro.gidrox == 1 ? 'Gidrox' : ''
        return pro
    })
    res.send(products)

})

router.get('/newproduct',async(req,res)=>{
    let products = await Product.find({news:1})
    .sort({_id:-1})
    .populate('category')
    .select(['title','price','sale','img','review','top','news','_id','leo','gidrox'])
    .limit(4)
    .lean()
    products = products.map(pro=>{
        pro.leo = pro.leo == 1 ? 'Leo' : ''
        pro.gidrox = pro.gidrox == 1 ? 'Gidrox' : ''
        return pro
    })
    res.send(products)
})
router.get('/topproduct',async(req,res)=>{
    let products = await Product.find({top:1})
    .sort({_id:-1})
    .select(['title','price','sale','img','review','top','news','_id','leo','gidrox'])
    .populate('category')
    .limit(4)
    .lean()
    products = products.map(pro=>{
        pro.leo = pro.leo == 1 ? 'Leo' : ''
        pro.gidrox = pro.gidrox == 1 ? 'Gidrox' : ''
        return pro
    })
    res.send(products)
})
router.get('/leo',async(req,res)=> {
    let products = await Product.find({leo:1})
    .sort({_id:-1})
    .select(['title','price','sale','img','review','top','news','_id','leo'])
    .populate('category')
    .limit(4)
    .lean()
    products = products.map(pro=>{
        pro.leo = pro.leo == 1 ? 'Leo' : ''
        return pro
    })

    res.send(products)
})
router.get('/gidrox',async(req,res)=> {
    let products = await Product.find({gidrox:1})
    .sort({_id:-1})
    .select(['title','price','sale','img','review','top','news','_id','leo','gidrox'])
    .populate('category')
    .limit(4)
    .lean()
    products = products.map(pro=>{
        pro.gidrox = pro.gidrox == 1 ? 'Gidrox' : ''
        return pro
    })
    res.send(products)
})

router.post('/checkout',async(req,res)=>{
    let {name,lname,user,address,city,phone,email,cart,delivery,date,street,time,flat,comment,payment} = req.body
    user = user || ''
    lname = lname || ''
    cart = JSON.parse(cart)
    let newCheckout = await new Checkout({name,lname,user,address,city,phone,email,cart,delivery,date,street,time,flat,comment,payment})
    await newCheckout.save()
    res.send('ok')
})

router.get('/product/get/:id',async(req,res)=>{
    let _id = req.params.id
    let product = await Product
    .findOne({_id})
    .populate('category')
    .populate('atributes.atribut')
    .lean()
    product.img = product.img.map(item =>{ 
        return item.split('uploads\\').join('')
    })
    product.review = product.review.map(rev=>{
        rev.createdAt = rev.createdAt.toLocaleString()
        return rev
    })
    product.review = product.review.filter(rev => rev.status == 1)
    res.send(product)
})

router.post('/product/review',async(req,res)=>{
    let {product,title,text,mark,name} = req.body
    let productOne = await Product.findOne({_id:product})
    productOne.review.push({name,title,mark,text})
    await productOne.save()
    res.send(productOne.review)
})

router.post('/products/byid', async(req,res) => {
    let {favs} = req.body
    let products = await Product.find({
        _id: { $in: favs }
    }).populate('category')
    .select(['title','price','sale','img','review','top','news','_id'])
    res.send(products)
})

router.post('/products/cartid', async(req,res) => {
    let {carts} = req.body
    let products = await Product.find({
        _id: { $in: carts }
    })
    res.send(products)
})


// blog
router.get('/blog/get/:id',async(req,res)=>{
    let blog = await Blog.findOne({_id: req.params.id}).lean()
    res.send(blog)
})

router.get('/blog/home',async(req,res)=>{
    let blog = await Blog.find({status:1}).select(['_id','title','description','createdAt']).sort({order:-1,_id:-1}).limit(2).lean()
    blog = blog.map(b => {
        let date = new Date(b.createdAt)
        b.createdAt = date.getDate()+'-'+date.getUTCMonth()+'-'+date.getFullYear()
        return b 
    })
    res.send(blog)
})
router.get('/blog/all',async(req,res)=>{
    let blog = await Blog.find({status:1}).select(['_id','title','description','img','createdAt']).sort({order:-1}).lean()
    blog = blog.map(b => {
        b.img = b.img.split('uploads\\').join('')
        let date = new Date(b.createdAt)
        b.createdAt = date.getDate()+'-'+date.getUTCMonth()+'-'+date.getFullYear()
        return b 
    })
    res.send(blog)
})

// vakansi
router.get('/vakansi/get/:id',async(req,res)=>{
    let vakansi = await Vakansi.findOne({_id: req.params.id}).lean()
    res.send(vakansi)
})
router.get('/vakansi/all',async(req,res)=>{
    let vakansi = await Vakansi.find({status:1}).lean()
    res.send(vakansi)
})
router.post('/vakansi/condi',async(req,res)=>{
    let {name,sname,vakan,fname,phone,text} = req.body
    
    let file = req.files.file
    const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let filepath = `uploads/${uniquePreffix}_${file.name}`
    file.mv(filepath,async err => {
        if (err) console.log(err)
        let vakansi = await Vakansi.findOne({_id:vakan})
        vakansi.condi.push({name,sname,vakan,fname,phone,text,file:filepath})
        await vakansi.save()
        // {name,sname,vakan,fname,phone,text,file}
        res.send('ok')
    })
})

// promo

router.get('/promo/skip/:skip',async(req,res)=>{
    let skip = req.params.skip || 0
    let promo = await Promo.find({status:1}).select(['_id','title','img','createdAt']).sort({_id:-1}).skip(skip).limit(2).lean()
    
    res.send(promo)
})

router.get('/promo/get/:id',async(req,res)=>{
    let promo = await Promo.findOne({_id: req.params.id}).lean()
    res.send(promo)
})

router.get('/promo/home',async(req,res)=>{
    let promo = await Promo.find({status:1}).select(['_id','title','description','img','createdAt']).sort({order:-1,_id:-1}).limit(2).lean()
    promo = promo.map(b => {
        b.img = b.img.split('uploads\\').join('')
        let date = new Date(b.createdAt)
        b.createdAt = date.getDate()+'-'+date.getUTCMonth()+'-'+date.getFullYear()
        return b 
    })
    res.send(promo)
})
router.get('/promo/all',async(req,res)=>{
    let promo = await Promo.find({status:1}).select(['_id','title','description','img','createdAt']).sort({order:-1}).lean()
    promo = promo.map(b => {
        // b.img = b.img.split('uploads\\').join('')
        let date = new Date(b.createdAt)
        b.createdAt = date.getDate()+'-'+date.getUTCMonth()+'-'+date.getFullYear()
        return b 
    })
    res.send(promo)
})

// feedback

router.post('/feedback',async(req,res)=>{
    let {name,phone,text,type} = req.body
    type = type || 0
    let newFeedback = await new Feedback({name,phone,text,type})
    await newFeedback.save()
    res.send('ok')
})


// user

router.get('/user/checkemail/:email',async(req,res)=>{
    let {email} = req.params
    let checkUser = await User.findOne({email})
    if (checkUser){
        res.send('bad')
    } else {
        res.send('good')
    }
})

router.get('/user/checkphone/:phone',async(req,res)=>{
    let {phone} = req.params
    let checkUser = await User.findOne({phone})
    if (checkUser){
        res.send('bad')
    } else {
        res.send('good')
    }
})

router.post('/user/save',async(req,res)=>{
    let {name,email,phone,address,city,index,payment,delivery,id,token} = req.body
    let result = await Promise.all([checkToken(id,token)])
    if (result[0]){
        if (req.files.avatar){
            let file = req.files.avatar
            const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            let filepath = `uploads/${uniquePreffix}_${file.name}`
            file.mv(filepath,async err => {
                if (err) console.log(err)
                await User.findByIdAndUpdate(id,{name,email,phone,address,city,index,payment,delivery,avatar:filepath})
                res.send('ok')
            })
        } else {
            await User.findByIdAndUpdate(id,{name,email,phone,address,city,index,payment,delivery})
            res.send('ok')
        }
    } else {
            res.send(false)
    }

    
})

router.post('/user/reg',async(req,res)=>{
    try {
        let {name,phone,email,password} = req.body
        let hashpass = await bcryptjs.hash(password,10)
        let newUser = await new User({name,phone,email,password:hashpass})
        await newUser.save()
        res.send('ok')
    } catch (error) {
        res.send(error)
    }
})

async function checkToken(id,token){
    let user = await User.findOne({_id:id})
    if (user){
        let dateNow = new Date()
        if (dateNow < user.tokenExp && token == user.token) return true
    } 
    return false
}

router.post('/user/checkpass',async(req,res)=>{
    let {pass,user} = req.body
    let result = await Promise.all([checkToken(user._id,user.token)])
    if (result[0]){
        let checkUser = await User.findOne({_id:user._id})
        let comparePass = await bcryptjs.compare(pass,checkUser.password)
        res.send(comparePass)
    } else {
        res.send(false)
    }
})

router.post('/user/savepass',async(req,res)=>{
    let {pass,user} = req.body
    let result = await Promise.all([checkToken(user._id,user.token)])
    if (result[0]){
        let hashpass = await bcryptjs.hash(pass,10)
        await User.findByIdAndUpdate(user._id,{password:hashpass})
        res.send('ok')
    }
})
router.post('/user/checkuser',async(req,res)=>{
    let {_id,token} = req.body
    let result = await Promise.all([checkToken(_id,token)])
    res.send(result[0])
})



router.get('/user/clear/:id',async(req,res)=>{
    try {
        let _id = req.params.id
        let user = await User.findOne({_id})
        user.token = null
        user.tokenExp = null
        await user.save()
        res.send('ok')
    } catch (error) {
        res.send(error)        
    }
})


router.get('/user/get/:id/:token',async(req,res)=>{
    let {id,token} = req.params
    let user = await User.findOne({_id:id}).select(['name','email','phone','avatar','address','createdAt','city','index','payment','delivery','token','tokenExp'])

    if (user){
        console.log(user)
        let dateNow = new Date()
        if (dateNow < user.tokenExp && token == user.token){
            res.send(user)
        }
    } else {
        res.send(false)
    }

})

router.post('/user/login',async(req,res)=>{
    try {
        let {login,password} = req.body
        let checkUser = await User.findOne({
            $or:[
                {email:login},
                {phone:login}
            ]
        })
        if (checkUser){
            let comparePass = await bcryptjs.compare(password,checkUser.password)
            if (comparePass){
                let token = uuidv4()
                const date = new Date()
                date.setDate(date.getDate() + 1);
                let tokenExp = date
                checkUser.token = token
                checkUser.tokenExp = tokenExp
                await User.findByIdAndUpdate({_id:checkUser._id},{token,tokenExp})
                res.send({
                    _id: checkUser._id,
                    token
                })
            } else {
                res.send('password invalid')
            }
        } else {
            res.send('not exists')
        }
    } catch (error) {
        res.send(error)
    }
})

router.post('/oneclick',async(req,res)=>{
    if (req.body) {
        let {phone,_id} = req.body
        let newoneclick = await new Oneclick({phone,product:_id})
        await newoneclick.save()
        res.send('ok')
    } else {
        res.send('error')
    }
})

router.post('/oneclick/save',async(req,res)=>{
    if (req.body) {
        let {phone,status,_id,name,address} = req.body
        status = status || 0
        await Oneclick.findByIdAndUpdate(_id,{name,address,phone,status})
        
        res.send(JSON.stringify('ok'))
    } else {
        res.send(JSON.stringify('error'))
    }
})

router.get('/oneclick/get/:id',async(req,res)=>{
    if (req.params){
        let _id = req.params.id
        let oneclick = await Oneclick.findOne({_id})
        res.send(oneclick)
    }
})


module.exports = router