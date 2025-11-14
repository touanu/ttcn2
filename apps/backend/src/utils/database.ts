import type { ConnectOptions } from 'mongoose'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, NODE_ENV } from '@shared/config'
import { connect, set } from 'mongoose'

export async function dbConnection() {
  const dbConfig = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    options: {
      user: DB_USERNAME,
      pass: DB_PASSWORD,
    } as ConnectOptions,
  }

  if (NODE_ENV !== 'production') {
    set('debug', true)
  }

  await connect(dbConfig.url, dbConfig.options)
}
