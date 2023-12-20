import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SurveyModule } from './routes/survey/survey.module';
import { QuestionModule } from './routes/question/question.module';
import { OptionModule } from './routes/option/option.module';
import { AnswerModule } from './routes/answer/answer.module';
import { UserModule } from './routes/user/user.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    SurveyModule,
    QuestionModule,
    OptionModule,
    AnswerModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // 전역적용
  }
}
