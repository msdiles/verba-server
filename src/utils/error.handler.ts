import { NextFunction, Request, Response } from "express"
import { IErrors } from "../interfaces"

interface Error {
  status?: number
  message?: string
  errors?: [string]
}

export function errorMiddleware(
  error: Error | HTTPException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500
  const message = !(error instanceof HTTPException)
    ? "Something went wrong"
    : error.message || "Something went wrong"
  const serverMessage = error.message || "Something went wrong"
  const errors = error.errors
  console.error({ status, serverMessage, errors })

  res.status(status).send({ status, message })
}

export class HTTPException extends Error {
  public status: number
  public message: string
  public errors?: [any] | IErrors[]
  constructor(status: number, message: string, errors?: [any] | IErrors[]) {
    super(message)
    this.message = message
    this.status = status
    this.errors = errors
  }
}
