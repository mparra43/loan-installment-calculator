import './dotenv.config';
import { DataSource, DataSourceOptions } from 'typeorm';

const TypeormConfig = {
   type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/infrastructure/database/migrations/*.js'],
    logging: true,
    logger: 'advanced-console',
}

export default TypeormConfig;
export const dataSource = new DataSource(TypeormConfig as DataSourceOptions);