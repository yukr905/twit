import {body} from "express-validator"

export const loginValidation =[
    body("email","неверный формат").isEmail(),
    body("password","пароль должен быть длинне 5 символов").isLength(5),
]

export const registerValidation =[
    body("email","неверный формат").isEmail(),
    body("password","пароль должен быть длинне 5 символов").isLength(5),
    body("fullName","имя должно быть длинне 3 символов").isLength(3),
    body("avatarUrl","неверная ссылка на аватарку").optional().isURL()
]

export const postCreateValidation =[
    body("title","Введите заголовок статьи").isLength(3).isString(),
    body("text","Введите текст статьи").isLength(5).isString(),
    body("tags","Введите теги").isArray(),
    body("imageUrl","Неверная ссылка на изображение").optional().isString()
]

