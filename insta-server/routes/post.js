const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')

router.get('/allpost', requireLogin, (req, res)=>{
    this.post.find()
    .populate("postedBy", "_id name email")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/createpost", requireLogin, (req, res)=>{
    const {title, body} = req.body
        if(!title || !body){
            return res.status(422).json({error: "Please add all the fields"})
        }
        const post = new this.post({
            title,
            body,
            postedBy: req.user
        })
        post.save()
        .then((savedPost)=>{
            res.json({message: "Post created successfully"})
        })
        .catch(err=>{
            console.log(err)
        })
})

router.get("/postbyme", requireLogin, (req, res)=>{
    this.post.find({postedBy: req.user._id})
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})



module.exports  = router