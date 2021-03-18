import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { localDatas} from "./local-datas";

const films = new Mongo.Collection('films');

Meteor.startup(() => {
  // code to run on server at startup
    console.log("coucou");
});

WebApp.connectHandlers.use('/ws', (req, res, next) => {
    res.writeHead(200);
    res.end('Enchanté je suis le serveur');
});

WebApp.connectHandlers.use('/movies', (req, res, next) => {
    if (err) {
        console.log(err);
        res.writeHead(500);
    } else {
        res.end(JSON.stringify(localDatas));
        res.writeHead(200);
    }
});

WebApp.connectHandlers.use('/api/movies', (req, res, next) => {
    JSON.stringify(HTTP.call("GET","https://api.themoviedb.org/3/discover/movie?api_key=1793c4843a64fbd6fdba88ce08e45c5f&language=fr-FR",{},function (err,response){
        if (err) {
            console.log(err);
            res.writeHead(500);
        } else {
            res.end(JSON.stringify(response.data));
            res.writeHead(200);
        }
    }));
});

WebApp.connectHandlers.use('/api/updateVote', (req, res, next) => {
    var body = "";
    req.on('data', Meteor.bindEnvironment(function (data) {
        body += data;
    }));

    req.on('end', Meteor.bindEnvironment(function () {
        let data = JSON.parse(body);
        console.log(data);
        let id = data.id
        let like = data.like
        let dataVoteCount = data.vote_count;

        let newVoteCount;
        let film = films.find({id:id});

        if (film.count() == 0) {
            newVoteCount = like ? dataVoteCount + 1 : dataVoteCount - 1;
            films.insert({
                id: id,
                vote_count: newVoteCount
            });
        } else {
            let currentVoteCount = film.fetch()[0].vote_count;
            newVoteCount = like ? currentVoteCount + 1 : currentVoteCount - 1;
            films.update({id : id},  { $set: {vote_count: newVoteCount} })
        }

        res.writeHead(200);
        res.end(JSON.stringify(newVoteCount));
    }));
});

// Partie Acteurs

WebApp.connectHandlers.use('/api/acteurs', (req, res, next) => {
    JSON.stringify(HTTP.call("GET","https://api.themoviedb.org/3/person/popular?api_key=1793c4843a64fbd6fdba88ce08e45c5f&language=fr-FR&page=1",{},function (err,response){
        if (err) {
            console.log(err);
            res.writeHead(500);
        } else {
            res.end(JSON.stringify(response.data));
            res.writeHead(200);
        }
    }));
});
