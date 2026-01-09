import type { Media, SuccessResponseBody } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import type { RequestWithUser } from '@/interfaces/auth.interface'
import { HttpException } from '@exceptions/HttpException'
import { MediaService } from '@services/media.service'
import { asyncHandler } from '@utils/asyncHandler'
import { convertMediaToResponse } from '@utils/convertToResponse'
import { inject, injectable } from 'tsyringe'

@injectable()
export class MediaController {
  constructor(
    @inject(MediaService) private readonly mediaService: MediaService,
  ) {}

  public uploadMedia: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id?.toString()

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const { url, type } = req.body
    const media = await this.mediaService.createMedia({ url, type, ownerId: userId as any })

    const response: SuccessResponseBody<Media> = {
      success: true,
      data: convertMediaToResponse(media),
      message: 'MEDIA.UPLOADED',
    }

    res.status(201).json(response)
  })

  getMediaById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const media = await this.mediaService.getMediaById(id)

    const response: SuccessResponseBody<Media> = {
      success: true,
      data: convertMediaToResponse(media),
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

    const response: SuccessResponseBody<Media[]> = {
      success: true,
      data: mediaList.map(convertMediaToResponse),
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
