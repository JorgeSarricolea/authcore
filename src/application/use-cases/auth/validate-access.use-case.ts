import { BaseUseCase } from "@/core/base.use-case";
import { IUserRepository } from "@/domain/repositories/user.repository";
import AppException from "@/shared/utils/exception.util";

export interface ValidateAccessInput {
  userId: string;
}

export interface ValidateAccessResult {
  isValid: boolean;
}

export class ValidateAccessUseCase extends BaseUseCase<
  ValidateAccessInput,
  ValidateAccessResult
> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(input: ValidateAccessInput): Promise<ValidateAccessResult> {
    try {
      const { userId } = input;

      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new AppException("User not found", 401);
      }

      if (!user.email_verified) {
        throw new AppException("Email not verified", 403);
      }

      return {
        isValid: true,
      };
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error validating access: ${(error as Error).message}`,
        500
      );
    }
  }
}
