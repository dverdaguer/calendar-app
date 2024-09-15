export type Event = {
    id: number,
    deleted: string[],
    date: string,
    endDate: string,
    repeatable: number[],
    event: string,
    note: string,
    endTime: string,
    startTime: string
};

export type EventList = {
    events: Event[]
};