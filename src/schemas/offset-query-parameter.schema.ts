import { Schema } from 'jsonschema';

export const createIntegerRangeSchema = (minimum: number, maximum: number): Schema => {
    return {
        type: 'integer',
        minimum: minimum,
        maximum: maximum
    }
}

export const TopQueryParameterSchema: Schema = {

    type: 'object',
    properties: {
        offset: {
            title: 'Offset',
            description: 'Offset for dataset list queries',
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
        limit: {
            title: 'Limit',
            description: 'The maximum number of entries to return',
            anyOf: [
                createIntegerRangeSchema(0, 50),
                {
                    type: 'string',
                    pattern: '^([0-9]|[1-4][0-9]|50)$'
                }
            ]
        },
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
        domain: {
            type: 'string',
            description: '',
            pattern: '/^([a-zA-Z0-9]*\.)*[a-zA-Z0-9]+$/'
        },
        client: {
            type: 'string',
            description: 'The client to filter for',
            maxLength: 64,
        }
    }
};
