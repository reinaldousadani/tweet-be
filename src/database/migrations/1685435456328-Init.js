const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Init1685435456328 {
    name = 'Init1685435456328'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`tweet\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tweet\` ADD CONSTRAINT \`FK_a9703cf826200a2d155c22eda96\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`tweet\` DROP FOREIGN KEY \`FK_a9703cf826200a2d155c22eda96\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`tweet\``);
    }
}
