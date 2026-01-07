import type { RequestWithUser, SuccessResponseBody } from '@shared/interfaces'
import type { MediaDB } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { MediaService } from '@services/media.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class MediaController {
  constructor(
    @inject(MediaService) private readonly mediaService: MediaService,
  ) {}

  public uploadMedia: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const { url, type } = req.body
    const media = await this.mediaService.createMedia({ url, type, ownerId: userId })

    const response: SuccessResponseBody<MediaDB> = {
      success: true,
      data: media,
      message: 'MEDIA.UPLOADED',
    }

    res.status(201).json(response)
  })

  public getMediaById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const media = await this.mediaService.getMediaById(id)

    const response: SuccessResponseBody<MediaDB> = {
      success: true,
      data: media,
      message: 'MEDIA.FOUND',
    }

    res.status(200).json(response)
  })

  public getUserMedia: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id?.toString()

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const mediaList = await this.mediaService.getMediaByOwner(userId)

    const response: SuccessResponseBody<MediaDB[]> = {
      success: true,
      data: mediaList,
      message: 'MEDIA.FOUND',
    }

    res.status(200).json(response)
  })

  public deleteMedia: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id?.toString()
    const { id } = req.params

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    await this.mediaService.deleteMedia(id, userId)

    const response: SuccessResponseBody<null> = {
      success: true,
      data: null,
      message: 'MEDIA.DELETED',
    }

    res.status(200).json(response)
  })
}
