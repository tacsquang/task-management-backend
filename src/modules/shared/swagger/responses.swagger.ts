import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const BadRequestResponse = () =>
  ApiBadRequestResponse({
    description: 'Bad Request - Dữ liệu không hợp lệ hoặc thiếu',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Bad Request',
          error: 'Bad Request',
        },
      },
    },
  });

export const UnauthorizedResponse = () =>
  ApiUnauthorizedResponse({
    description: 'Unauthorized - Chưa đăng nhập hoặc token sai',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    },
  });

export const ForbiddenResponse = () =>
  ApiForbiddenResponse({
    description: 'Forbidden - Không có quyền truy cập tài nguyên này',
    content: {
      'application/json': {
        example: {
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        },
      },
    },
  });

export const NotFoundResponse = () =>
  ApiNotFoundResponse({
    description: 'Not Found - Không tìm thấy tài nguyên',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Resource not found',
          error: 'Not Found',
        },
      },
    },
  });

export const ConflictResponse = () =>
  ApiConflictResponse({
    description: 'Conflict - Dữ liệu đã tồn tại hoặc xung đột',
    content: {
      'application/json': {
        example: {
          statusCode: 409,
          message: 'Conflict - Resource already exists',
          error: 'Conflict',
        },
      },
    },
  });

export const InternalServerErrorResponse = () =>
  ApiInternalServerErrorResponse({
    description: 'Internal Server Error - Lỗi phía server',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
        },
      },
    },
  });
