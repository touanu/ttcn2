import type { RequestWithUser } from '@interfaces/auth.interface'
import type { Media, SuccessResponseBody } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { MediaService } from '@services/media.service'
import { asyncHandler } from '@utils/asyncHandler'
import { convertMediaToResponse, convertStringToObjectId } from '@utils/convertToResponse'
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

    if (!req.file)
      throw new HttpException(400, 'MEDIA.FILE_REQUIRED')

    // Extract subfolder from destination path (e.g., 'uploads/images' -> 'images')
    const subfolder = req.file.destination.split('/').pop()

    // Generate URL with proper subdirectory
    const url = `/uploads/${subfolder}/${req.file.filename}`

    // Determine media type from file mimetype
    let type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' = 'IMAGE'
    if (req.file.mimetype.startsWith('video/')) {
      type = 'VIDEO'
    }
    else if (req.file.mimetype.startsWith('audio/')) {
      type = 'AUDIO'
    }
    else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) {
      type = 'DOCUMENT'
    }

    const media = await this.mediaService.createMedia({ url, type, ownerId: convertStringToObjectId(userId) })

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
    const userId = userReq.user?._id

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
