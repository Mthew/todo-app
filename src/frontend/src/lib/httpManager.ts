import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

class HttpManager {
  private static instance: HttpManager;
  private axiosInstance: AxiosInstance;
  private baseURL: string;
  private timeout: number;

  private constructor() {
    // Default configuration
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    this.timeout = 10000; // 10 seconds

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Get the singleton instance of HttpManager
   */
  public static getInstance(): HttpManager {
    if (!HttpManager.instance) {
      HttpManager.instance = new HttpManager();
    }
    return HttpManager.instance;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Log requests in development
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error: AxiosError) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log responses in development
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ ${response.status} ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`
          );
        }
        return response;
      },
      (error: AxiosError) => {
        this.handleResponseError(error);
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Handle response errors globally
   */
  private handleResponseError(error: AxiosError): void {
    const status = error.response?.status;

    switch (status) {
      case 401:
        // Unauthorized - token might be expired
        console.warn("Unauthorized access - redirecting to login");
        this.removeAuthToken();
        // You can dispatch a logout action or redirect to login here
        // Example: window.location.href = '/login';
        break;
      case 403:
        console.warn("Forbidden - insufficient permissions");
        break;
      case 404:
        console.warn("Resource not found");
        break;
      case 500:
        console.error("Internal server error");
        break;
      default:
        console.error("API Error:", error.message);
    }
  }

  /**
   * Format error for consistent error handling
   */
  private formatError(error: AxiosError): ApiError {
    const responseData = error.response?.data as Record<string, unknown>;
    return {
      message:
        (responseData?.message as string) ||
        error.message ||
        "An error occurred",
      status: error.response?.status || 0,
      data: error.response?.data,
    };
  }

  /**
   * Set authentication token in headers
   */
  public setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  /**
   * Remove authentication token from headers
   */
  public removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }

  /**
   * Set custom header
   */
  public setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  public removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  /**
   * Update base URL
   */
  public setBaseURL(url: string): void {
    this.baseURL = url;
    this.axiosInstance.defaults.baseURL = url;
  }

  /**
   * Update timeout
   */
  public setTimeout(timeout: number): void {
    this.timeout = timeout;
    this.axiosInstance.defaults.timeout = timeout;
  }

  /**
   * GET request
   */
  public async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST request
   */
  public async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT request
   */
  public async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * PATCH request
   */
  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE request
   */
  public async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * HEAD request
   */
  public async head(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await this.axiosInstance.head(url, config);
      return {
        data: response.headers,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * OPTIONS request
   */
  public async options(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await this.axiosInstance.options(url, config);
      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel all pending requests
   */
  public cancelAllRequests(): void {
    // Note: This would require implementing request cancellation tokens
    // For now, we'll log the action
    console.log("Cancelling all pending requests");
  }

  /**
   * Get the raw axios instance for advanced usage
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Create a new request with specific config
   */
  public async request<T = unknown>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }
}

// Export the singleton instance
export const httpManager = HttpManager.getInstance();

// Export the class for type usage
export { HttpManager };
