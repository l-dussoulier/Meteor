import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  var ct = this;
  this.counter = new ReactiveVar(0);
  this.test = new ReactiveVar("Default");
  this.movies = new ReactiveVar([]);
  // call fichier json
/*  HTTP.call("GET","http://localhost:3000/movies",{}, function (err,res){
    if (err){
      console.log(err);
    }else{
      ct.movies.set(JSON.parse(res.content).results);
      console.log(JSON.parse(res.content).results);
    }
  });*/

// partie api web
  HTTP.call("GET","http://localhost:3000/api/movies",{}, function (err,res){
    if (err){
      console.log(err);
    }else{
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
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
