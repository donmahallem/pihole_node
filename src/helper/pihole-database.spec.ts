import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as testObject from './pihole-database';
import {
    RouteError
} from "../routes/route-error";
import * as sqlite from "sqlite3";
import { DatabaseUtil } from "./database-util";
import { of } from 'rxjs';
describe('src/helper/pihole-database', () => {

    describe("PiholeDatabase", () => {

        var mockNext: sinon.SinonSpy;
        var sqliteCacheStub: sinon.SinonStub;
        var sqliteDbStub: sinon.SinonStubbedInstance<sqlite.Database>;
        before(() => {
            sqliteCacheStub = sinon.stub(sqlite.cached, "Database");
            sqliteDbStub = sinon.createStubInstance(sqlite.Database);
            sqliteCacheStub.returns(sqliteDbStub);
            mockNext = sinon.spy();
        });

        afterEach(() => {
            //mockRequest.verify();
            //mockResponse.verify();
            sqliteCacheStub.resetHistory();
            mockNext.resetHistory();
        });

        after(() => {
            sqliteCacheStub.restore();
        });
        describe("getQueries", () => {
            let databaseUtilStub: sinon.SinonStub;
            beforeEach(() => {
                databaseUtilStub = sinon.stub(DatabaseUtil, "listQuery");
                databaseUtilStub.returns(of(1, 2, 3, 8, 9));
            });
            afterEach(() => {
                databaseUtilStub.restore();
            });
            it('should pass with provided arguments', (done) => {
                const query: string = 'SELECT * FROM queries ORDER BY timestamp DESC LIMIT ? OFFSET ?';
                const limit: number = 200;
                const offset: number = 20;
                const queryParams: any[] = [limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getQueries(limit, offset)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should pass with default arguments', (done) => {
                const query: string = 'SELECT * FROM queries ORDER BY timestamp DESC LIMIT ? OFFSET ?';
                const limit: number = 25;
                const offset: number = 0;
                const queryParams: any[] = [limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getQueries()
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use client', (done) => {
                const query: string = 'SELECT * FROM queries WHERE (client == ?) ORDER BY timestamp DESC LIMIT ? OFFSET ?';
                const limit: number = 250;
                const offset: number = 234;
                const client: string = "anyclient";
                const queryParams: any[] = [client, limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getQueries(limit, offset, client)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
        });
        describe("getTopClients", () => {
            let databaseUtilStub: sinon.SinonStub;
            beforeEach(() => {
                databaseUtilStub = sinon.stub(DatabaseUtil, "listQuery");
                databaseUtilStub.returns(of(1, 2, 3, 8, 9));
            });
            afterEach(() => {
                databaseUtilStub.restore();
            });
            it('should pass with provided arguments', (done) => {
                const query: string = 'SELECT client, count(client) as num FROM queries'
                    + ' GROUP by client order by count(client) desc limit ? OFFSET ?';
                const limit: number = 200;
                const offset: number = 20;
                const queryParams: any[] = [limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getTopClients(limit, offset)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should pass with default arguments', (done) => {
                const query: string = 'SELECT client, count(client) as num FROM queries'
                    + ' GROUP by client order by count(client) desc limit ? OFFSET ?';
                const limit: number = 25;
                const offset: number = 0;
                const queryParams: any[] = [limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getTopClients()
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
        });
        describe("getTopDomains", () => {
            let databaseUtilStub: sinon.SinonStub;
            beforeEach(() => {
                databaseUtilStub = sinon.stub(DatabaseUtil, "listQuery");
                databaseUtilStub.returns(of(1, 2, 3, 8, 9));
            });
            afterEach(() => {
                databaseUtilStub.restore();
            });
            it('should use default values', (done) => {
                const query: string = 'SELECT domain,count(domain) as num FROM queries'
                    + ' GROUP by domain order by count(domain) desc limit ? OFFSET ?';
                const limit: number = 25;
                const offset: number = 0;
                const queryParams: any[] = [limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getTopDomains()
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use no client', (done) => {
                const query: string = 'SELECT domain,count(domain) as num FROM queries'
                    + ' GROUP by domain order by count(domain) desc limit ? OFFSET ?';
                const limit: number = 250;
                const offset: number = 234;
                const queryParams: any[] = [limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getTopDomains(limit, offset)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use client', (done) => {
                const query: string = 'SELECT domain,count(domain) as num FROM queries'
                    + ' WHERE (client == ?) GROUP by domain order by count(domain) desc limit ? OFFSET ?';
                const limit: number = 250;
                const offset: number = 234;
                const client: string = "anyclient";
                const queryParams: any[] = [client, limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getTopDomains(limit, offset, client)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
        });
        describe("getTopAds", () => {
            let databaseUtilStub: sinon.SinonStub;
            beforeEach(() => {
                databaseUtilStub = sinon.stub(DatabaseUtil, "listQuery");
                databaseUtilStub.returns(of(1, 2, 3, 8, 9));
            });
            afterEach(() => {
                databaseUtilStub.restore();
            });
            it('should use default values', (done) => {
                const query: string = 'SELECT domain,count(domain) as num FROM queries WHERE ((STATUS == 1 OR STATUS == 4)'
                    + ' GROUP by domain order by count(domain) desc limit ? OFFSET ?';
                const limit: number = 25;
                const offset: number = 0;
                const queryParams: any[] = [limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getTopAds()
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use no client', (done) => {
                const query: string = 'SELECT domain,count(domain) as num FROM queries WHERE ((STATUS == 1 OR STATUS == 4)'
                    + ' GROUP by domain order by count(domain) desc limit ? OFFSET ?';
                const limit: number = 250;
                const offset: number = 234;
                const queryParams: any[] = [limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getTopAds(limit, offset)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use client', (done) => {
                const query: string = 'SELECT domain,count(domain) as num FROM queries WHERE ((STATUS == 1 OR STATUS == 4)'
                    + ' AND (client == ?) GROUP by domain order by count(domain) desc limit ? OFFSET ?';
                const limit: number = 250;
                const offset: number = 234;
                const client: string = "anyclient";
                const queryParams: any[] = [client, limit, offset];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getTopAds(limit, offset, client)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
        });
        describe("getAdsHistory", () => {
            let databaseUtilStub: sinon.SinonStub;
            beforeEach(() => {
                databaseUtilStub = sinon.stub(DatabaseUtil, "listQuery");
                databaseUtilStub.returns(of(1, 2, 3, 8, 9));
            });
            afterEach(() => {
                databaseUtilStub.restore();
            });
            it('should use default values', (done) => {
                const query: string = 'SELECT (timestamp / 60 * 60) AS key, COUNT(timestamp) as count FROM queries WHERE (STATUS == 1 OR STATUS == 4) GROUP BY key ORDER BY key ASC';
                const queryParams: any[] = [];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getAdsHistory()
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use no client', (done) => {
                const query: string = 'SELECT (timestamp / 60 * 60) AS key, COUNT(timestamp) as count FROM queries WHERE (STATUS == 1 OR STATUS == 4) AND timestamp >= ? AND timestamp <= ? GROUP BY key ORDER BY key ASC';
                const from: number = 250;
                const toValue: number = 234;
                const queryParams: any[] = [from, toValue];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getAdsHistory(from, toValue)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use client', (done) => {
                const query: string = 'SELECT (timestamp / 60 * 60) AS key, COUNT(timestamp) as count FROM queries WHERE (STATUS == 1 OR STATUS == 4) AND timestamp >= ? AND timestamp <= ? AND client == ? GROUP BY key ORDER BY key ASC';
                const limit: number = 250;
                const offset: number = 234;
                const client: string = "anyclient";
                const queryParams: any[] = [limit, offset, client];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getAdsHistory(limit, offset, client)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use all parameter except to', (done) => {
                const query: string = 'SELECT (timestamp / 60 * 60) AS key, COUNT(timestamp) as count FROM queries WHERE (STATUS == 1 OR STATUS == 4) AND timestamp >= ? AND client == ? GROUP BY key ORDER BY key ASC';
                const limit: number = 250;
                const offset: number = undefined;
                const client: string = "anyclient";
                const queryParams: any[] = [limit, client];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getAdsHistory(limit, offset, client)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
        });
        describe("getCombinedHistory", () => {
            let databaseUtilStub: sinon.SinonStub;
            beforeEach(() => {
                databaseUtilStub = sinon.stub(DatabaseUtil, "listQuery");
                databaseUtilStub.returns(of(1, 2, 3, 8, 9));
            });
            afterEach(() => {
                databaseUtilStub.restore();
            });
            it('should use default values', (done) => {
                const query: string = 'SELECT key, SUM(isAd) AS ads,COUNT(isAd) AS total  FROM (SELECT (timestamp / 60 * 60) AS key, (STATUS == 1 OR STATUS == 4) as isAd FROM queries ORDER BY key ASC) GROUP BY key ORDER BY key ASC';
                const queryParams: any[] = [];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getCombinedHistory()
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use no client', (done) => {
                const query: string = 'SELECT key, SUM(isAd) AS ads,COUNT(isAd) AS total  FROM (SELECT (timestamp / 60 * 60) AS key, (STATUS == 1 OR STATUS == 4) as isAd FROM queries AND timestamp >= ? AND timestamp <= ? ORDER BY key ASC) GROUP BY key ORDER BY key ASC';
                const from: number = 250;
                const toValue: number = 234;
                const queryParams: any[] = [from, toValue];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getCombinedHistory(from, toValue)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use client', (done) => {
                const query: string = 'SELECT key, SUM(isAd) AS ads,COUNT(isAd) AS total  FROM (SELECT (timestamp / 60 * 60) AS key, (STATUS == 1 OR STATUS == 4) as isAd FROM queries AND timestamp >= ? AND timestamp <= ? AND client == ? ORDER BY key ASC) GROUP BY key ORDER BY key ASC';
                const limit: number = 250;
                const offset: number = 234;
                const client: string = "anyclient";
                const queryParams: any[] = [limit, offset, client];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getCombinedHistory(limit, offset, client)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
            it('should use all parameter except to', (done) => {
                const query: string = 'SELECT key, SUM(isAd) AS ads,COUNT(isAd) AS total  FROM (SELECT (timestamp / 60 * 60) AS key, (STATUS == 1 OR STATUS == 4) as isAd FROM queries AND timestamp >= ? AND client == ? ORDER BY key ASC) GROUP BY key ORDER BY key ASC';
                const limit: number = 250;
                const offset: number = undefined;
                const client: string = "anyclient";
                const queryParams: any[] = [limit, client];
                const db: testObject.PiholeDatabase = testObject.PiholeDatabase.getInstance();
                db.getCombinedHistory(limit, offset, client)
                    .subscribe(mockNext, (err: Error) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(5);
                        expect(mockNext.args).to.deep.equal([[1], [2], [3], [8], [9]]);
                        expect(databaseUtilStub.callCount).to.equal(1);
                        const args: any[] = databaseUtilStub.getCall(0).args;
                        expect(args[0]).to.equal(sqliteDbStub);
                        expect(args[1]).to.deep.equal(query);
                        expect(args[2]).to.deep.equal(queryParams);
                        //expect(databaseUtilStub.getCall(0).args).to.deep.equal([db, query, queryParams]);
                        done();
                    });
            });
        });
    });
});