import * as express from "express";
import { expect } from 'chai';
import 'mocha';
import { QueryParameterType, QueryParameterFilter, HandleQueryParameterFilter, ParseFromToQueryParameter } from './query-param-tools';

describe('Hello function', () => {

    it('should return hello world', () => {
        expect(1).to.equal(1);
        let asdf: express.RequestHandler = ParseFromToQueryParameter();
        expect(asdf).to.be.not.null;
    });

});