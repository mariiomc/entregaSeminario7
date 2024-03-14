import { Request, Response } from 'express';
import e = require('express');
var jwt = require('jsonwebtoken');
import {IUser } from '../modules/users/model'
import User from '../modules/users/schema';

export class AuthController{
     public async  signin(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(404).send("El email no existe");
        }
        const validPassword = await user.validatePassword(password);
        if (!validPassword) {
          return res.status(401).json({ auth: false, token: null });
        }
        const token = jwt.sign({ id: user._id}, 'aaaa', {
          expiresIn: 60 * 60 * 24,
        });
        return res.json({ auth: true, token });
    }
    
      public async signup(req: Request, res: Response): Promise<Response> {
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
        });
        user.password = await user.encryptPassword(req.body.password);
        await user.save();
        return res.status(200).json("Registro completado, Bienvenido:" + user.name.first_name);
    }
    
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