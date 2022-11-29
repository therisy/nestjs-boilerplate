import { IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { yellow } from '@nestjs/common/utils/cli-colors.util';
import { IConfig } from '@config';

class Config {
  @IsString()
  VERSION: string;

  @IsString()
  ORIGINS: string[];

  @IsString()
  APP_NAME: string[];

  @IsString()
  NEWRELIC_LICENSE_KEY: string;

  @IsString()
  CAPTCHA_SECRET: string;

  @IsString()
  SECRET: string;

  @IsString()
  MONGO_URL: string;
}

export function validate(config: IConfig) {
  const validatedConfig = plainToClass(Config, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    validationError: {
      target: false,
    },
  });

  if (errors.length > 0) {
    const parsedErrors = errors
      .map((error) => Object.values(error.constraints)[0])
      .join('\n');

    console.log(yellow(parsedErrors));
    process.exit(1);
  }
  return validatedConfig;
}
