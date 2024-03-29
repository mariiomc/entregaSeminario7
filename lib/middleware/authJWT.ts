import { Request, Response, NextFunction } from 'express'
import users  from '../modules/users/schema';
import posts  from '../modules/posts/schema';
import reviews from '../modules/reviews/schema';
import UserService from '../modules/users/service';
var jwt = require('jsonwebtoken');


export class authJWT{
    
    private user_service: UserService = new UserService();


    public async  verifyToken (req: Request, res: Response, next: NextFunction) {
    try{
        const _SECRET: string = 'PalabraSecreta';
        console.log("verifyToken");
        
        const token = await req.headers.authorization.split(' ')[1]; // Obtener el token de la cabecera
        console.log("TOKEN: " + token)
        if (!token){
             return "nToken";
            }
        try {
            const decoded = jwt.verify(token, _SECRET);
            console.log("DECODED: " + decoded.foo);
            req.userId = decoded.id;
            req.userRol = decoded.rol; 
            console.log("Verificar token finalizado con éxito.")
            return next;
           
            } catch (error) {
                console.log("El token es inválido")
                return "invalid";
            }
        }
        catch(error){
            return "internal";
        }
        
    };


    public async isOwner (req: Request, res: Response, ThingToVerify: String, next: NextFunction) {
    try {

        const user_filter2 = {id: req.userId}

        const user = await this.user_service.filterUser(user_filter2);

        console.log("User filter: "+req.userId)
        var isAdmin: boolean = false;

        if (user) {
            console.log("si hay user");
            console.log("Rol del user: " + user.rol);
            if (user.rol == "admin") {
                isAdmin = true;
                console.log("es admin");
            }
        }

        switch(ThingToVerify){
                
                case 'Post':{
                    if(!isAdmin){
                        
                        const postId = req.params.id;
                        const post = await posts.findById(postId);
                        console.log("HE ENTRADO A POST")
                        if (!post) {return "nFound";}//return res.status(403).json({ message: "No post found" });}
                
                        if (post.author != req.userId) {return "nOwner";}//return res.status(403).json({ message: "Not Owner" });}
                    }
                        console.log("Token Verified from Post.")
                        return next();
                    }
                
                case 'Review':{
                    if(!isAdmin){
                        const reviewsId = req.params.id;
                        const review = await reviews.findById(reviewsId);
                
                        if (!review) {return "nFound";}//return res.status(403).json({ message: "No post found" });}
                
                        if (review.autorRef != req.userId) {return "nOwner";}//return res.status(403).json({ message: "Not Owner" });}
                    }
                        console.log("Token Verified from Review.")
                        return next();
                }
                case 'User':{

                    if(!isAdmin){
                        const userId = req.params.id;
                        const user = await users.findById(userId);
                
                        if (!user) {return "nFound";}//return res.status(403).json({ message: "No post found" });}
                
                        if (user._id != req.userId) {return "nOwner";}//return res.status(403).json({ message: "Not Owner" });}
                    }
                        
                        console.log("Token Verified from User.")
                        return next();
                }
            }

    } catch (error) {
        console.log("Da este error: "+error)
        return res.status(500).send({ message: error });
    }
    };


}