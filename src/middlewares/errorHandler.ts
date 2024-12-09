// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err)

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message
    })
  }

  return res.status(500).json({
    error: 'Internal Server Error'
  })
}
