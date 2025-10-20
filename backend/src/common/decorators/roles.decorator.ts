import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../database/enums/role.enum';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
