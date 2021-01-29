import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

WebApp.connectHandlers.use('/ws', (req, res, next) => {
    res.writeHead(200);
    res.end('Enchanté je suis le serveur');
});