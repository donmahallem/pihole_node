import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as serveStatic from "serve-static";
import * as cookieParser from "cookie-parser";
import { apiRoute } from "./routes";


/**
 * The pihole app
 */
export class PiholeApp {
    private app: express.Application;
    private _port: number;
    private _started: boolean = false;;
    private http: http.Server;
    public static componentName: string = "APPPC";
    /**
     * Creates a new PiholeApp Instance
     * @param port the port this app should run on
     */
    constructor(port: number = 3000) {
        this._port = port;
        this.app = express();
        this.http = http.createServer(this.app);
        this.app.use(bodyParser.json());
        this.app.use("/static", serveStatic(__dirname + "/static"));
        this.app.use("/api", apiRoute);
        this.app.use(function (err, req, res, next) {
            console.log("Request errored", err);
        });
    }

    public get port(): number {
        return this._port;
    }

    public get started(): boolean {
        return this._started;
    }

    /**
     * Starts the server
     */
    public start() {
        if (!this.started) {
            this._started = true;
            this.http.listen(this.port, () => {
                console.log("Server listening on port " + this.port + "!");
            });
        }
    }
}