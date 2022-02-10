import { isDate } from "util";
import { IApiError } from "../interfaces/Interfaces";
import { IsNullOrUndefined, IsString } from "./GeneralUtilities";

export interface IHttpResponse<T> extends Response {
    parsedBody?: T;
}

export class HTTP {
    public static BuildQueryString(object: any): string {
        // If the data is already a string, return it as-is
        if (IsNullOrUndefined(object) || IsString(object)) return '';

        // Create a query array to hold the key/value pairs
        var query = [];

        // Loop through the data object
        for (var key in object) {
            if (object.hasOwnProperty(key) && !IsNullOrUndefined(object[key])) {
                // Encode each key and value, concatenate them into a string, and push them to the array
                if (isDate(object[key])) {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent((object[key] as Date).toISOString()));
                } else {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(object[key]));
                }
            }
        }

        // Join each item in the array with a `&` and return the resulting string
        return `?${query.join('&')}`;
    }

    public static async Raw<T>(request: RequestInfo): Promise<IHttpResponse<T>> {
        return new Promise((resolve, reject) => {
            let response: IHttpResponse<T>;
            fetch(request)
                .then(async res => {
                    response = res;
                    if (!response.ok) {
                        reject(response);
                    }
                    if (response.status !== 204) {
                        const text = await res.text();
                        try {
                            return JSON.parse(text);
                        } catch {
                            return text;
                        }
                    } else {
                        return {} as T;
                    }
                })
                .then(body => {
                    if (response.ok) {
                        response.parsedBody = body;
                        resolve(response);
                    } else {
                        reject(body as IApiError || response);
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    public static async Get<T>(path: string, oidcToken: string = '', args: RequestInit = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }): Promise<IHttpResponse<T>> {
        if (oidcToken !== '') {
            args.headers = {
                ...args.headers,
                'Authorization': `Bearer ${oidcToken}`
            }
        }
        return HTTP.Raw<T>(new Request(path, args));
    }

    public static async GetData<T>(path: string, oidcToken: string = '', args: RequestInit = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }): Promise<T | undefined> {
        if (oidcToken !== '') {
            args.headers = {
                ...args.headers,
                'Authorization': `Bearer ${oidcToken}`
            }
        }
        return (await HTTP.Raw<T>(new Request(path, args))).parsedBody;
    }

    public static async Post<T>(path: string, body: any, oidcToken: string = '', args: RequestInit = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(body)
    }): Promise<IHttpResponse<T>> {
        if (oidcToken !== '') {
            args.headers = {
                ...args.headers,
                'Authorization': `Bearer ${oidcToken}`
            }
        }
        return HTTP.Raw<T>(new Request(path, args));
    }

    public static async PostData<T>(path: string, body: any, oidcToken: string = '', args: RequestInit = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(body)
    }): Promise<T | undefined> {
        if (oidcToken !== '') {
            args.headers = {
                ...args.headers,
                'Authorization': `Bearer ${oidcToken}`
            }
        }
        return (await HTTP.Raw<T>(new Request(path, args))).parsedBody;
    }

    public static async Put<T>(path: string, body: any, oidcToken: string = '', args: RequestInit = {
        method: 'put',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(body)
    }): Promise<IHttpResponse<T>> {
        if (oidcToken !== '') {
            args.headers = {
                ...args.headers,
                'Authorization': `Bearer ${oidcToken}`
            }
        }
        return HTTP.Raw<T>(new Request(path, args));
    }

    public static async PutData<T>(path: string, body: any, oidcToken: string = '', args: RequestInit = {
        method: 'put',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(body)
    }): Promise<T | undefined> {
        if (oidcToken !== '') {
            args.headers = {
                ...args.headers,
                'Authorization': `Bearer ${oidcToken}`
            }
        }
        return (await HTTP.Raw<T>(new Request(path, args))).parsedBody;
    }

    public static async Delete<T>(path: string, body: any, oidcToken: string = '', args: RequestInit = {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(body)
    }): Promise<IHttpResponse<T>> {
        if (oidcToken !== '') {
            args.headers = {
                ...args.headers,
                'Authorization': `Bearer ${oidcToken}`
            }
        }
        return HTTP.Raw<T>(new Request(path, args));
    }

    public static async DeleteData<T>(path: string, body: any, oidcToken: string = '', args: RequestInit = {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(body)
    }): Promise<T | undefined> {
        if (oidcToken !== '') {
            args.headers = {
                ...args.headers,
                'Authorization': `Bearer ${oidcToken}`
            }
        }
        return (await HTTP.Raw<T>(new Request(path, args))).parsedBody;
    }
}