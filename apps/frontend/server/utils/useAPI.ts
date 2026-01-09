import type { SuccessResponseBody } from '@shared/types'
import type { H3Event } from 'h3'
import type { AvailableRouterMethod, NitroFetchOptions, NitroFetchRequest } from 'nitropack'

/**
 * Gọi API từ backend với xử lý lỗi chung
 * @param event Sự kiện H3
 * @param endpoint Đường dẫn API
 * @param options Tùy chọn cho nitropack fetch
 * @returns Dữ liệu trả về từ API
 */
export async function useAPI<T>(
  event: H3Event,
  endpoint: string,
  options?: NitroFetchOptions<NitroFetchRequest, AvailableRouterMethod<NitroFetchRequest>>,
): Promise<T> {
  const { beApiBaseUrl } = useRuntimeConfig()

  try {
    const res = await $fetch<SuccessResponseBody<T>>(`${beApiBaseUrl}${endpoint}`, options)
    return res.data as T
  }
  catch (error: any) {
    logger.error(`API ${endpoint}:`, error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.error?.message
        ? await translate(event, error.data.error.message)
        : (error.statusMessage || await translate(event, 'INTERNAL_SERVER_ERROR')),
      data: { errorCode: error.data?.error?.message },
    })
  }
}
