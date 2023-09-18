//------------------------- app services initializing ---------------------------

// initializing express services
const express = require("express")
const { blogs, users } = require("./model/index")
const { where } = require("sequelize")
const app = express()

//intializing ejs services
app.set("view engine", 'ejs')

//to make access for external css
app.use(express.static("public/"))

//to connect database
require("./model/index")

// for parse incoming form data
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//for hashing passwords
const bcrypt = require("bcryptjs")


//------------------------- app.get functions -----------------------------------

//get public blog page
app.get('/', async(req, res)=>{

    const allPosts = await blogs.findAll({
        order: [
            ['id', 'desc'],
        ],
    })
    res.render("index", {posts:allPosts})
})

//get log in page
app.get('/login',(req, res)=>{
    //res.render("login")
    res.render("login", {msg:''})
})

//get log in page with error msg
app.get('/login/:msg',(req, res)=>{

    //get error msg while signup
    const msg = req.params.msg
    res.render("login", {msg:msg})
})

//get sign up page
app.get('/register',(req, res)=>{
    //res.render("register")
    res.render("register", {msg:''})
})

//get sign up page with error msg
app.get('/register/:msg',(req, res)=>{

    //get error msg while signup
    const msg = req.params.msg
    res.render("register", {msg:msg})
})

//get home page after login
app.get('/home/:email',async(req, res)=>{

    //get email of logged in user
    const email = req.params.email

    //get all data of given id post
    const posts = await blogs.findAll({
       where : {
        email: email
       }
    })

    res.render("home", {posts:posts, email:email})
})

//get add post page
app.get('/addPost/:email',(req, res)=>{

    //get email of logged in user
    const email = req.params.email

    res.render("addPost", {email:email})
})

//get add post page
app.get('/about',(req, res)=>{
    res.render("about")
})

//get add post page
app.get('/contact',(req, res)=>{
    res.render("contact")
})

//displaying read more post
app.get('/post/:id',async(req, res)=>{
    
    //get id of clicked blog post
    const id = req.params.id

    //get all data of given id post
    const post = await blogs.findAll({
       where : {
        id: id
       }
    })

    //for sidebar contents
    const allPosts = await blogs.findAll({
        order: [
            ['id', 'desc'],
        ],
    })

    res.render("post",{post:post, posts:allPosts})
})

//get edit post page
app.get('/editPost/:id',async(req, res)=>{

    //get id of clicked blog post
    const id = req.params.id

    //get all data of given id post
    const post = await blogs.findAll({
       where : {
        id: id
       }
    })

    res.render("editPost",{post:post})
})

//deleting the post
app.get('/deletePost/:id', async(req, res)=>{
    const id = req.params.id

    const post = await blogs.findAll({
        where: {
            id:id
        }
    })

    await blogs.destroy({
        where: {
            id: id
        }
    })

    res.redirect("/home/"+post[0].email)
})



//------------------------- app.post functions -----------------------------------

//adding new post
app.post('/addPost', async(req, res)=>{
    const title = req.body.title
    const content = req.body.content
    const email = req.body.email

    await blogs.create({
        title: title,
        content: content,
        email: email
    })

    res.redirect("/home/"+email)
})

//editing the post
app.post('/editPost/:id', async(req, res)=>{
    const id = req.params.id
    const title = req.body.title
    const content = req.body.content

    const post = await blogs.findAll({
        where: {
            id:id
        }
    })

    await blogs.update({
        title: title,
        content: content
    },{
        where:{
            id: id
        }
    })

    res.redirect("/home/"+post[0].email)
})

//registering new user
app.post('/register', async(req, res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    if(!name || !email || !password){
        const msg = "please enter name, email and password fields"
        res.redirect("/register/"+msg)
    }
    else{

        //checking is email is already exists or not
        const userExists = await users.findAll({
            where : {
                email : email
            }
        }) 

        if(userExists.length > 0){
            const msg = "The provided email is already registered."
            res.redirect("/register/"+msg)
        }
        else{
            await users.create({
                name: name,
                email: email,
                password: bcrypt.hashSync(password, 8),
            }) 

            res.redirect("/login")
        }
    }
})

//for login user
app.post("/login", async (req, res)=>{
    const email = req.body.email
    const password = req.body.password

    //checking is email is exists or not
    const userExists = await users.findAll({
        where : {
            email : email
        }
    }) 

    if(userExists.length > 0){
        
        //checking now password
        const isMatch = bcrypt.compareSync(password,userExists[0].password)
       
        if(isMatch){
           // res.send("Logged in successfully.")
           res.redirect("/home/"+email)
        }else{
            //res.send("Invalid password")
            const msg = "Invalid Password !"
            res.redirect("/login/"+msg)
        }
    }else{
        //res.send("Please enter correct email address")
        const msg = "Please enter correct email address"
        res.redirect("/login/"+msg)
    }
})








//------------------------- app.listen function -----------------------------------

app.listen(3000,function(){
    console.log("NodeJS Project by Pratik Dangol is running on port 3000")
})