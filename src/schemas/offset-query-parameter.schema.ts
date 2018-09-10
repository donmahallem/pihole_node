import { Schema } from "jsonschema";


export const OffsetQueryParameterSchema: Schema = {
    "id": "/SimpleAddress",
    "type": "integer",
    "minimum": 0
}

export const TopQueryParameterSchema: Schema = {

    "type": "object",
    "properties": {
        "offset": {
            "type": "integer",
            "minimum": 0,
        },
        "limit": {
            "type": "integer",
            "minimum": 1,
            "maximum": 50,
        },
        "from": {
            "type": "integer",
            "minimum": 0
        },
        "to": {
            "type": "integer",
            "minimum": 0
        },
        "domain": {
            "type": "string",
            "description": "",
            "pattern": "/^([a-zA-Z0-9]*\.)*[a-zA-Z0-9]+$/"
        },
        "client": {
            "type": "string",
            "description": "The client to filter for",
            "maxLength": 64
        }
    }
};