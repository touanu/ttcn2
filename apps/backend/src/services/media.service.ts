import type { MediaDB } from '@/interfaces/media.interface'
import { HttpException } from '@exceptions/HttpException'
import { MediaModel } from '@models/media.model'
import { logger } from '@utils/logger'
import { injectable } from 'tsyringe'

@injectable()
export class MediaService {
  public async createMedia(mediaData: Partial<MediaDB>): Promise<MediaDB> {
    const media = new MediaModel({
      ...mediaData,
      createdAt: new Date(),
    })

    const savedMedia = await media.save().catch((error) => {
      logger.error(`Lỗi khi tạo media: ${error.message}`)
      throw new HttpException(500, 'MEDIA.CREATION_FAILED')
    })

    return savedMedia.toObject() as MediaDB
  }

  public async getMediaById(mediaId: string): Promise<MediaDB> {
    const media = await MediaModel.findById(mediaId).lean<MediaDB>().exec()

    if (!media)
      throw new HttpException(404, 'MEDIA.NOT_FOUND')

    return media
  }

  public async getMediaByOwner(ownerId: string): Promise<MediaDB[]> {
    const mediaList = await MediaModel.find({ ownerId } as any)
      .sort({ createdAt: -1 })
      .lean<MediaDB[]>()
      .exec()

    return mediaList
  }

  public async deleteMedia(mediaId: string, userId: string): Promise<void> {
    const media = await MediaModel.findById(mediaId)

    if (!media)
      throw new HttpException(404, 'MEDIA.NOT_FOUND')

    if (media.ownerId.toString() !== userId)
      throw new HttpException(403, 'MEDIA.DELETE_FORBIDDEN')

    await MediaModel.findByIdAndDelete(mediaId)
  }
}
