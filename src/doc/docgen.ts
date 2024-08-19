import { INestApplication } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function docGen(app: INestApplication){
	const config = new DocumentBuilder()
    .setTitle('Attendance API')
    .setDescription('API documentation for attendance backend')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();

  
  const document = SwaggerModule.createDocument(app, config);
	const reflector = app.get(Reflector);
	
	const paths = document.paths;
	Object.keys(paths).forEach((pathKey) => {
    Object.keys(paths[pathKey]).forEach((methodKey) => {
      const handler = paths[pathKey][methodKey];

			const isIgnored = handler.summary === '_ignore';

      if (isIgnored) {
        delete paths[pathKey][methodKey];
      }
    });
  });
  SwaggerModule.setup('api-docs', app, document);
}