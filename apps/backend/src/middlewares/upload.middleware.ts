import { extname } from 'node:path'
import { backendDir } from '@shared/utils/currentDirectory'
import { logger } from '@utils/logger'
import multer from 'multer'
import ShortUniqueId from 'short-unique-id'

const { randomUUID } = new ShortUniqueId()

/**
 * Tạo một instance multer với các thiết lập tùy chỉnh
 * @param fileType Các loại file được phép tải lên. Ví dụ: ['.png', '.jpg', 'image/png', 'image/jpg']
 * @param location Thư mục con lưu trữ file tải lên bên trong thư mục uploads. Mặc định là thư mục gốc uploads.
 * @param fileSizeInMB Kích thước file tối đa tính bằng MB. Mặc định là 5MB.
 * @returns Cấu hình multer
 */
export function multerFactory(
  fileType: string[],
  location: string = '',
  fileSizeInMB: number = 5,
): multer.Multer {
  function checkFileType(
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) {
    const filetypes = new RegExp(fileType.join('|'))
    const extension = filetypes.test(extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extension) {
      return cb(null, true)
    }
    else {
      cb(new Error(`Only files of type ${fileType.join(', ')} are allowed`))
    }
  }

  const storage = multer.diskStorage({
    destination: `${backendDir}/uploads/${location}`,
    filename(_req, file, cb) {
      const filename = `${Date.now()}-${randomUUID()}${extname(file.originalname)}`
      logger.info(`[Upload] FileName: ${filename}`)
      cb(null, filename)
    },
  })

  return multer({
    storage,
    limits: { fileSize: fileSizeInMB * 1000000 },
    fileFilter(_req, file, cb) {
      checkFileType(file, cb)
    },
  })
}
