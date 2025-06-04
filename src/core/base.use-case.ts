import AppException from '@/shared/utils/exception.util';

export abstract class BaseUseCase<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>;

  protected handleError(error: unknown, customMessage?: string): never {
    if (error instanceof AppException) {
      throw error;
    }

    throw new AppException(
      customMessage
        ? `${customMessage}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
        : `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof AppException ? error.status : 500,
    );
  }
}
