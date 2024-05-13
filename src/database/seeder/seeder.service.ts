import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class SeederService {
  private logger = new Logger();

  constructor(private entityManager: EntityManager) {}

  /**
   * Apply all seeding operations
   */
  async seed() {
    /** */
  }
}
