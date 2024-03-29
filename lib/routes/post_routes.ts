import { Application, NextFunction, Request, Response } from 'express';
import { PostController } from '../controllers/postController';
import  {authJWT}  from '../middleware/authJWT';


export class PostRoutes {

    private post_controller: PostController = new PostController();
    private AuthJWT: authJWT = new authJWT();

    public route(app: Application) {
        
        app.post('/post', async (req: Request, res: Response, next: NextFunction) => {
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
                this.post_controller.createPost(req, res);
            }
        });

        app.get('/post/:id', async (req: Request, res: Response, next: NextFunction) => {
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
                this.post_controller.getPost(req, res);
            }
        });

        app.delete('/post/:id', async (req: Request, res: Response, next: NextFunction) => {
            const resultado_verifyToken = await this.AuthJWT.verifyToken(req, res, next);
            if (resultado_verifyToken == 'nToken'){
                return res.status(401).json({ error: "No Token Provided"});
            }
            else if (resultado_verifyToken == 'internal'){
                return res.status(500).json({ error: "Internal server error"});
            }
            else if(resultado_verifyToken == 'invalid'){
                return res.status(401).json({error: "Unauthorized! Invalid Token"});
            }
            else{
                await console.log("pasamos a isOwner");
                const resultado_isOwner = await this.AuthJWT.isOwner(req, res,'Post', next);
                if (resultado_isOwner == 'nFound'){
                    return res.status(404).json({ error: "Post not found"});
                }
                else if(resultado_isOwner == 'nOwner'){
                    return res.status(403).json({error: "Not owner"});
                }
                else{
                    await console.log("pasamos a deletePost");
                    await this.post_controller.deletePost(req, res);
                }
            }
         });
    }
}