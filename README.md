# Implement Logging in your application
Have you ever tried implementing and maintaining logs in your application. This allows you to continuosly monitor what's going on with your application. It also helps you in locating errors, crashes, and user stories. 
## Example
Consider you have built a real estate application users find their dream properties. One day, you made an update, and after that you start recieving bug reports from the users. `When we try to access details, the app crashes.` Without having logs implemented, you will never be able to easily locate the cause of problem. But if you have implemented logs, you can see:

```
    [INFO] User 'Ali_Ahmad' opened homepage at 03:42:34s
    [INFO] User 'Ali_Ahmad' searched 'Islamabad' at 03:43:01s
    [INFO] User 'Ali_Ahmad' clicked property 'ISB_01-A/C' at 03:43:32s
    [ERROR] UndefinedError: listing is not defined here `listing.openDetails`
```

You can simply go to that line of code and locate what the problem is. 
## How to implement logs
For implementation of logs, you can use any cloud service available out there. But, here we will demonstrate only `AWS Cloudwatch.`
## What is AWS Cloudwatch
Amazon CloudWatch collects and visualizes real-time logs, metrics, and event data in automated dashboards to streamline your infrastructure and application maintenance.
## How to implement logs in AWS Cloudwatch
To implement logs using AWS Cloudwatch, you need to follow these steps:
#### Create an IAM User in AWS Cloudwatch
First, we need an accessKey of IAM User. Create and IAM User in AWS and copy it's accessKeyID and secretKey. After that, go to IAM permissions management, and create new policy. Allow Full Control to AWS Cloudwatch. This will only allow this IAM User to access AWS Cloudwatch, and not any other service of AWS.

### Configure AWS SDK
Depending on your application type where you want to use logging, install aws sdk. Here I will be using NodeJS application.
```
npm install aws-sdk
```

Now import it, `import AWS from 'aws-sdk';`
### Additional Libraries
We also need some additional libraries for formatting of logs. I will be using Winston. It is a library that provides you ease of formatting your logs. Use these
```
npm install winston
npm install winston-aws-cloudwatch
```

Now import them into your code like:
```
import { createLogger,format,transports} from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';
```
Here are the details of imports:
- createLoggeer : creates an instance that you can use throughout the application for logging.
- format: used for formatting your logs.
- transports: used for transporting logs from winston to any service -  here cloudwatch.
- CloudWatchTransport : while transports in winston are for configuration on winston side, this library is for configuration on aws-side.

### Configure AWS
Configure aws by using your accessKeyID and SecretKey that you copied earlier of AWS IAM User.
```
AWS.config.update({
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey:'YOUR_SECRET_KEY',
    region:'eu-north-1'
})
```
Since this is just a tutorial, I will not be going into details of weather you should use access keys directly in your code or not. 
### Create LogStream and LogGroup
AWS Cloudwatch provides you methods of grouping your logs in log streams. 
There are two methods of creating log streams and log groups
- Programmatically
- Manually using AWS Cloudwatch Dashboard

We will be using the second method since it is easier. Go to cloudwatch dashboard, navigate to Log Groups. Create a new Log Group and name it NodeJS. Click on the group, and create a new Logstream and name it test.

### Configure Cloudwatch in your code
Now it's time to use that log group and stream in your code.
```
const cloudWatchTransport = new CloudWatchTransport({
    logGroupName:'NodeJs',
    logStreamName:'test'
})
```

### Create a logger instance
Now create a new logger instance. Here we are setting default level to info
```
const logger = createLogger({
    level: 'info', // Set the default log level to 'info'
    format: format.combine(
      
        format.simple() // Use the built-in simple formatter for user-friendly logs
    ),
    transports: [cloudWatchTransport]
});
```
There are four levels of logs: `logs, info, error and warn`. We have created info level. Now let's configure error level, to include full stack trace of error in the log.
```
// Override the logger.error function to log stack trace for errors
logger.error = (message, err) => {
    if (err instanceof Error) {
        err.stack = err.stack || new Error().stack;
        logger.log({ level: 'error', message: `${message}\n${err.stack}` });
    } else {
        logger.log({ level: 'error', message: message });
    }
};
```

### Using the logger
Now your logger is ready. You can use `logger.info('User x joined')` or use it in any error handler to logs the error like `logger.error('Message',error)`.

## Rollbar
Rollbar is another solution for logging. You can refer to that on this documentation: https://docs.rollbar.com/docs

One extra feature that rollbar provides you is of error handlers. It provides you built-in error handlers that automatically catches and logs error happening in your application.

### Feedback
I hope you liked this tutorial. If so, follow me here and on linkedin as well to stay updated with such tutorials.
https://www.linkedin.com/in/umarfarooq478/
