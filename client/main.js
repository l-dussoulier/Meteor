import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './views/layout/navigation.html'

import './views/films.html'
import './views/acteurs.html'
import './views/detailsActeurs.html'

// ---------------------------------------------- ROUTING ---------------------------------------------------------- ///

// On affiche la liste des films au démarrage de l'application
BlazeLayout.render('films');

// Event listener permettant d'afficher la liste des films
Template.navigation.events({
  'click .nav-films' : function(event) {
    BlazeLayout.render('films');

    event.currentTarget.parentElement.classList.add("active");
    document.getElementsByClassName('nav-acteurs')[0].parentElement.classList.remove('active');
  }
});

// Event listener permettant d'afficher la liste des acteurs
Template.navigation.events({
  'click .nav-acteurs' : function(event) {
    BlazeLayout.render('acteurs');

    event.currentTarget.parentElement.classList.add("active");
    document.getElementsByClassName('nav-films')[0].parentElement.classList.remove('active');
  }
});
// ---------------------------------------------- END ROUTING ------------------------------------------------------ ///


// -------------------------------------------------  FILMS -------------------------------------------------------- ///

// On récupère la liste des films à la création du template
Template.films.onCreated(function() {
  const context = this;
  this.films = new ReactiveVar([]);

  HTTP.call("GET","http://localhost:3000/api/movies",{}, function (err,res) {
    if (err){
      console.log(err);
    } else{
      context.films.set(JSON.parse(res.content));
    }
  });
});

Template.films.helpers({
  films() {
    return Template.instance().films.get();
  }
});

// Event listener permettant de "liker" film
Template.films.events({
  'click .like' : function(event) {
    updateVote(event.currentTarget, true);
  }
});

// Event listener permettant de "disliker" un film
Template.films.events({
  'click .dislike' : function(event) {
    updateVote(event.currentTarget, false);
  }
});

// Appel au serveur permettant de stocker le vote
function updateVote(element, like) {
  HTTP.call("POST", "http://localhost:3000/api/voteFilm",
      {
        headers: {
          "content-type":"application/json",
          "Accept":"application/json"
        },
        data: {
          'id': element.dataset.id,
          'like': like,
        }
      },
      function(err,res) {
        if (err) {
          console.log(err);
        } else {
          let span = element.closest('.card-footer').getElementsByClassName('count-vote')[0];
          span.innerHTML = like ? parseInt(span.innerHTML) + 1 : parseInt(span.innerHTML) - 1;
        }
  });
}
// ------------------------------------------------- END FILMS ----------------------------------------------------- ///



// -------------------------------------------------- ACTEURS ------------------------------------------------------ ///

// On récupère la liste des acteurs à la création du template
Template.acteurs.onCreated(function() {
  const context = this;
  this.acteurs = new ReactiveVar([]);

  HTTP.call("GET","http://localhost:3000/api/acteurs",{}, function (err,res){
    if (err) {
      console.log(err);
    } else {
      context.acteurs.set(JSON.parse(res.content));
    }
  });
});

Template.acteurs.helpers({
  acteurs() {
    return Template.instance().acteurs.get();
  }
});

// Event listener permettant d'afficher les détails d'un acteur
Template.acteurs.events({
  'click .img-acteur' : function(event) {
    const id = event.currentTarget.dataset['id'];
    BlazeLayout.render('detailsActeurs', {idActeur : id});
  }
});
// ----------------------------------------------- END ACTEURS ----------------------------------------------------- ///



// -------------------------------------------- DETAILS ACTEURS ---------------------------------------------------- ///

// On récupère les détails de l'acteur à la création du template
Template.detailsActeurs.onCreated(function() {
  const context = this;
  this.acteur =  new ReactiveVar([]);

  const idActeur = this.data.idActeur();

  HTTP.call("GET","http://localhost:3000/api/acteur?idActeur=" + idActeur,{},
      function(err,res) {
        if (err) {
          console.log(err);
        } else {
          context.acteur.set(JSON.parse(res.content));
          initialiseRating(context.acteur.get().private_data.rating);
        }
      });
});

Template.detailsActeurs.helpers({
  acteur() {
    return Template.instance().acteur.get();
  }
});

// Event listener permettant de noter un acteur
Template.detailsActeurs.events({
  'click .star' : function(event) {
    // Appel au serveur permettant de stocker la note
    HTTP.call("POST", "http://localhost:3000/api/voteActeur",
        {
          headers: {
            "content-type":"application/json",
            "Accept":"application/json"
          },
          data: {
            'id': event.currentTarget.parentElement.dataset['id'],
            'rating': event.currentTarget.dataset['value'],
          }
        },
        function(err,res) {
          if (err) {
            console.log(err);
          }
        });
  }
});

// ------------------------------------------- END DETAILS ACTEURS ------------------------------------------------- ///



