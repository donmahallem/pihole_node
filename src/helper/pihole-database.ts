import * as sqlite from 'sqlite3';
import { Observable, Observer } from "rxjs";
import {
    mergeMap,
    merge,
    observeOn,
    subscribeOn
} from "rxjs/operators";

export interface Query {
    //autoincrement ID for the table, only used by SQLite3, not by FTLDNS
    id: number;
    //Unix timestamp when this query arrived at FTLDNS (used as index)
    timestamp: number;
    //Type of this query (see Supported query types)
    type: number;
    //How was this query handled by FTLDNS? (see Supported status types)
    status: number;
    //Requested domain
    domain: string;
    //Requesting client (IP address)
    client: string;
    //Forward destination used for this query (only set if status == 2)
    forward?: string | undefined;
}

function prepareStatement(db: sqlite.Database, statement: string, params?: any) {
    return Observable.create((pub: Observer<sqlite.Statement>) => {
        db.serialize(() => {
            const stat: sqlite.Statement = db.prepare(statement, params);
            pub.next(stat);
            pub.complete();
        });
    });
}
function statementToList(stat: sqlite.Statement): Observable<any> {
    return Observable.create((pub: Observer<any>) => {
        stat.each((err: Error, row: any) => {
            if (err) {
            } else {
                pub.next(row);
            }
        }, (err: Error, count: number) => {
            if (err) {
                pub.error(err);
            } else {
                pub.complete();
            }
            stat.finalize();
        });
    });
}

export class PiholeDatabase {

    private database: sqlite.Database;
    private static mInstance: PiholeDatabase;
    private constructor() {
        this.database = sqlite.cached.Database("pihole-FTL.db");
    }

    public static getInstance(): PiholeDatabase {
        if (this.mInstance) {
            return this.mInstance;
        } else {
            this.mInstance = new PiholeDatabase();
            return this.mInstance;
        }
    }

    public getQueries(limit: number = 25, offset: number = 0, client?: string): Observable<Query> {
        let paramLimit: number = 25;
        let paramOffset: number = 0;
        if (limit && Number.isInteger(limit) && limit >= 0) {
            paramLimit = limit;
        }
        if (offset && Number.isInteger(offset) && offset >= 0) {
            paramOffset = offset;
        }
        if (client) {
            return prepareStatement(this.database, "SELECT * FROM queries WHERE client == ? ORDER BY timestamp DESC LIMIT ? OFFSET ?", [client, limit, offset])
                .pipe(mergeMap((stat: sqlite.Statement) => {
                    return statementToList(stat);
                }));
        } else {
            return prepareStatement(this.database, "SELECT * FROM queries ORDER BY timestamp DESC LIMIT ? OFFSET ?", [limit, offset])
                .pipe(mergeMap((stat: sqlite.Statement) => {
                    return statementToList(stat);
                }));
        }
    }

    public getTopClients(limit: number = 25, offset: number = 0) {
        return prepareStatement(this.database, "SELECT client, count(client) as num FROM queries GROUP by client order by count(client) desc limit ? OFFSET ?", [limit, offset])
            .pipe(mergeMap((stat: sqlite.Statement) => {
                return statementToList(stat);
            }));

    }
    public getTopDomains(limit: number = 25, offset: number = 0, client?: string): Observable<any> {
        if (client) {
            return prepareStatement(this.database, "SELECT domain,count(domain) as num FROM queries WHERE (client == ?) GROUP by domain order by count(domain) desc limit ? OFFSET ?", [client, limit, offset])
                .pipe(mergeMap((stat: sqlite.Statement) => {
                    return statementToList(stat);
                }));
        } else {
            return prepareStatement(this.database, "SELECT domain,count(domain) as num FROM queries GROUP by domain order by count(domain) desc limit ? OFFSET ?", [limit, offset])
                .pipe(mergeMap((stat: sqlite.Statement) => {
                    return statementToList(stat);
                }));
        }

    }

    public getTopAds(limit: number = 25, offset: number = 0, client?: string): Observable<any> {
        if (client) {
            return prepareStatement(this.database, "SELECT domain,count(domain) as num FROM queries WHERE ((STATUS == 1 OR STATUS == 4) AND client == ?) GROUP by domain order by count(domain) desc limit ? OFFSET ?", [client, limit, offset])
                .pipe(mergeMap((stat: sqlite.Statement) => {
                    return statementToList(stat);
                }));
        } else {
            return prepareStatement(this.database, "SELECT domain,count(domain) as num FROM queries WHERE (STATUS == 1 OR STATUS == 4) GROUP by domain order by count(domain) desc limit ? OFFSET ?", [limit, offset])
                .pipe(mergeMap((stat: sqlite.Statement) => {
                    return statementToList(stat);
                }));
        }
    }

    public getAdsHistory(): Observable<any> {
        let query: string = "SELECT (timestamp / 60 * 60) AS key, COUNT(timestamp) as count FROM queries WHERE (STATUS == 1 OR STATUS == 4) GROUP BY key ORDER BY key ASC";
        return prepareStatement(this.database, query)
            .pipe(mergeMap((stat: sqlite.Statement) => {
                return statementToList(stat);
            }));
    }

    public getCombinedHistory(): Observable<any> {
        let innerQuery: string = "SELECT (timestamp / 60 * 60) AS key, (STATUS == 1 OR STATUS == 4) as isAd FROM queries ORDER BY key ASC";
        let query: string = "SELECT key, SUM(isAd) AS ads,COUNT(isAd) AS total  FROM (" + innerQuery + ") GROUP BY key ORDER BY key ASC";
        return prepareStatement(this.database, query)
            .pipe(mergeMap((stat: sqlite.Statement) => {
                return statementToList(stat);
            }));
    }
}