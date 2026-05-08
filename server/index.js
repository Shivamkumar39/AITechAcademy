const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')
const compression = require('compression')
const morgan = require('morgan')
// const { expressjwt: jwt }=require('express-jwt')
const authRouter=require("./router/Auth.js")
const userRouter=require("./router/Users.js")
const blogRoutes=require("./router/Blogs.js")
require('dotenv').config()

const cookieParser=require('cookie-parser')

const cors=require("cors")
const app=express()
const mongoConnection=require('./mongoDB/connection.js')


const corsConfig = {
  credentials: true,
  origin: true,
};
// const jwtSecret = 'secret123';
const PORT = Number(process.env.PORT) || 8000
const isProd = process.env.NODE_ENV === "production"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(morgan(isProd ? 'combined' : 'dev'))
app.use(limiter)
app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }))
app.use(cors(corsConfig))

app.use("/",authRouter)
app.use("/",userRouter)
app.use("/",blogRoutes)

app.use((err, req, res, next) => {
  console.error(err?.message || err)
  return res.status(500).json({ error: "Something went wrong. Please try again later." })
})

mongoConnection()

const startServer = (port, retries = 10) => {
  const server = app.listen(port, () => {
    console.log(`Listening at Port ${port}`)
  })
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      if (retries > 0) {
        const nextPort = port + 1
        console.warn(`Port ${port} is already in use. Trying ${nextPort}...`)
        return startServer(nextPort, retries - 1)
      }
      console.error(`Port ${port} is already in use. Tried multiple ports and failed.`)
    } else {
      console.error(error)
    }
    process.exit(1)
  })
}
startServer(PORT)
