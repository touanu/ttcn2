import type { Routes } from '@interfaces/routes.interface'
import { MediaController } from '@controllers/media.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { audioUpload, documentUpload, imageUpload, videoUpload } from '@middlewares/upload.middleware'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class MediaRoute implements Routes {
  public router: Router = Router()
  public path = '/media'

  constructor(@inject(MediaController) private mediaController: MediaController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Upload endpoints for different media types
    this.router.post(
      `${this.path}/upload/image`,
      AuthMiddleware,
      imageUpload.single('file'),
      this.mediaController.uploadMedia,
    )

    this.router.post(
      `${this.path}/upload/video`,
      AuthMiddleware,
      videoUpload.single('file'),
      this.mediaController.uploadMedia,
    )

    this.router.post(
      `${this.path}/upload/audio`,
      AuthMiddleware,
      audioUpload.single('file'),
      this.mediaController.uploadMedia,
    )

    this.router.post(
      `${this.path}/upload/document`,
      AuthMiddleware,
      documentUpload.single('file'),
      this.mediaController.uploadMedia,
    )

    // Get endpoints
    this.router.get(
      `${this.path}/:id`,
      this.mediaController.getMediaById,
    )

    this.router.get(
      `${this.path}/user/me`,
      AuthMiddleware,
      this.mediaController.getUserMedia,
    )

    // Delete endpoint
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      this.mediaController.deleteMedia,
    )
  }
}
