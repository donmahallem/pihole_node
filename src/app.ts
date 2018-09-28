import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as apiRoute from './routes/api.route';


/**
 * The pihole app
 */
export class PiholeApp {
    public static componentName: string = 'APPPC';
    private app: express.Application;
    private _port: number;
    private _started: boolean = false;;
    private http: http.Server;
    /**
     * Creates a new PiholeApp Instance
     * @param port the port this app should run on
     */
    constructor(port: number = 3000) {
        this._port = port;
        this.app = express();
        this.http = http.createServer(this.app);
        this.app.use(bodyParser.json());
        this.app.use('/api', apiRoute);
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log('Request errored', err);
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
                console.log('Server listening on port ' + this.port + '!');
            });
        }
    }
}