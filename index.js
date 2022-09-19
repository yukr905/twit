import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import cors from 'cors';
import  {postController,UserController} from "./controllers/index.js"
import {registerValidation , loginValidation, postCreateValidation} from "./validations/validations.js"
import {handelValidationErrors,checkAuth} from "./utils/index.js"


mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("DB.ok")).catch((err)=>console.log(err))

const app =express()
app.use("/uploads",express.static("uploads"))
app.use(cors());
const storage = multer.diskStorage({destination:(_,__,cb)=>{
    cb(null,"uploads")
},
    filename:(_,file,cb)=>{
    cb(null,file.originalname)
},
})

const upload= multer({storage})

app.use(express.json())

app.post("/auth/register",registerValidation,handelValidationErrors, UserController.register)
app.post("/auth/login",loginValidation,handelValidationErrors ,UserController.login)
app.get("/auth/me",checkAuth,UserController.getMe)
app.post("/upload",checkAuth,upload.single('image'),(req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`
    })
})

app.get("/tags",postController.getLastTags)
app.get("/posts",postController.getAll)
app.get("/posts/:id",postController.getOne)
app.post("/posts",checkAuth,postCreateValidation,handelValidationErrors,postController.create)
app.patch("/posts/:id",checkAuth,postCreateValidation,handelValidationErrors,postController.update)
app.delete("/posts/:id",checkAuth,postController.remove)

app.listen(process.env.PORT || 4444,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Server started")
})