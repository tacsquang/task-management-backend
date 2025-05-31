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
    description: 'Bad Request - Invalid or missing data',
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
    description: 'Unauthorized - Not logged in or invalid token',
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
    description: 'Forbidden - No permission to access this resource',
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
    description: 'Not Found - Resource not found',
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
    description: 'Conflict - Data already exists or conflicts',
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
    description: 'Internal Server Error - Server error',
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
