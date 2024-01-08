import express from 'express'
import userRouter from './routes/user.routes'
import DatabaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/media.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import path from 'path'
import { DIR } from './constant/dir'

config()

DatabaseService.connect()

const app = express()
const port = process.env.PORT || 4000

// create folder uploads
initFolder()

app.use(express.json())
app.use('/users', userRouter)
app.use('/medias', mediasRouter)

//serve static file
app.use('/static', express.static(path.resolve(DIR.UPLOAD_IMAGE_DIR)))

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
})
