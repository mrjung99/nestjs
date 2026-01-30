import { SetMetadata } from '@nestjs/common';

export const AllowBypassGuard = () => {
  return SetMetadata('isPublic', true);
};
