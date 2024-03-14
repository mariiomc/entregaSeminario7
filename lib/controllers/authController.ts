import { Request, Response } from 'express';
import e = require('express');
var jwt = require('jsonwebtoken');
import {IUser } from '../modules/users/model'
import User from '../modules/users/schema';        
import UserService from '../modules/users/service';



export class AuthController{

  private user_service: UserService = new UserService();


     public async signin(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(404).send("El email no existe");
        }

          if (req.params.id) {
              const user_filter = { email: req.params.email };
              // Fetch user
              const user_data = await this.user_service.populateUserPosts(user_filter);
              if(user_data.password == password){
                  const token = jwt.sign({ id: user._id}, 'aaaa', {
                  expiresIn: 60 * 60 * 24,                  
                });                  
                console.log("TOKEN: " + token);
                return res.status(200).json({ auth: true, token });
              }
              else{
                return res.status(405).send("La contraseña es incorrecta.");
              }
          }
        

  
        /*const validPassword = await user.validatePassword(password);
        if (!validPassword) {
          return res.status(401).json({ auth: false, token: null });
        }
        */
      
    }

    //Ya existe un create_user, que es el signup
    /*
      public async signup(req: Request, res: Response): Promise<Response> {
<<<<<<< HEAD
        const { name, email, phone_number, gender, password, rol } = req.body;
        console.log(name, email, phone_number, gender, password, rol);
      
        const user = new User({
          name
=======
        const { name: { first_name, middle_name, last_name },email, phone_number, gender, password } = req.body;
        console.log({ name: { first_name, middle_name, last_name },email, phone_number, gender, password });
      
        const user = new User({
            name: {
                first_name,
                middle_name,
                last_name
            },
            email,
            phone_number,
            gender,
            password
>>>>>>> 2765c2f862e972f09edf96d0da10278433f0c6de
        });
        user.password = await user.encryptPassword(req.body.password);
        await user.save();
        return res.status(200).json("Registro completado, Bienvenido:" + user.name.first_name);
    }
    */
    
    /*public async priv(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
              return res.status(404).json({ error: "No se encontró el usuario" });
            }
            const { password, ...userWithoutPassword } = user.toObject();
            return  res.json({ user });
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error interno del servidor" });
          }
    }
    public async publ(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
              return res.status(404).json({ error: "No se encontró el usuario" });
            }
            const { password, ...userWithoutPassword } = user.toObject();
            return res.json({ user });
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error interno del servidor" });
          }
    } */
}