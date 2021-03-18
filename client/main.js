import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


import './main.html';

// --- ROUTING ---//

var acteur = new ReactiveVar([]);


Template.navbar.events({
  'click .acteursClick':function(event){
    BlazeLayout.render("acteurs");
  }
});

Template.navbar.events({
  'click .helloClick':function(event){
    BlazeLayout.render("hello");
  }
});



FlowRouter.route('/:acteurId', {
  action: function(params, queryParams) {
    console.log("Id acteur", queryParams);
    HTTP.call("GET","http://localhost:3000/api/acteur?idActeur="+queryParams.idacteur,{}, function (err,res){
      if (err){
        console.log(err);
      } else{
        acteur.set(JSON.parse(res.content));
        BlazeLayout.render("detail");
      }
    });

  },
});



// ---END  ROUTING ---//



// --- PARTIE DISCOVER --- ///
Template.hello.onCreated(function helloOnCreated() {

  var ct = this;
  this.counter = new ReactiveVar(0);
  this.test = new ReactiveVar("Default");
  this.movies = new ReactiveVar([]);

  // partie api web
  HTTP.call("GET","http://localhost:3000/api/movies",{}, function (err,res){
    if (err){
      console.log(err);
    } else{
      ct.movies.set(JSON.parse(res.content).results);
      //console.log(JSON.parse(res.content).results);
    }
  });
});
Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  test(){
    return Template.instance().test.get();
  },
  movies() {
    return Template.instance().movies.get();
  }
});


Template.hello.events({
  'click .like':function(event){
    updateVote(event.currentTarget, true);
  }
});

Template.hello.events({
  'click .dislike':function(event) {
    updateVote(event.currentTarget, false);
  }
});

function updateVote(element, like) {
  console.log(element.dataset.votecount)
  HTTP.call("POST", "http://localhost:3000/api/updateVote",
      {
        headers: {
          "content-type":"application/json",
          "Accept":"application/json"
        },
        data: {
          'id': parseInt(element.dataset.id),
          'like': like,
          'vote_count': parseInt(element.dataset.votecount)
        }
      },
      function (err,res) {
        if (err) {
          console.log(err);
        } else {
          element.closest('.card-footer').getElementsByClassName('count-vote')[0].innerHTML = res.content;
        }
  });
}

// --- END PARTIE DISCOVER --- ///


// --- PARTIE ACTEURS --- ///

Template.acteurs.onCreated(function acteursOnCreated() {
  var ct = this;
  this.counter = new ReactiveVar(0);
  this.test = new ReactiveVar("Default");
  this.acteurs = new ReactiveVar([]);


  HTTP.call("GET","http://localhost:3000/api/acteurs",{}, function (err,res){
    if (err){
      console.log(err);
    } else{
      ct.acteurs.set(JSON.parse(res.content).results);
      console.log(JSON.parse(res.content).results);
    }
  });
});
Template.acteurs.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  test(){
    return Template.instance().test.get();
  },
  acteurs() {
    return Template.instance().acteurs.get();
  }
});


Template.acteurs.events({
  'click .imgActeur':function(event){
    // permet d'appeler la route avec des parametres
    FlowRouter.go('/acteurs/?idacteur='+event.currentTarget.dataset.id);

  }
});




// --- END PARTIE ACTEURS --- ///

Template.detail.onCreated(function acteursOnCreated() {
  var ct = this;
  this.acteur = acteur;
});
Template.detail.helpers({
  acteur() {
    return Template.instance().acteur.get();
  }
});




