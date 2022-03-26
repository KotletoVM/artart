export const EventResponse = {
    id: {
        type: 'number'
    },
    title: {type: 'string'},
    description: {type: 'string'},
    date: {type: 'string'},
    place: {type: 'string'},
    pics: {
        type: 'array',
        items: {
            type: 'string'
        }
    },
    createdAt: {
        type: 'string',
        format: 'date-time'
    },
    updatedAt: {
        type: 'string',
        format: 'date-time'
    }
}