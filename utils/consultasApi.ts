/* eslint-disable @typescript-eslint/no-explicit-any */
export const CosultaApibeta = async (
  method: string,
  url: string,
  headers: Record<string, string> = {},
  body?: any
): Promise<{
  alert: string;
  data?: any;
  message?: string;
}> => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-Proto": "https",
        ...headers,
      },
      credentials: "include",
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const { data, message } = await response.json();

    if (response.status == 400) {
      return {
        alert: "warning",
        data: data,
        message: message,
      };
    }

    if (!response.ok) {
      return {
        alert: "error",
        data: data,
        message: message,
      };
    }

    return {
      alert: "succes",
      data: data,
      message: message,
    };
  } catch (error: any) {
    return {
      alert: "error",
      message: error.message,
    };
  }
};
