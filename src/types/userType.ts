export interface UpdateUserType {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface TokenPayloadType {
    userId: string;
    email: string;
    role: string;
}