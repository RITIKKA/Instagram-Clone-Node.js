const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../secret')
// const requireLogin  = require('../middleware/requireLogin')


router.post('/signup', (req, res)=> 
{
    const {name, email, password} = req.body
    //  console.log(req.body)
    // check if all values are not empty.
        if(!name || !email || !password){
           return res.status(400).json({error: "Please add all the fields"})
        }
        // check if  user already exist
        User.findOne({email: email})
            .then(
                (savedUser)=>{
                    if(savedUser!=null){
                        return res.status(400).json({error: "User already exists with that email"})
                    }
                    // if user does not exist, create a  new user
                    bcrypt.hash(password, 12)
                    .then(
                        (hashPassword) => {
                            const user = new User({
                                name,
                                email,
                                password: hashPassword
                            })
                            user.save()
                            .then(
                                user=>{
                                    res.json({message: "saved successfully"})
                                }
                            )
                            .catch(
                                err=>{
                                    console.log(err)
                                }
                            )
                        }
                    )
                }
            )
            .catch(
                err=>{
                    console.log(err)
                }
            )
})

router.post('/signin', (req, res)=>{
    // console.log(req.body)
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({error: "Please add email and password"})
    }
    User.findOne({email: email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(400).json({error: "Invalid email or password"})
        }
        // console.log(savedUser)
        bcrypt.compare(password, savedUser.password)
        .then(
            (doMatch)=>{0
                if(doMatch==true){
                    const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                    res.json({message: "Successfully signed in", token: token})
                }
                else{
                    return res.status(400).json({error: "Invalid email or password"})
                }
            }
        )
    })
})

// router.get('/topsecret', requireLogin, (req, res)=>{
//     // console.log(req.headers)
//     // console.log(req.user)
//     res.send("Lets talk on call")
// })

module.exports = router