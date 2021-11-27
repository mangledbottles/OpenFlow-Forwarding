export interface Client {
    address: string;
    port: number
}

export interface Router extends Client {
    in?: Router | Client;
    out?: Router | Client;
    routerId: String;
}