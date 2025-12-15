import path from 'node:path'
import { NODE_ENV } from '@shared/config'
import { Eta } from 'eta'
import mjml2html from 'mjml'
import { logger } from './logger'

const eta = new Eta({
  views: path.join(__dirname, '../templates'),
  cache: true,
  debug: NODE_ENV !== 'production',
})

export async function renderMJMLTemplate(
  templateName: string,
  data: Record<string, any>,
): Promise<string> {
  try {
    const mjml = await eta.renderAsync(templateName, data)
    const { html, errors } = mjml2html(mjml)

    if (errors.length) {
      logger.error(`Có lỗi khi kết xuất MJML: ${errors.toString()}`)
    }

    return html
  }
  catch (error) {
    logger.error(`Lỗi khi kết xuất mẫu '${templateName}': ${(error as Error).message}`)
    return ''
  }
}

export async function renderTemplate(
  templateName: string,
  data: Record<string, any>,
): Promise<string> {
  try {
    const rendered = await eta.renderAsync(templateName, data)
    return rendered
  }
  catch (error) {
    logger.error(`Lỗi khi kết xuất mẫu '${templateName}': ${(error as Error).message}`)
    return ''
  }
}
