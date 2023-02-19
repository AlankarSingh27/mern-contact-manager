import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import {DBUtil} from "./util/DBUtil";
import contactRouter from "./router/contactRouter";
import groupRouter from "./router/groupRouter";
import cors from 'cors';
import path from "path";

const app: Application = express();

// configure the CORS with express
app.use(cors());

// configure express to receive the form data
app.use(express.json());

// configure dot-env
dotenv.config({
    path: "./.env"
});


const port: string | number = process.env.PORT || 9000;
const dbUrl: string | undefined = process.env.MONGO_DB_CLOUD_URL;
const dbName: string | undefined = process.env.MONGO_DB_DATABASE;

app.get("/", (request: Request, response: Response) => {
    response.status(200);
    response.json({
        msg: "Welcome to Express Server"
    });
});
// if(process.env.NODE_ENV==="production"){
//     app.use(express.static(path.join(__dirname,"..","build")));
//     app.get("/",(request:Request,response:Response)=>{
//         response.sendFile(path.join(__dirname,"..","build","index.html"))
//     });
//}

// configure the routers
app.use("/contacts", contactRouter);
app.use("/groups", groupRouter);

if (port) {
    app.listen(Number(port), () => {
        if (dbUrl && dbName) {
            DBUtil.connectToDB(dbUrl, dbName).then((dbResponse) => {
                console.log(dbResponse);
            }).catch((error) => {
                console.error(error);
                process.exit(0); // Force stop express server
            });
        }
        console.log(`Express Server is started at ${port}`);
    });
}
