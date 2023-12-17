export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    INTERNAL_SERVER = 500,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    UN_AUTHORIZED = 401,
    FORBIDDEN = 403,
    SERVER_BUSY = 503,
    NOT_IMPLEMENTED = 501,
}


export enum HttpErrorMessage {
    INTERNAL_SERVER = 'An Internal Server Error Occurred. Please Try Again Later.',
    NOT_FOUND = 'Requested Resource Not Found.',
    UN_AUTHORIZED = 'You Are Not Authorized To Access This Route.',
    FORBIDDEN = 'You Are Not Allowed To Access This Route.',
    BAD_REQUEST = 'Error In The Request Sent.',
    INVALID_CREDENTIALS = 'Wrong Email Or Password.',
    SERVER_BUSY = 'Server Is Busy, Please Try Again Later.',
    INVALID_REFRESH_TOKEN = "Invalid Refresh Token.",
    INVALID_EMAIL = "Invalid Email.",
    USER_NOT_ACTIVE = "User Not Active.",
    USER_NOT_VERIFIED = "User Not Verified.",
    VERIFICATION_CODE = "Wrong Verification Code.",
    INVALID_USER = "INVALID_USER",
    INVALID_SESSION = "INVALID_SESSION"
}
