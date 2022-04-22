export const EventResponse = {
    id: {
        type: 'number'
    },
    title: {type: 'string'},
    description: {type: 'string'},
    startDate: {type: 'string', format: 'date'},
    endDate: {type: 'string', format: 'date'},
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