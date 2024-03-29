import { Request, Response } from 'express';
import { IPost } from '../modules/posts/model';
import PostService from '../modules/posts/service';
import UserService from '../modules/users/service';
import e = require('express');

export class PostController {

    private post_service: PostService = new PostService();
    private user_service: UserService = new UserService();

    public async createPost(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.title && req.body.content && req.body.author){
                const post_params:IPost = {
                    title: req.body.title,
                    content: req.body.content,
                    author: req.body.author
                };
                const post_data = await this.post_service.createPost(post_params);
                 // Now, you may want to add the created post's ID to the user's array of posts
                await this.user_service.addPostToUser(req.body.author, post_data._id); //
                return res.status(201).json({ message: 'Post created successfully', post: post_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getPost(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const post_filter = { _id: req.params.id };
                // Fetch user
                const post_data = await this.post_service.filterPost(post_filter);
                // Send success response
                return res.status(200).json({ message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async deletePost(req: Request, res: Response) {
        try {
            const postId = req.params.id;
    /*
            if (!postId) {
                return res.status(400).json({ error: 'Missing Id' });
            }
            */
    
            const delete_details = await this.post_service.deletePost(postId);

            console.log("HE SALIDO DE DELETE POST")
    
            if (delete_details.deletedCount !== 0) {
                console.log("Respuesta successful")
                // Si se eliminó correctamente, enviar una respuesta de éxito
                return res.status(200).json({ message: 'Successful' });
            } else {
                console.log("no se ha encontrado el post")
                // Si no se encontró el post, enviar una respuesta de error
                return res.status(400).json({ error: 'Post not found' });
            }
        } catch (error) {
            // Si ocurre un error, enviar una respuesta de error interno del servidor
            console.error("Error occurred during post deletion:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
}