import * as sqlite from "sqlite3";
import {
    Observer,
    Observable
} from "rxjs";
import {
    mergeMap
} from 'rxjs/operators';


export class DatabaseUtil {
    public static prepareStatement(db: sqlite.Database, statement: string, params?: any) {
        return Observable.create((pub: Observer<sqlite.Statement>) => {
            db.serialize(() => {
                const stat: sqlite.Statement = db.prepare(statement, params);
                pub.next(stat);
                pub.complete();
            });
        })
    }
    public static statementToList(stat: sqlite.Statement): Observable<any> {
        return Observable.create((pub: Observer<any>) => {
            stat.each((err: Error, row: any) => {
                if (pub.closed === true)
                    return;
                if (err) {
                    pub.error(err);
                } else {
                    pub.next(row);
                }
            }, (err: Error, count: number) => {
                if (pub.closed !== true) {
                    if (err) {
                        pub.error(err);
                    } else {
                        pub.complete();
                    }
                }
                stat.finalize();
            });
        });
    }
    public static runStatement(stat: sqlite.Statement): Observable<any> {
        return Observable.create((pub: Observer<any>) => {
            stat.run(function (err: Error) {
                if (pub.closed !== true) {
                    if (err) {
                        pub.error(err);
                    } else {
                        pub.complete();
                    }
                }
                stat.finalize();
            });
        });
    }

    public static listQuery(database: sqlite.Database, query: string, queryParams: any[]): Observable<any> {
        return DatabaseUtil.prepareStatement(database, query, queryParams)
            .pipe(mergeMap((stat: sqlite.Statement) => {
                return DatabaseUtil.statementToList(stat);
            }));
    }
}