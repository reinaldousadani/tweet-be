const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddTweetRelation1685338149151 {
    name = 'AddTweetRelation1685338149151'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`tweet\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tweet\` ADD CONSTRAINT \`FK_a9703cf826200a2d155c22eda96\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`tweet\` DROP FOREIGN KEY \`FK_a9703cf826200a2d155c22eda96\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`DROP TABLE \`tweet\``);
    }
}
