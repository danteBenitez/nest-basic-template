import { ROLES } from '@/auth/consts';
import { Role } from '@/auth/entities/role.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(private entityManager: EntityManager) { }

  /**
   * Apply all seeding operations
   */
  async seed() {
    await this.seedRoles();
  }
  /**
   * Seeds any roles on the consts file on auth module.
   * This is useful to ensure that the roles are always present on the database.
   * It performs an upsert operation, so to avoid duplicates.
   */
  async seedRoles(): Promise<void> {
    const roleRepository = this.entityManager.getRepository(Role);
    console.log(roleRepository.metadata);
    const roles = Object.values(ROLES)
      .map(roleName => {
        return roleRepository.create({ name: roleName });
      })
      .map(role => {
        return roleRepository.upsert(role, {
          conflictPaths: {
            name: true
          }
        })
      });

    await Promise.all(roles);
  }
}
