const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')
const compression = require('compression')
const morgan = require('morgan')
// const { expressjwt: jwt }=require('express-jwt')
const authRouter = require("./router/Auth.js")
const userRouter = require("./router/Users.js")
const blogRoutes = require("./router/Blogs.js")
const sitemapRouter = require("./router/Sitemap.js")
require('dotenv').config()

const cookieParser = require('cookie-parser')

const cors = require("cors")
const app = express()
app.set('etag', false);
const mongoConnection = require('./mongoDB/connection.js')


const corsConfig = {
  credentials: true,
  origin: true,
};
// const jwtSecret = 'secret123';
const PORT = Number(process.env.PORT) || 8000
const isProd = process.env.NODE_ENV === "production"
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
const apiUrl = process.env.API_URL || `http://localhost:${PORT}`

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(cookieParser())
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(compression())
app.use(morgan(isProd ? 'combined' : 'dev'))
app.use(limiter)
app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }))
app.use(cors(corsConfig))

// Serve static images from the uploads folder
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  etag: true,
  immutable: false
}));

// Update Helmet to allow local images (fixes the broken icon issue)
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "data:", "https:", "http:"],
      "connect-src": ["'self'", frontendUrl, apiUrl, "http://localhost:3000", "http://localhost:5600", "https:"],
    },
  })
);

app.use("/", authRouter)
app.use("/", userRouter)
app.use("/", blogRoutes)
app.use("/", sitemapRouter)

app.use((err, req, res, next) => {
  console.error(err?.message || err)
  return res.status(500).json({ error: "Something went wrong. Please try again later." })
})

const startServer = async (port) => {
  await mongoConnection()
  const server = app.listen(port, () => {
    console.log(`Listening at Port ${port}`)
  })
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please free this port or set PORT in server/.env and update REACT_APP_API_URL in clients/.env to the same value.`)
    } else {
      console.error(error)
    }
    process.exit(1)
  })
}
startServer(PORT)
