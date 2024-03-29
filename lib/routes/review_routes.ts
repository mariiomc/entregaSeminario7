import { Application, Request, Response, NextFunction } from 'express';
import { ReviewController } from '../controllers/reviewController';
import  {authJWT}  from '../middleware/authJWT';


export class ReviewRoutes {

    private review_controller: ReviewController = new ReviewController();
    private AuthJWT: authJWT = new authJWT();

    public route(app: Application) {
        
        app.post('/review', async (req: Request, res: Response, next: NextFunction) => {
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
                this.review_controller.get_review(req, res);
            }
        });

        app.get('/review/:id', async (req: Request, res: Response, next: NextFunction) => {
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
                this.review_controller.get_review(req, res);
            }
        });

        app.delete('/review/:id', async (req: Request, res: Response, next: NextFunction) => {
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
                const resultado_isOwner = await this.AuthJWT.isOwner(req, res,'Review', next);
                if (resultado_isOwner == 'nFound'){
                    return res.status(404).json({ error: "Post not found"});
                }
                else if(resultado_isOwner == 'nOwner'){
                    return res.status(403).json({error: "Not owner"});
                }
                else{
                    this.review_controller.delete_review(req, res);
                }
            }
         });
    }
}