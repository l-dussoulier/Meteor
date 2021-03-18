import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
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

// acteurs
//
//
//



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

