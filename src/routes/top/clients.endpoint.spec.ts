import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import {
    RouteError
} from "../route-error";
import * as express from "express";
import * as testObject from "./clients.endpoint";
import * as httpMocks from "node-mocks-http";
import { PiholeDatabase } from "../../helper/pihole-database";
import { of as rxjsOf } from "rxjs";
describe('routes/top/clients.endpoint', () => {
    describe('GET /top', function () {
        var nextSpy: sinon.SinonSpy;
        var databaseStubbedInstance: sinon.SinonStubbedInstance<PiholeDatabase>;
        before(function () {
            nextSpy = sinon.spy();
            databaseStubbedInstance = sinon.createStubInstance(PiholeDatabase);
            databaseStubbedInstance.getTopClients
                .callsFake(() => {
                    return rxjsOf({ "test": "object" });
                })
        });
        afterEach(() => {
            databaseStubbedInstance.getTopClients.reset();
        });
        after(() => {
        })

        it('should respond with correct data', (done) => {
            let req = httpMocks.createRequest({
                query: {
                    limit: 25
                }
            });
            let res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            res.on('end', function () {
                expect(nextSpy.callCount).to.equal(0);
                expect(res.statusCode).to.equal(200);
                let respBody: any = JSON.parse(res._getData());
                expect(res.header("Content-Type")).to.equal("application/json");
                expect(respBody).to.deep.equal({ data: [{ "test": "object" }] });
                done();
            });
            const testa = testObject.createTopClientsEndpoint(<any>databaseStubbedInstance);
            testa(req, res, nextSpy);
        });

    });
});