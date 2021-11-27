export interface Router {
    routerIn?: String; // eg E1
    routerOut?: String; // eg R2
    routerId?: String; // eg R1
    address?: String; // eg 127.0.0.1
    port?: number; // eg 69902
    forwardAddress?: string; // eg 127.0.0.1
    forwardPort?: number; // eg 61984
}