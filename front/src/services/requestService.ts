import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import type { IError } from '@/models/IError.ts'
import { useAuth } from '@/stores/auth.ts'

export class Result<T> {
  error?: IError
  result?: T

  constructor(values: { error?: IError; result?: T }) {
    this.error = values.error
    this.result = values.result
  }
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuth()
  if (authStore.getToken()) {
    config.headers['Authorization'] = `Bearer ${authStore.getToken()}`
  }
  return config
})

const service = {
  get: async function getRequest<T>(url: string, config?: AxiosRequestConfig) {
    return await axiosInstance
      .get<T>(url, config)
      .then((r) => new Result<T>({ result: r.data }))
      .catch((e) => new Result<T>({ error: e }))
  },

  post: async function postRequest<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return await axiosInstance
      .post<T>(url, data, config)
      .then((r) => new Result<T>({ result: r.data }))
      .catch((e) => new Result<T>({ error: e }))
  },

  delete: async function deleteRequest<T>(url: string, config?: AxiosRequestConfig) {
    return await axiosInstance
      .delete<T>(url, config)
      .then((r) => new Result<T>({ result: r.data }))
      .catch((e) => new Result<T>({ error: e }))
  },

  put: async function putRequest<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return await axiosInstance
      .put<T>(url, data, config)
      .then((r) => new Result<T>({ result: r.data }))
      .catch((e) => new Result<T>({ error: e }))
  },

  patch: async function patchRequest<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return await axiosInstance
      .patch<T>(url, data, config)
      .then((r) => new Result<T>({ result: r.data }))
      .catch((e) => new Result<T>({ error: e }))
  },
}

export default service
