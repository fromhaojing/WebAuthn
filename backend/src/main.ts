import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as session from 'express-session';
// import {webcrypto} from 'crypto';

async function bootstrap() {
    // @ts-ignore
    // globalThis.crypto = webcrypto;
    const app = await NestFactory.create(AppModule);
    app.use(
        session({
            secret: 'your-secret-key',
            resave: false,
            saveUninitialized: true,
            cookie: {maxAge: 60000},
        }),
    );
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
