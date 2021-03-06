import * as sqlite from 'sqlite3';
import {
    Observable,
    Observer,
    merge,
    throwError
} from 'rxjs';
import {
    mergeMap,
    catchError
} from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { RouteError } from '../routes/route-error';
import { DatabaseUtil } from './database-util';

export interface DbUser {
    username?: string,
    password?: string
}

export class UserDatabase {

    private database: sqlite.Database;
    constructor() {
        this.database = new sqlite.Database('users.db');
        this.database.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'username TEXT UNIQUE,' +
            'password TEXT,' +
            'padmin INTEGER)', (err) => {
                // TODO:  Fix at some point
                console.error(err);
            });
    }

    public createHashedPassword(password: string, saltOrRounds: string | number = 12): Observable<string> {
        return merge(bcrypt.hash(password, saltOrRounds));
    }

    public setPassword(user: string, password: string): Observable<sqlite.Statement> {
        return this.createHashedPassword(password)
            .pipe(mergeMap((hash: string) => {
                const sqlStatement: string = 'INSERT INTO users (username,password) VALUES(?,?) '
                    + 'ON CONFLICT(username) DO UPDATE SET password=?;';
                return DatabaseUtil.prepareStatement(this.database, sqlStatement, [user, password, password]);
            }));
    }

    public getUsers(): Observable<DbUser> {
        const sqlStatement: string = 'SELECT * FROM users;';
        return DatabaseUtil.prepareStatement(this.database, sqlStatement)
            .pipe(mergeMap((stat: sqlite.Statement) => {
                return DatabaseUtil.statementToList(stat);
            }));
    }


    public createUser(username: string, password: string): Observable<DbUser> {
        const sqlStatement: string = 'INSERT INTO users (username,password) VALUES(?,?);';
        return this.createHashedPassword(password)
            .pipe(mergeMap((hash: string): Observable<sqlite.Statement> => {
                return DatabaseUtil.prepareStatement(this.database, sqlStatement, [username, hash]);
            }), mergeMap((stat: sqlite.Statement): Observable<any> => {
                return DatabaseUtil.runStatement(stat);
            }), catchError((error: Error) => {
                if (error.message && error.message.startsWith('SQLITE_CONSTRAINT')) {
                    if (error.message.indexOf('.username')) {
                        return throwError(new RouteError(401, 'Username already exists'));
                    }
                }
                return throwError(error);
            }));
    }

}
