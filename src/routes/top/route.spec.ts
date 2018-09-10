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
import * as supertest from "supertest";
import * as nodemocks from "node-mocks-http";
import * as topAdsEndpoint from "./ads.endpoint";
import * as asdf from "./../../middleware/query-parameter-validator.middleware";
describe('routes/top/route', () => {
    describe('GET /top', function () {
        var app, request, route, asdfStub, asdfStub2;

        beforeEach(function () {
            // A stub we can use to control conditionals

            asdfStub = sinon.stub(asdf, "queryParameterValidator")
                .returns((req, res, next) => {
                    next();
                });
            asdfStub2 = sinon.stub(topAdsEndpoint, "topAds")
                .callsFake((req, res, next) => {
                    res.json({
                        status: 'not ok',
                        data: null
                    });
                });
            // Create an express application object
            app = express();

            app.use(require("./route"));
            request = supertest(app);
        });

        it('should respond with a 404 and a null', function (done) {
            request
                .get('/ads')
                .expect('Content-Type', /json/)
                .expect(404, function (err, res) {
                    expect(res.body).to.deep.equal({
                        status: 'not ok',
                        data: null
                    });
                    done();
                });
        });

    });
});