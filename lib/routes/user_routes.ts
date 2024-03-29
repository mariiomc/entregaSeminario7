import { Application, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/userController';
import  {authJWT}  from '../middleware/authJWT';
import { AuthController } from '../controllers/authController';

export class UserRoutes {

    private user_controller: UserController = new UserController();
    private AuthJWT: authJWT = new authJWT();
    private auth_controller: AuthController = new AuthController();

    public route(app: Application) {
        
        
        app.post('/signup', (req: Request, res: Response, next: NextFunction) => {
            this.auth_controller.signup(req,res);
        });

        app.get('/signin', (req: Request, res: Response, next: NextFunction) => {
            this.auth_controller.signin(req, res);
        });
        
        app.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const resultado_verifyToken = await this.AuthJWT.verifyToken(req, res, next);
            if (resultado_verifyToken == 'nToken'){
                return res.status(401).json({ error: "No Token Provided"});
            }else if (resultado_verifyToken == 'internal'){
                return res.status(500).json({ error: "Internal server error"});
            }
            else if(resultado_verifyToken == 'invalid'){
                return res.status(401).json({error: "Unauthorized! Invalid Token"});
            }
            else{
                this.user_controller.get_user(req, res);
            }
        });

        app.put('/:id',async (req: Request, res: Response, next: NextFunction) => {
            const resultado_verifyToken = await this.AuthJWT.verifyToken(req, res, next);
            if (resultado_verifyToken == 'nToken'){
                return res.status(401).json({ error: "No Token Provided"});
            }else if (resultado_verifyToken == 'internal'){
                return res.status(500).json({ error: "Internal server error"});
            }
            else if(resultado_verifyToken == 'invalid'){
                return res.status(401).json({error: "Unauthorized! Invalid Token"});
            }
            else{
                this.user_controller.update_user(req, res);
            }
        });

        app.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const resultado_verifyToken = await this.AuthJWT.verifyToken(req, res, next);
            if (resultado_verifyToken == 'nToken'){
                return res.status(401).json({ error: "No Token Provided"});
            }else if (resultado_verifyToken == 'internal'){
                return res.status(500).json({ error: "Internal server error"});
            }
            else if(resultado_verifyToken == 'invalid'){
                return res.status(401).json({error: "Unauthorized! Invalid Token"});
            }
            else{
                await console.log("pasamos a isOwner");
                const resultado_isOwner = await this.AuthJWT.isOwner(req, res,'User', next);
                if (resultado_isOwner == 'nFound'){
                    return res.status(404).json({ error: "Post not found"});
                }
                else if(resultado_isOwner == 'nOwner'){
                    return res.status(403).json({error: "Not owner"});
                }
                else{
                    await console.log("pasamos a deletePost");
                    await this.user_controller.delete_user(req, res);
                }
            }
         });
    }
}