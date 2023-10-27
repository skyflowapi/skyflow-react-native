/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import { ContentType, SKY_METADATA_HEADER } from '../../utils/constants';
import logs from '../../utils/logs';
import SkyflowError from '../../utils/skyflow-error';
import SKYFLOW_ERROR_CODE from '../../utils/skyflow-error-code';
import { getMetaObject } from '../../utils/helpers';
import { Platform } from 'react-native';
import sdkDetails from '../../../package.json';

export interface IClientRequest {
  body?: any;
  headers?: Record<string, string>;
  requestMethod:
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'PATCH';
  url: string;
}

class Client {
  constructor() {}

  request = (request: IClientRequest) => {
    return new Promise((resolve, reject) => {
      const httpRequest = new XMLHttpRequest();
      if (!httpRequest) {
        reject(new SkyflowError(SKYFLOW_ERROR_CODE.CONNECTION_ERROR, [], true));
        return;
      }

      httpRequest.open(request.requestMethod, request.url);

      if (request.headers) {
        const metaDataObject = getMetaObject(Platform, sdkDetails);
        request.headers[SKY_METADATA_HEADER] = JSON.stringify(metaDataObject);
        const { headers } = request;
        Object.keys(request.headers).forEach((key) => {
          if (
            !(
              key === 'content-type' &&
              headers[key] &&
              headers[key]?.includes(ContentType.FORMDATA)
            )
          ) {
            httpRequest.setRequestHeader(key, headers[key] as string);
          }
        });
      }

      if (
        request.headers?.['content-type']?.includes(
          ContentType.FORMURLENCODED
        ) ||
        request.headers?.['content-type']?.includes(ContentType.FORMDATA)
      ) {
        httpRequest.send(request.body);
      } else {
        httpRequest.send(JSON.stringify({ ...request.body }));
      }

      httpRequest.onload = () => {
        const responseHeaders = httpRequest.getAllResponseHeaders();
        const headersList = responseHeaders.trim().split(/[\r\n]+/);
        const headerMap: Record<string, string> = {};
        headersList.forEach((line) => {
          const parts = line.split(': ');
          const header = parts.shift()?.toLowerCase() || '';
          const value = parts.join(': ');
          headerMap[header] = value;
        });
        const contentType = headerMap['content-type'];
        const requestId = headerMap['x-request-id'];
        if (httpRequest.status < 200 || httpRequest.status >= 400) {
          if (contentType && contentType.includes('application/json')) {
            let description = JSON.parse(httpRequest.response);
            if (description?.error?.message) {
              description = requestId
                ? `${description?.error?.message} - requestId: ${requestId}`
                : description?.error?.message;
            }
            reject(
              new SkyflowError(
                {
                  code: httpRequest.status,
                  description,
                },
                [],
                true
              )
            );
          } else if (contentType && contentType.includes('text/plain')) {
            reject(
              new SkyflowError(
                {
                  code: httpRequest.status,
                  description: requestId
                    ? `${httpRequest.response} - requestId: ${requestId}`
                    : httpRequest.response,
                },
                [],
                true
              )
            );
          } else {
            reject(
              new SkyflowError(
                {
                  code: httpRequest.status,
                  description: requestId
                    ? `${logs.errorLogs.ERROR_OCCURED} - requestId: ${requestId}`
                    : logs.errorLogs.ERROR_OCCURED,
                },
                [],
                true
              )
            );
          }
        }
        if (contentType && contentType.includes('application/json')) {
          resolve(JSON.parse(httpRequest.response));
        }
        resolve(httpRequest.response);
      };

      httpRequest.onerror = () => {
        reject(new SkyflowError(SKYFLOW_ERROR_CODE.NETWORK_ERROR, [], true));
      };
    });
  };
}

export default Client;
