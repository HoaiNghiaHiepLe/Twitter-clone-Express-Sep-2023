import { Request, Response } from 'express'
import mediaServices from '~/services/media.services'

export const uploadImageController = async (req: Request, res: Response) => {
  const result = await mediaServices.handleUploadImage(req)
  return res.json({
    message: 'Upload image successfully',
    result
  })
}