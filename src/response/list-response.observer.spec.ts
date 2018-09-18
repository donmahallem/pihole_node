import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as express from "express";
import * as testObject from "./list-response.observer";
import * as httpMocks from "node-mocks-http";
import {
    of as rxjsOf,
    throwError
} from "rxjs";
describe('response/list-response.observer', () => {
    describe('GET /top', function () {
        var nextSpy: sinon.SinonSpy;
        before(function () {
            nextSpy = sinon.spy();
        });
        afterEach(() => {
            nextSpy.resetHistory();
        });
        after(() => {
        })

        it('should create correct list response', (done) => {
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
                expect(respBody).to.deep.equal({ data: ["a", "b"] });
                done();
            });
            const testa = testObject.createListResponseObserver(req, res, nextSpy);
            rxjsOf("a", "b")
                .subscribe(testa);
        });

        it('should create correct list response', (done) => {
            let req = httpMocks.createRequest({
                query: {
                    limit: 25
                }
            });
            let res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            const testErr = new Error();
            const testa = testObject.createListResponseObserver(req, res, nextSpy);
            throwError(testErr)
                .subscribe(testa);
            expect(nextSpy.callCount).to.equal(1);
            expect(res._getData()).to.empty;
            done();
        });
        it('should create correct empty list response', (done) => {
            let req = httpMocks.createRequest({
                query: {
                    limit: 25
                }
            });
            let res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            res.on('end', function () {
                expect(nextSpy.callCount).to.equal(0, "next spy shouldnt be called");
                expect(res.statusCode).to.equal(200);
                let respBody: any = JSON.parse(res._getData());
                expect(res.header("Content-Type")).to.equal("application/json");
                expect(respBody).to.deep.equal({ data: [] });
                done();
            });
            const testa = testObject.createListResponseObserver(req, res, nextSpy);
            rxjsOf()
                .subscribe(testa);
        });
    });
});