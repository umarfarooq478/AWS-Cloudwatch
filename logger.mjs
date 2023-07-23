import AWS from 'aws-sdk';
import { createLogger,format,transports} from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';


AWS.config.update({
    accessKeyId: 'Your access key',
    secretAccessKey:'your secret key',
    region:'eu-north-1'
})





const cloudWatchTransport = new CloudWatchTransport({
    logGroupName:'NodeJs',
    logStreamName:'test'
})


const logger = createLogger({
    level: 'info', // Set the default log level to 'info'
    format: format.combine(
      
        format.simple() // Use the built-in simple formatter for user-friendly logs
    ),
    transports: [cloudWatchTransport]
});

// Override the logger.error function to log stack trace for errors
logger.error = (message, err) => {
    if (err instanceof Error) {
        err.stack = err.stack || new Error().stack;
        logger.log({ level: 'error', message: `${message}\n${err.stack}` });
    } else {
        logger.log({ level: 'error', message: message });
    }
};
export default logger;