'use strict';
require('dotenv').load();

const MailService = require('./service/mail-service');
const QueuingService = require('./queuing-service');


process.on('SIGTERM', (sig) => process.exit(0));

QueuingService.listen(MailService.processTask);
console.log('Mailer is running...');
