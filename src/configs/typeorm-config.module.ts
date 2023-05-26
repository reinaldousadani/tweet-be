import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class TypeOrmConfigModule {
  public typeOrmAsyncConfig: TypeOrmModuleOptions;

  public dataSource: DataSource;

  constructor(private readonly configService: ConfigService) {
    this.typeOrmAsyncConfig = {
      type: "mysql",
      host: this.configService.get("DB_HOST"),
      port: parseInt(this.configService.get("DB_PORT")),
      username: this.configService.get("DB_USERNAME"),
      password: this.configService.get("DB_PASSWORD"),
      database: this.configService.get("DB_NAME"),
      entities: [process.cwd() + "/dist/**/*.entity.{js,ts}"],
      synchronize: false,
    };

    this.dataSource = new DataSource({
      type: this.typeOrmAsyncConfig.type || "mysql",
      host: this.typeOrmAsyncConfig.host,
      port: this.typeOrmAsyncConfig.port,
      username: this.typeOrmAsyncConfig.username,
      password: this.typeOrmAsyncConfig.password,
      database: this.typeOrmAsyncConfig.database,
      entities: [process.cwd() + "/dist/**/*.entity.{js,ts}"],
      migrations: [process.cwd() + "/src/database/migrations/*.{js,ts}"],
      synchronize: false,
    });
  }
}

export default new TypeOrmConfigModule(new ConfigService()).dataSource;
