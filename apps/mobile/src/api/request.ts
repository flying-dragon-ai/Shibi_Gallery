const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestBody = string | Record<string, unknown> | ArrayBuffer | object;

export interface RequestOptions<TBody extends RequestBody = Record<string, unknown>> {
  method?: HttpMethod;
  body?: TBody;
  auth?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = uni.getStorageSync('token') as string | undefined;

  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${path}`,
      method: (options.method ?? 'GET') as UniApp.RequestOptions['method'],
      data: options.body,
      header: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      success: (response) => {
        const body = response.data as { data?: T; error?: { message: string } };
        if (response.statusCode >= 200 && response.statusCode < 300 && body.data !== undefined) {
          resolve(body.data);
          return;
        }
        if (response.statusCode === 401) {
          uni.removeStorageSync('token');
        }
        reject(new Error(body.error?.message ?? '请求失败'));
      },
      fail: (error) => reject(new Error(error.errMsg))
    });
  });
}
