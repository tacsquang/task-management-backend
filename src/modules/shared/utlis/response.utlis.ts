export function successResponse<T>(
  data: T,
  message = 'Success',
  statusCode = 200,
) {
  return {
    statusCode,
    message,
    data,
  };
}
