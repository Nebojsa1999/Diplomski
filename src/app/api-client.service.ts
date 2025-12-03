import { ApiClient } from "./api-client";
import { ApiResponse, MultiPart, RequestConfig, RequestHeaders, RequestParamType } from "./rest.model";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

export class ApiClientService extends ApiClient {

    private readonly baseUrl;

    constructor(private http: HttpClient) {
        super();
        this.baseUrl  = "http://localhost:8081";
    }

    post<TRequest, TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
        return this.http.post<TResponse>(`${this.baseUrl}${path}`, body, this.formatJsonOptions(config)).pipe(this.mapJsonResponse());
    }

    postWithFileResponse<TRequest>(path: string, body: TRequest, fileName: string, config?: RequestConfig): Observable<File> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestConfig: any = this.formatJsonOptions(config);
        requestConfig.responseType = 'arraybuffer';
        requestConfig.observe = 'body';
        return this.http.post(`${this.baseUrl}${path}`, body, requestConfig).pipe(map((response) => new File([new Blob([response])], fileName)));
    }

    put<TRequest, TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
        return this.http.put<TResponse>(`${this.baseUrl}${path}`, body, this.formatJsonOptions(config)).pipe(this.mapJsonResponse());
    }

    delete<TResponse>(path: string, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
        return this.http.delete<TResponse>(`${this.baseUrl}${path}`, this.formatJsonOptions(config)).pipe(this.mapJsonResponse());
    }

    get<TResponse>(path: string, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
        if (this.hasJsonResponse(config)) {
            return this.http.get<TResponse>(`${this.baseUrl}${path}`, this.formatJsonOptions(config)).pipe(this.mapJsonResponse());
        } else {
            const options = {
                headers: this.wrapHeaders(config?.headers),
                params: this.beautifyParams(config?.params),
                observe: 'body' as const,
                responseType: 'json' as const,
            };

            if (config?.headers?.responseType) {
                options.responseType = config?.headers?.responseType as any;
            }
            return this.http.get(`${this.baseUrl}${path}`, options).pipe(
                map((response) => {
                    const apiResponse: ApiResponse<TResponse> = {
                        data: response as TResponse,
                        headers: {},
                    };

                    return apiResponse;
                })
            );
        }
    }

    postMultipart<TRequest extends MultiPart[], TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
        const multiPartData = new FormData();

        body.forEach((part) => {
            if (typeof part.content === 'string') {
                multiPartData.append(part.name, new Blob([part.content], {type: 'application/json'}));
            } else {
                multiPartData.append(part.name, part.content, part.content.name);
            }
        });

        return this.http.post<TResponse>(`${this.baseUrl}${path}`, multiPartData, this.formatJsonOptions(config)).pipe(this.mapJsonResponse());
    }

    putMultipart<TRequest extends MultiPart[], TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
        const multiPartData = new FormData();

        body.forEach((part) => {
            if (typeof part.content === 'string') {
                multiPartData.append(part.name, new Blob([part.content], {type: 'application/json'}));
            } else {
                multiPartData.append(part.name, part.content, part.content.name);
            }
        });

        return this.http.put<TResponse>(`${this.baseUrl}${path}`, multiPartData, this.formatJsonOptions(config)).pipe(this.mapJsonResponse());
    }

    private hasJsonResponse(config?: RequestConfig): boolean {
        return !config?.headers?.accept || config?.headers?.accept === 'application/json';
    }

    private formatJsonOptions(config?: RequestConfig) {
        return {
            headers: this.wrapHeaders(config?.headers),
            params: this.beautifyParams(config?.params),
            observe: 'response' as const,
        };
    }

    private wrapHeaders(headers?: RequestHeaders): HttpHeaders {
        const headerRecord: Record<string, string> = {
            Accept: headers?.accept ?? 'application/json',
        };

        if (headers?.contentType) {
            headerRecord['Content-Type'] = headers.contentType;
        }

        if (!headers?.public) {
            headerRecord['Authorization'] = ''; // Must be present so the interceptor fills the value.
        }

        return new HttpHeaders(headerRecord);
    }

    private beautifyParams(params?: { [key in string]: RequestParamType; }): HttpParams | undefined {
        let httpParams = new HttpParams();

        if (!params) {
            return httpParams;
        }

        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    httpParams = httpParams.append(key, value);
                } else if (Array.isArray(value)) {
                    value.forEach((arrayValue) => httpParams = httpParams.append(key, arrayValue))
                } else {
                    throw Error(`Cannot convert to parameters: ${JSON.stringify(value)}`);
                }
            }
        });

        return httpParams;
    }

    mapJsonResponse<TResponse>() {
        return map((response: HttpResponse<TResponse>) => {
            const apiResponse: ApiResponse<TResponse> = {
                data: response.body,
                headers: {},
            };

            response.headers.keys().forEach((headerName) => {
                apiResponse.headers[headerName] = response.headers.get(headerName);
            });

            return apiResponse;
        });
    }
}
