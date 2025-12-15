import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { MongoClient } from 'mongodb'

// Lấy __dirname cho ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables từ config directory
const configDir = join(__dirname, '..', 'config')
dotenv.config({ path: join(configDir, '.env') })
dotenv.config({ path: join(configDir, '.env.development') })
dotenv.config({ path: join(configDir, '.env.local') })

async function generateInternalToken() {
  let client = null

  try {
    console.log('📁 Đang đọc cấu hình từ config...')

    const DB_HOST = process.env.DB_HOST || 'localhost'
    const DB_PORT = process.env.DB_PORT || '27017'
    const DB_NAME = process.env.DB_NAME || 'englearn'
    const DB_USERNAME = process.env.DB_USERNAME || ''
    const DB_PASSWORD = process.env.DB_PASSWORD || ''
    const INTERNAL_TOKEN_SECRET = process.env.INTERNAL_TOKEN_SECRET || 'secretkey456'

    if (!INTERNAL_TOKEN_SECRET) {
      console.error('❌ Thiếu INTERNAL_TOKEN_SECRET trong file .env')
      process.exit(1)
    }

    // Xây dựng MongoDB URI
    let mongoUri
    if (DB_USERNAME && DB_PASSWORD) {
      mongoUri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    }
    else {
      mongoUri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    }

    console.log('🔌 Đang kết nối với MongoDB...')
    client = new MongoClient(mongoUri)
    await client.connect()
    console.log('✅ Đã kết nối thành công với MongoDB\n')

    const db = client.db(DB_NAME)
    const usersCollection = db.collection('users')

    // Lấy role từ command line arguments
    const role = process.argv[2] || 'student'
    const validRoles = ['student', 'teacher', 'admin']

    if (!validRoles.includes(role)) {
      console.error(`❌ Role không hợp lệ: ${role}`)
      console.log(`Các role hợp lệ: ${validRoles.join(', ')}`)
      process.exit(1)
    }

    // Tìm user với role được chỉ định
    console.log(`🔍 Đang tìm user với role: ${role}...`)
    const user = await usersCollection.findOne({ role })

    if (!user) {
      console.error(`❌ Không tìm thấy user nào với role: ${role}`)
      console.log('💡 Hãy đảm bảo có ít nhất một user với role này trong database')
      process.exit(1)
    }

    console.log(`✅ Tìm thấy user: ${user.username} (${user.email})\n`)

    // Tạo token payload
    const tokenPayload = {
      id: user._id.toString(),
      role: user.role,
      scopes: ['internal'],
      iss: 'bff',
    }

    // Tạo JWT token
    const token = jwt.sign(tokenPayload, INTERNAL_TOKEN_SECRET, { expiresIn: '7d' })

    console.log('📋 Thông tin token:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`User ID: ${user._id}`)
    console.log(`Username: ${user.username}`)
    console.log(`Email: ${user.email}`)
    console.log(`Role: ${user.role}`)
    console.log(`Expires in: 7 days`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🔑 Token:')
    console.log(token)
    console.log('\n💡 Copy token trên và sử dụng trong header Authorization:')
    console.log(`   Authorization: Bearer ${token}\n`)

    await client.close()
    process.exit(0)
  }
  catch (error) {
    console.error('❌ Lỗi:', error.message)
    if (client) {
      try {
        await client.close()
      }
      catch {
        // Ignore close errors
      }
    }
    process.exit(1)
  }
}

// Chạy script
generateInternalToken()
