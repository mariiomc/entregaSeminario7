import { Application, Request, Response } from 'express';
import { PostController } from '../controllers/postController';
import { AuthController } from '../controllers/authController';

export class PostRoutes {

    private post_controller: PostController = new PostController();
    private auth_controller: AuthController = new AuthController();

    public route(app: Application) {
        
        app.post('/post',this.auth_controller.create_post, this.post_controller.createPost);

        app.get('/post/:id', (req: Request, res: Response) => {
            this.post_controller.getPost(req, res);
        });

        app.delete('/post/:id', this.auth_controller.delete_post, this.post_controller.deletePost);

    }
}