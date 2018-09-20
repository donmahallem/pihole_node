import * as sqlite from 'sqlite3';
import { Observable, Observer } from 'rxjs';
import {
    mergeMap,
    merge,
    observeOn,
    subscribeOn
} from 'rxjs/operators';
import { DatabaseUtil } from './database-util';

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

export class PiholeDatabase {

    private database: sqlite.Database;
    private static mInstance: PiholeDatabase;
    private constructor() {
        this.database = sqlite.cached.Database('pihole-FTL.db');
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
        let innerQuery: string = '';
        let queryParams: any[] = [];
        if (client) {
            innerQuery += ' WHERE (client == ?)';
            queryParams.push(client);
        }
        queryParams.push(limit);
        queryParams.push(offset);
        const query: string = 'SELECT * FROM queries'
            + innerQuery + ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
        return DatabaseUtil.listQuery(this.database, query, queryParams);
    }

    public getTopClients(limit: number = 25, offset: number = 0) {
        const query: string = 'SELECT client, count(client) as num FROM queries'
            + ' GROUP by client order by count(client) desc limit ? OFFSET ?';
        const queryParams: any[] = [limit, offset];
        return DatabaseUtil.listQuery(this.database, query, queryParams);

    }
    public getTopDomains(limit: number = 25, offset: number = 0, client?: string): Observable<any> {
        let innerQuery: string = '';
        let queryParams: any[] = [];
        if (client) {
            innerQuery += ' WHERE (client == ?)';
            queryParams.push(client);
        }
        queryParams.push(limit);
        queryParams.push(offset);
        const query: string = 'SELECT domain,count(domain) as num FROM queries'
            + innerQuery + ' GROUP by domain order by count(domain) desc limit ? OFFSET ?';
        return DatabaseUtil.listQuery(this.database, query, queryParams);

    }

    public getTopAds(limit: number = 25, offset: number = 0, client?: string): Observable<any> {
        let innerQuery: string = '';
        let queryParams: any[] = [];
        if (client) {
            innerQuery += ' AND (client == ?)';
            queryParams.push(client);
        }
        queryParams.push(limit);
        queryParams.push(offset);
        const query: string = 'SELECT domain,count(domain) as num FROM queries WHERE ((STATUS == 1 OR STATUS == 4)'
            + innerQuery + ' GROUP by domain order by count(domain) desc limit ? OFFSET ?';
        return DatabaseUtil.listQuery(this.database, query, queryParams);
    }

    public getAdsHistory(from?: number, to?: number, client?: string): Observable<any> {
        let query: string = 'SELECT (timestamp / 60 * 60) AS key, COUNT(timestamp) as count FROM queries'
            + ' WHERE (STATUS == 1 OR STATUS == 4)';
        let queryParams: any[] = [];
        if (from !== undefined) {
            query += ' AND timestamp >= ?';
            queryParams.push(from);
        }
        if (to !== undefined) {
            query += ' AND timestamp <= ?';
            queryParams.push(to);
        }
        if (client !== undefined) {
            query += ' AND client == ?';
            queryParams.push(client);
        }
        query += ' GROUP BY key ORDER BY key ASC';
        return DatabaseUtil.listQuery(this.database, query, queryParams);
    }

    public getCombinedHistory(from?: number, to?: number, client?: string): Observable<any> {
        let innerQuery: string = 'SELECT (timestamp / 60 * 60) AS key, (STATUS == 1 OR STATUS == 4) as isAd FROM queries';
        let queryParams: any[] = [];
        if (from !== undefined) {
            innerQuery += ' AND timestamp >= ?';
            queryParams.push(from);
        }
        if (to !== undefined) {
            innerQuery += ' AND timestamp <= ?';
            queryParams.push(to);
        }
        if (client !== undefined) {
            innerQuery += ' AND client == ?';
            queryParams.push(client);
        }
        innerQuery += ' ORDER BY key ASC';
        let query: string = 'SELECT key, SUM(isAd) AS ads,COUNT(isAd) AS total  FROM ('
            + innerQuery + ') GROUP BY key ORDER BY key ASC';
        return DatabaseUtil.listQuery(this.database, query, queryParams);
    }
}