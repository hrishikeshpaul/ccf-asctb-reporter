export interface Response {
  data: any;
  msg: string;
  status: number;
}

export interface Error {
  hasError?: boolean;
  msg?: string;
  status?: number;
}

export enum SnackbarType {
  success = 'success',
  error = 'error',
  warning = 'warning'
}

export interface ExportVega {
  option: string;
  spec?: any;
}
