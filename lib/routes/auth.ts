import { Application, Request, Response } from 'express';
import {AuthController} from '../controllers/authController',


export class AuthRoutes{

private auth_controller: AuthController= new AuthController;

    public route(app: Application){


        app.post('/signup', (req: Request, res: Response) => {
            this.auth_controller.signup(req, res);
        });
        
    }

}