import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateLoanCalculations1700000000001 implements MigrationInterface {
  name = 'CreateLoanCalculations1700000000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "loan_calculations" (
        "id" uuid PRIMARY KEY,
        "amount" double precision NOT NULL,
        "termMonths" integer NOT NULL,
        "interestRate" double precision NOT NULL,
        "interestType" varchar(32) NOT NULL,
        "monthlyPayment" double precision NOT NULL,
        "totalInterest" double precision NOT NULL,
        "totalPayment" double precision NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_loan_calculations_created_at"
      ON "loan_calculations" ("createdAt");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_loan_calculations_created_at";`)
    await queryRunner.query(`DROP TABLE IF EXISTS "loan_calculations";`)
  }
}