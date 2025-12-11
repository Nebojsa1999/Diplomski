export class HttpError extends Error {
    code!: number;
    type?: string;
    response: any;

    constructor() {
        super();
    }
}
