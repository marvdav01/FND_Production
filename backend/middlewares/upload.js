import multer from 'multer'
import path from 'path'
import fs from 'fs'

const rootUploadDir = path.resolve('uploads')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

ensureDir(rootUploadDir)

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WebP.'), false)
  }
}

function createImageUpload(subdir, maxFileSizeMb = 5) {
  const uploadDir = path.join(rootUploadDir, subdir)
  ensureDir(uploadDir)

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      const safeExt = path.extname(file.originalname).toLowerCase() || '.jpg'
      const userPart = req.user?.id ? `u${req.user.id}-` : ''
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      cb(null, `${file.fieldname}-${userPart}${uniqueSuffix}${safeExt}`)
    },
  })

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSizeMb * 1024 * 1024,
      files: 10,
    },
  })
}

export function toPublicUploadUrl(file) {
  const relativePath = path.relative(rootUploadDir, file.path).split(path.sep).join('/')
  return `/uploads/${relativePath}`
}

export const avatarUpload = createImageUpload('avatars', 5)
export const proofUpload = createImageUpload('payments', 8)
export const imageUpload = createImageUpload('images', 8)
export const upload = imageUpload
