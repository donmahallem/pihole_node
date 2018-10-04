import { Schema } from 'jsonschema';

export const ClientSchema: Schema = {
    id: "/ClientSchema",
    title: 'Client',
    description: 'Offset for dataset list queries',
    type: 'string',
    pattern: '^[0-9]+$'
};