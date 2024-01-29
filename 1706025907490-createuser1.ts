import { MigrationInterface, QueryRunner } from "typeorm";

export class Createuser11706025907490 implements MigrationInterface {
    name = 'Createuser11706025907490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
