import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  var ct = this;
  this.counter = new ReactiveVar(0);
  this.test = new ReactiveVar("Default");
  HTTP.call("GET","http://localhost:3000/ws",{}, function (err,res){
    if (err){
      console.log(err);
    }else{
      console.log(res.content);
      ct.test.set(res.content);
    }
  });
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  test(){
    return Template.instance().test.get();
  }
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
