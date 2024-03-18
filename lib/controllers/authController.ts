import { Request, Response,NextFunction } from 'express';
import e = require('express');
var jwt = require('jsonwebtoken');
import {IUser } from '../modules/users/model';
import User from '../modules/users/schema';
import UserService from '../modules/users/service';
import Post from '../modules/posts/schema';        
import PostService from '../modules/posts/service';

//import { body, validationResult } from 'express-validator';



export class AuthController{

  private user_service: UserService = new UserService();


      public async signin(req: Request, res: Response){
          try {
              
              const user_filter = { email: req.body.email, password: req.body.password };
              //console.log("req.body.password: " + req.body.password);
              const user_data = await this.user_service.populateUserPosts(user_filter);
            
              console.log(user_data.name.first_name, user_data.name.middle_name, user_data.name.last_name, user_data.email, user_data.phone_number, user_data.password )

              if (!user_data.password || !user_data.email) {
                  return res.status(404).json({ error: "El email: " + user_data.email + " o la contraseña: " + user_data.password + " es undefined." });
              }

              const user = new User({
                name: {
                    first_name: user_data.name.first_name,
                    middle_name: user_data.name.middle_name,
                    last_name: user_data.name.last_name
                },
                email: user_data.email,
                phone_number: user_data.phone_number,
                gender: user_data.gender,
                password: user_data.password || req.params.password,
                rol: user_data.rol
            });


              console.log("Contraseña: " + user_data.password);
              const validPassword = await user.validatePassword(user_data.password);
              if (!validPassword) {
                  return res.status(401).json({error:"No valid password" });
              }
      
              const token = jwt.sign({ id: user_data._id}, 'aaaa', {
                  expiresIn: 60 * 60 * 24,
              });
              console.log("TOKEN: " + token);
              console.log("Id: "+ user_data._id);
              return res.status(200).json({ auth: true, token });
            
            
          } catch (error) {
              console.log(error);
              return res.status(500).json({ error: 'Internal server error' });
          }
      }
      
    public async get_user(req: Request, res: Response, next: NextFunction){
      try{
        
        
        const token = req.headers.authorization.split(' ')[1]; // Obtener el token de la cabecera
        console.log(token);
        if (jwt.verify(token, 'aaaa')==false || !req.params.id) {
            return res.status(401).json({ error: 'Unauthorized: Token missing or id missing' });
        }
        else return next()
    }
    catch (error) {
      // Catch and handle any errors
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

    public async delete_post(req: Request, res: Response, next: NextFunction){
      try{
        const token = req.headers.authorization.split(' ')[1]; // Obtener el token de la cabecera
        console.log(token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token missing' });
        }      
        try{
          const decodedToken = jwt.verify(token, 'aaaa'); 
          const user = await User.findOne({ _id: decodedToken.foo });
          const userRole = user.rol;
          const post = await Post.findById(req.params.id);
          const post_userId= post.author._id;
        if (userRole !== "admin" && post_userId !== decodedToken.foo ) {
          return res.status(403).json({ error: 'Unauthorized: Only admins can delete users' });
        }
        else return next()
        }
        catch(error){
          return res.status(403).json({ error: 'Unauthorized: Unvalid Token' });
        }  
    }
    catch (error) {
      // Catch and handle any errors
      return res.status(500).json({ error: 'Internal server error' });
    }
      


    }
    public async create_post(req: Request, res: Response, next: NextFunction){
      try{
        const token = req.headers.authorization.split(' ')[1]; // Obtener el token de la cabecera
        
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token missing' });
        }      
        try{
        const decodedToken = jwt.verify(token, 'aaaa');
        return next();
        }
        catch(error){
          return res.status(403).json({ error: 'Unauthorized: Unvalid Token' });
        }
    
    }
    catch (error) {
      // Catch and handle any errors
      return res.status(500).json({ error: 'Internal server error' });
    }
      


    }
    
      public async signup(req: Request, res: Response): Promise<Response> {
        const { name: {first_name, middle_name, last_name}, email, phone_number, password } = req.body;
        console.log(first_name, middle_name, last_name, email, phone_number, password);
      
        const user = new User({
            name: {
                first_name,
                middle_name,
                last_name
            },
            email,
            phone_number,
            password
        });
        user.password = await user.encryptPassword(req.body.password);
        await user.save();
        console.log(user.password);
        return res.status(200).json("Registro completado, Bienvenido:" + user.name.first_name); 
    }
    
}