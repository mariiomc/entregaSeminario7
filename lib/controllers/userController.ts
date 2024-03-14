import { Request, Response } from 'express';
import { IUser } from '../modules/users/model';
import UserService from '../modules/users/service';
import e = require('express');

var jwt = require('jsonwebtoken');
var token;

export class UserController {

    private user_service: UserService = new UserService();

    public async create_user(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.name && req.body.name.first_name && req.body.name.middle_name && req.body.name.last_name &&
                req.body.email &&
                req.body.phone_number &&
                req.body.gender &&
                req.body.rol) {
                
                
                token = jwt.sign({ foo: req.body.name}, 'aaaa');
                console.log("El token es: " + token);


                const user_params: IUser = {
                    name: {
                        first_name: req.body.name.first_name,
                        middle_name: req.body.name.middle_name,
                        last_name: req.body.name.last_name
                    },
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    gender: req.body.gender,
                    token: token,
                    reviews: [],
                    password: req.body.password,
                    rol: req.body.rol,
                    //encryptPassword: undefined,
                    //validatePassword: undefined,
                };


                const user_data = await this.user_service.createUser(user_params);

                return res.status(201).json({ message: 'User created successfully', user: user_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async get_user(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const user_filter = { _id: req.params.id };
                // Fetch user
                const user_data = await this.user_service.populateUserPosts(user_filter);
                var tokenRecibido = req.headers.authorization;
                //console.log(req.headers)
                console.log('*'+tokenRecibido+"*")

                const tokenPart = tokenRecibido.split(' ')[1];

                console.log("TOKEN: " + tokenPart);
                
                var decoded = jwt.verify(tokenPart, 'aaaa');
                console.log(decoded.foo);

                return res.status(200).json({ data: user_data, message: 'Successful'});

            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async update_user(req: Request, res: Response) {
        //SOLO PUEDE ACTUALIZAR UN USUARIO EL PROPIO USUARIO
        try {
            if (req.params.id) {
                const user_filter = { _id: req.params.id };
                // Fetch user
                const user_data = await this.user_service.filterUser(user_filter);
                if (!user_data) {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'User not found' });
                }
                var tokenRecibido = req.headers.authorization;
                //console.log(req.headers)
                console.log('*' + tokenRecibido + "*")
    
                const tokenPart = tokenRecibido.split(' ')[1];
    
                console.log("TOKEN: " + tokenPart);
    
                try {
                    var decoded = jwt.verify(tokenPart, 'aaaa');
                    console.log(decoded.foo);
    
                    const user_params: IUser = {
                        _id: req.params.id,
                        name: req.body.name ? {
                            first_name: req.body.name.first_name || user_data.name?.first_name,
                            middle_name: req.body.name.middle_name || user_data.name?.middle_name,
                            last_name: req.body.name.last_name || user_data.name?.last_name
                        } : user_data.name || { first_name: '', middle_name: '', last_name: '' }, // Provide empty name object if not provided
                        email: req.body.email || user_data.email,
                        phone_number: req.body.phone_number || user_data.phone_number,
                        gender: req.body.gender || user_data.gender,
                        token: req.body.token || user_data.token,
                        rol: req.body.rol || user_data.rol,
                        password: undefined,
                        //encryptPassword: undefined,
                        //validatePassword: undefined,
                    };
                    // Update user
                    await this.user_service.updateUser(user_params);
                    //get new user data
                    const new_user_data = await this.user_service.filterUser(user_filter);
                    // Send success response
                    return res.status(200).json({ data: new_user_data, message: 'Successful' });
                } catch (error) {
                    // Catch and handle invalid token errors
                    console.error("Invalid token:", error);
                    return res.status(401).json({ error: 'Invalid token' });
                }
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            // Catch and handle any other errors
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    public async delete_user(req: Request, res: Response) {
        //SOLO SE PUEDE ELIMINAR EL USER SI TIENES ROL DE ADMIN
        try {
            const token = req.headers.authorization?.split(' ')[1]; // Obtener el token de la cabecera
    
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized: Token missing' });
            }
            
            console.log("TOKEN: " + token);

            // Verificar el token
            const decodedToken = jwt.verify(token, 'aaaa');
            const userRole = req.body.rol;
            console.log("ROL: "+ userRole);

            if (userRole !== "admin") {
                return res.status(403).json({ error: 'Unauthorized: Only admins can delete users' });
            }
    
            if (req.params.id) {
                // Delete user
                const delete_details = await this.user_service.deleteUser(req.params.id);

                if (delete_details.deletedCount !== 0) {
                    // Send success response if user deleted
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'User not found' });
                }
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            // Catch and handle any errors
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
}