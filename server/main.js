import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { WebApp } from 'meteor/webapp';
import { apiKey } from './apiKey';

Meteor.startup(() => {
});

// -------------------------------------------- MONGO COLLECTIONS -------------------------------------------------- ///
const films = new Mongo.Collection('films');
const acteurs = new Mongo.Collection('acteurs');
// ------------------------------------------ END MONGO COLLECTIONS ------------------------------------------------ ///


// -------------------------------------------------  FILMS -------------------------------------------------------- ///

// Endpoint permettant de récupérer la liste des films de l'API
WebApp.connectHandlers.use('/api/movies', (req, res, next) => {
    HTTP.call('GET', `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr-FR`,
        {},
        function(error, response) {
        if (error) {
            console.log(error);
            res.writeHead(500);
        } else {
            let films = [];
            for (let i = 0; i < response.data.results.length; i++) {
                let film = {
                    public_data: response.data.results[i],
                    private_data: { vote_count : getVotesBdd(response.data.results[i].id.toString()) }
                }
                films.push(film);
            }

            res.end(JSON.stringify(films));
            res.writeHead(200);
        }
    });
});

// Permet de récupérer le nombre de vote d'un film stocké en base
function getVotesBdd(id) {
    let filmBdd = films.find({id: id});
    if (filmBdd.count() === 0) {
        return 0;
    } else {
        return filmBdd.fetch()[0].vote_count;
    }
}

// Endpoint permettant de voter pour un film
WebApp.connectHandlers.use('/api/voteFilm', (req, res, next) => {
    let body = '';
    req.on('data', Meteor.bindEnvironment(function (data) {
        body += data;
    }));

    req.on('end', Meteor.bindEnvironment(function () {
        let formData = JSON.parse(body);

        let filmBdd = films.find({id: formData.id});
        if (filmBdd.count() === 0) {
            films.insert({
                id: formData.id,
                vote_count: formData.like ? 1 : -1
            });
        } else {
            let currentVoteCount = filmBdd.fetch()[0].vote_count;
            let newVoteCount = formData.like ? currentVoteCount + 1 : currentVoteCount - 1;
            films.update(
                {id : formData.id},
                {$set: {vote_count: newVoteCount} }
                );
        }
        res.writeHead(200);
        res.end();
    }));
});
// ----------------------------------------------- END FILMS ------------------------------------------------------- ///



// ------------------------------------------------ ACTEURS -------------------------------------------------------- ///

// Endpoint permettant de récupérer la liste des acteurs de l'API
WebApp.connectHandlers.use('/api/acteurs', (req, res, next) => {
    HTTP.call('GET', `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=fr-FR&page=1`,
        {},
        function(error, response) {
        if (error) {
            console.log(error);
            res.writeHead(500);
        } else {
            let acteurs_data = [];

            for (let i = 0; i < response.data.results.length; i++) {
                const acteur = {
                    public_data: response.data.results[i]
                }
                acteurs_data.push(acteur);
            }
            res.end(JSON.stringify(acteurs_data));
            res.writeHead(200);
        }
    });
});


// --------------------------------------------- END ACTEURS ------------------------------------------------------- ///



// ------------------------------------------- DETAILS ACTEURS ----------------------------------------------------- ///

// Endpoint permettant de récupérer les détails d'un acteur de l'API
WebApp.connectHandlers.use('/api/acteur', (req, res, next) => {
    const idActeur = req.url.split("/")[1].replace('?idActeur=', '')
    JSON.stringify(HTTP.call('GET', `https://api.themoviedb.org/3/person/${idActeur}?api_key=${apiKey}&language=fr-FR`,
        {},
        function(error, response) {
        if (error) {
            console.log(error);
            res.writeHead(500);
        } else {
            let acteur_rating = 0;
            let ratingBdd = acteurs.find({id: response.data.id.toString()});
            if (ratingBdd.count() !== 0) {
                acteur_rating = parseInt(ratingBdd.fetch()[0].rating);
            }

            const acteur_data = {
                public_data: response.data,
                private_data: { rating: acteur_rating }
            };

            res.end(JSON.stringify(acteur_data));
            res.writeHead(200);
        }
    }));
});

// Endpoint permettant de stocké la note d'un acteur
WebApp.connectHandlers.use('/api/voteActeur', (req, res, next) => {
    let body = '';
    req.on('data', Meteor.bindEnvironment(function (data) {
        body += data;
    }));

    req.on('end', Meteor.bindEnvironment(function () {
        const formData = JSON.parse(body);
        const ratingBdd = acteurs.find({id: formData.id});

        if (ratingBdd.count() === 0) {
            acteurs.insert({
                id: formData.id,
                rating: formData.rating
            });
        } else {
            acteurs.update(
                {id : formData.id},
                {$set: {rating: formData.rating}}
            );
        }

        res.writeHead(200);
        res.end();
    }));
});
// ----------------------------------------- END DETAILS ACTEURS --------------------------------------------------- ///
