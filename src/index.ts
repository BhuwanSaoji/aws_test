import express from "express";
import route from "./routes/index"
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import logger from "./helpers/logger";

const DEFAULT_PORT = 3000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;
const app = express();

dotenv.config()

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // Only allows resources from the same origin
          scriptSrc: ["'self'", "trustedscripts.example.com"], // Allow only scripts from self and trusted sources
          objectSrc: ["'none'"], // Disallow object/embed/iframe elements
          upgradeInsecureRequests: [], // Upgrade HTTP requests to HTTPS
        },
      },
      crossOriginResourcePolicy: { policy: "same-origin" }, // Mitigates cross-origin data leaks
      crossOriginEmbedderPolicy: true, // Prevents embedding of unauthorized resources
      frameguard: { action: 'deny' }, // Prevents clickjacking by blocking iframe embedding
      xssFilter: true, // Enable browser's XSS filtering and protection
      hidePoweredBy: true, // Hide "X-Powered-By" header for security
      noSniff: true, // Prevent browsers from interpreting files as a different MIME type
      dnsPrefetchControl: { allow: false }, // Prevent browsers from DNS prefetching
      referrerPolicy: { policy: 'no-referrer' }, // Controls the referrer information sent with requests
}));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api", route);


app.listen(PORT,()=>{
    logger.info(`Server started at Port ${PORT}`, );
})