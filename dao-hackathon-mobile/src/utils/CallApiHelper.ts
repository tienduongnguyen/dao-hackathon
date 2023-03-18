/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line import/no-extraneous-dependencies
import QueryString from 'qs';

interface ErrorResponse {
  message: string;
  code: number;
  status: number;
}

interface SuccessResponse {
  data: any;
  code: number;
  status: number;
}

// interface callApiHookProps {
//   API?: Function;
//   payload?: Parameters<Fn>;
//   formdata?: any;
//   form_url_encode?: object;
//   setLoading?: (isLoading: boolean) => void;
//   onSuccess?: (res: SuccessResponse) => void;
//   onError?: (err: ErrorResponse) => void;
//   onFinaly?: () => void;
// }

export async function callAPIHook<
  Fn extends (args: any, args2: any, args3: any) => any,
>({
  API,
  payload,
  headers,
  isShowMessage,
  setLoading,
  onSuccess,
  onError,
  onFinaly,
  formdata,
  form_url_encode,
}: {
  API: Fn;
  payload?: Parameters<Fn>[0];
  headers?: any;
  isShowMessage?: boolean;
  formdata?: any;
  form_url_encode?: object;
  setLoading?: (isLoading: boolean) => void;
  onSuccess?: (res: SuccessResponse) => void;
  onError?: (err: ErrorResponse) => void;
  onFinaly?: () => void;
}) {
  let data: any = null;
  if (formdata) {
    data = new FormData();
    try {
      Object.keys(formdata).forEach(key => {
        if (Array.isArray(formdata[key])) {
          formdata[key].forEach((e: any) => {
            data.append(key, e);
          });
        } else {
          data.append(key, formdata[key]);
        }
      });
    } catch (error) {}
  }
  if (form_url_encode) {
    data = QueryString.stringify(form_url_encode, {
      indices: false,
    });
  }
  if (payload) {
    data = payload;
  }
  try {
    if (setLoading) {
      setLoading(true);
    }
    const res = await API(data, headers, isShowMessage);
    if (onSuccess) {
      onSuccess(res);
    }
    if (setLoading) {
      setLoading(false);
    }
    return Promise.resolve(res);
  } catch (error: any) {
    if (setLoading) {
      setLoading(false);
    }
    if (onError) {
      onError(error);
    }
    return Promise.reject(error);
  } finally {
    if (onFinaly) {
      onFinaly();
    }
  }
}
