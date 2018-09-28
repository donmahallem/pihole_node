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
import * as testObject from "./summary.endpoint";
import * as httpMocks from "node-mocks-http";
import { FTLUtil } from '../../helper/ftl-util';
import { of as rxjsOf } from "rxjs";
describe('routes/summary/summary.endpoint', () => {
    describe('createSummaryEndpoint', function () {
        var nextSpy: sinon.SinonSpy;
        var ftlUtilStub: sinon.SinonStub;
        const testObjectData: any = {
            test: 29,
            test2: 2399
        }
        before(function () {
            nextSpy = sinon.spy();
            ftlUtilStub = sinon.stub(FTLUtil, "getStats");
            ftlUtilStub.callsFake(() => {
                return rxjsOf(testObjectData);
            });
        });
        afterEach(() => {
            ftlUtilStub.resetHistory();
        });
        after(() => {
            ftlUtilStub.restore();
        })

        it('should respond from ftl correctly', (done) => {
            let req = httpMocks.createRequest({
                query: {
                    limit: 25,
                    offset: 10,
                    client: "testclient"
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
                expect(respBody).to.deep.equal({ data: testObjectData });
                expect(ftlUtilStub.callCount).to.equal(1);
                done();
            });
            const testa = testObject.createSummaryEndpoint();
            testa(req, res, nextSpy);
        });

    });
});