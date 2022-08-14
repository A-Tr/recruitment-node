import { Logger } from 'tslog';

const isLocalDevelopment = process.env.NODE_ENV === 'development';

const logger = new Logger({
  type: isLocalDevelopment ? 'pretty' : 'json',
  setCallerAsLoggerName: true,
  displayFilePath: 'displayAll',
  colorizePrettyLogs: isLocalDevelopment,
});

export { logger };
