export default class ServerError extends Error {
    constructor(code, message, clientMessage) {
        super(message);
        this.code = code;
        this.clientMessage = clientMessage;

        Error.captureStackTrace(this, this.constructor);
    }
}