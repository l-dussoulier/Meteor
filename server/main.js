import { Meteor } from 'meteor/meteor';
import { localDatas} from "./local-datas";

Meteor.startup(() => {
  // code to run on server at startup
    console.log("coucou");
});

WebApp.connectHandlers.use('/ws', (req, res, next) => {
    res.writeHead(200);
    res.end('Enchanté je suis le serveur');
});


WebApp.connectHandlers.use('/movies', (req, res, next) => {
    res.writeHead(200);
    res.end(
        JSON.stringify(localDatas)
    );
});

WebApp.connectHandlers.use('/api/movies', (req, res, next) => {
    res.writeHead(200);

        JSON.stringify(HTTP.call("GET","https://api.themoviedb.org/3/discover/movie?api_key=1793c4843a64fbd6fdba88ce08e45c5f&language=fr-FR",{},function (err,response){
            if (err){
                console.log(err);
            }else{
                res.end(
                    JSON.stringify(response.data)
                );
            }
        }));
});
