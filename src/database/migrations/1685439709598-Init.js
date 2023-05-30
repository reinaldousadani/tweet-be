const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Init1685439709598 {
    name = 'Init1685439709598'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`tweet\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`follow_map\` (\`id\` varchar(36) NOT NULL, \`user\` varchar(36) NULL, \`following\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tweet\` ADD CONSTRAINT \`FK_a9703cf826200a2d155c22eda96\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`follow_map\` ADD CONSTRAINT \`FK_06ea558395b0a9195fddff7d0d4\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`follow_map\` ADD CONSTRAINT \`FK_bc4ccd278d104f60a5dd8573f40\` FOREIGN KEY (\`following\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`follow_map\` DROP FOREIGN KEY \`FK_bc4ccd278d104f60a5dd8573f40\``);
        await queryRunner.query(`ALTER TABLE \`follow_map\` DROP FOREIGN KEY \`FK_06ea558395b0a9195fddff7d0d4\``);
        await queryRunner.query(`ALTER TABLE \`tweet\` DROP FOREIGN KEY \`FK_a9703cf826200a2d155c22eda96\``);
        await queryRunner.query(`DROP TABLE \`follow_map\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`tweet\``);
    }
}
