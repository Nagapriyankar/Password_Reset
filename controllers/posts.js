const express = require('express')
const Post = require('../models/post')

const postController = {
    create: (request, response) => { 
        try {
            //get the userId from requst
            const userId = request.userId

            //get the request body
            const { title, description } = request.body
            
            //create a post
            const post = new Post({
                title,
                description,
                user: userId
            })

            //save the post
            post.save()

            return  response.json({message: 'Post created successfully', post})
        }
        catch (error) {
            response.status(500).json({error: error.message})
        }
        

        
    }


}

module.exports = postController