import Post from "..//models/Post.js"

export const getAll = async(req,res)=>{
    try {
        const posts = await Post.find().populate('user').exec()

        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Не удалось получить статьи"})
    }
}
export const getOne = async(req,res)=>{
    try {
        const id = req.params.id
        Post.findOneAndUpdate({_id:id}
            ,{$inc:{viewsCount:1}}
            ,{returnDocument:"after"}
            ,(err,doc)=>{
                if(err) return res.status(500).json({message:"Неудалось вернуть статью"})
                if(!doc) return res.status(404).json({message:"Статья не найдена"})
                res.json(doc)
            }
        ).populate("user")
    }
    catch (error) {
        console.log(error)
        res.status(500).json({message: "Неудалось получить статьи"})
    }
}
export const remove = async(req,res)=>{
    try {
        const id = req.params.id
        Post.findOneAndDelete({_id:id},(err,doc)=>{
            if(err) {
                console.log(err)
                return res.status(404).json("Неудалось удалить статью")}
            if(!doc) {
                console.log(err)
                return res.status(404).json("Неудалось найти сатью")
            }
            res.json({
                success:true
            }) 
        }
        )
    }
     catch (error) {
        console.log(error)
        res.status(500).json({message: "Неудалось получить статьи"})
    }
}


export const create = async(req,res)=>{
    try {
        const doc = new Post({
            title:req.body.title,
            text:req.body.text,
            tags:req.body.tags.split(","),
            imageUrl:req.body.imageUrl,
            user:req.userId
        })
        const post = await doc.save()
        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Не удалось опубликовать статью"})
    }
}
export const update = async(req,res)=>{
    try {
        const id = req.params.id
        await Post.updateOne({_id:id},{
            title:req.body.title,
            text:req.body.text,
            tags:req.body.tags.split(","),
            imageUrl:req.body.imageUrl,
            user:req.userId
        }
        )
        res.json({
            success:true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Не удалось обновить статью"})
    }
}
export const getLastTags = async(req,res)=>{
    try {
        const posts = await Post.find().limit(5).exec()
        const tags = posts.map((obj) =>obj.tags).flat().slice(0,5)

        res.json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Не удалось получить теги"})
    }
}