import { generateRoutes, generateSpec, ExtendedRoutesConfig, ExtendedSpecConfig } from '@tsoa/cli';
import * as dotenv from 'dotenv';
import * as packageJson from '../package.json';

dotenv.config();

async function generateSpecAndRoutes() {
  const port = process.env.PORT || 3000;
  const basePath = 'api';

  const specOptions: ExtendedSpecConfig = {
    entryFile: 'src/index.ts',
    controllerPathGlobs: ['src/domains/**/*Controller.ts'],
    outputDirectory: 'api/',
    noImplicitAdditionalProperties: 'throw-on-extras',
    specVersion: 3,
    specFileBaseName: 'openapi',
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'x-access-token',
        in: 'header',
      },
    },
    yaml: true,
    specMerging: 'recursive',
    spec: {
      info: {
        title: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        contact: {
          email: 'alvarotrancon@gmail.com',
        },
        termsOfService: 'http://swagger.io/terms/',
        license: {
          name: 'Apache',
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
      },
      servers: [
        {
          url: `http://localhost:${port}/${basePath}`,
        },
      ]
    },
  };
  await generateSpec(specOptions);

  const routeOptions: ExtendedRoutesConfig = {
    entryFile: 'src/index.ts',
    controllerPathGlobs: ['src/domains/**/*Controller.ts'],
    noImplicitAdditionalProperties: 'throw-on-extras',
    routesDir: 'src/common',
    authenticationModule: 'src/middleware/Authentication.ts',
    basePath,
    routesFileName: 'Routes.ts'
  };
  await generateRoutes(routeOptions);
}

generateSpecAndRoutes();
