import './dotenv.config';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const TypeormConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    migrations: [path.join(__dirname, '../infrastructure/database/migrations/*.js')],
    entities: [path.join(__dirname, '../../**/*.entity.js')],
    logging: true,
    logger: 'advanced-console',
}

export default TypeormConfig;
export const dataSource = new DataSource(TypeormConfig as DataSourceOptions);