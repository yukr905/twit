import UserModel from "../models/User.js"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import bcrypt from "bcrypt"


export const register =async(req,res)=>{
    try {
    
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const Hash = await bcrypt.hash(password,salt)

    const doc =new UserModel({
        email: req.body.email,
        passwordHash:Hash,
        fullName:req.body.fullName,
        avatarUrl:req.body.avatarUrl
    })

    const user = await doc.save()

    const token = jwt.sign({
        _id:user._id 
    },"secret123456",{expiresIn:"1d"},)  

    const {passwordHash, ...userData} = user._doc
    res.json({...userData,token})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Неудалось зарегистрироваться"})
    }
}

export const login = async(req,res)=>{
    try {
        const user = await UserModel.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json({message:"Пользователь не найден"})
        }

        const isValidPass = await bcrypt.compare(req.body.password,user._doc.passwordHash)

        if(!isValidPass){
            return res.status(404).json({message:"Невернвый логин или пароль"})
        }
        const token = jwt.sign({
            _id: user._id,
        },"secret123456",{expiresIn:"1d"})

        const {passwordHash, ...userData} = user._doc

        res.json({...userData,token})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Неудалось авторизоваться "})
    }
}

export const getMe = async(req,res)=>{
    try {
        const user = await UserModel.findById(req.userId)
        if(!user){
            return res.status(404).json({message:"Пользователь не найден"})
        }
        const {passwordHash, ...userData} = user._doc

        res.json({userData})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Нет доступа "})
    }
    
}