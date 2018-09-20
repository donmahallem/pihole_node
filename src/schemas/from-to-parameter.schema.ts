import { Schema } from 'jsonschema';
export const FromToQueryParameterSchema: Schema = {

    type: 'object',
    properties: {
        from: {
            title: 'From',
            description: 'Timestamp mimum to query',
            anyOf: [
                {
                    type: 'integer',
                    minimum: 0,
                },
                {
                    type: 'string',
                    pattern: '^[0-9]+$'
                }
            ]
        },
        to: {
            title: 'To',
            description: 'Timestamp maximum to query',
            anyOf: [
                {
                    type: 'integer',
                    minimum: 0,
                },
                {
                    type: 'string',
                    pattern: '^[0-9]+$'
                }
            ]
        },
        client: {
            type: 'string',
            description: 'The client to filter for',
            maxLength: 64,
        }
    }
};
