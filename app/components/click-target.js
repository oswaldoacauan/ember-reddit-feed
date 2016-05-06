import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['clickable'],
  click() {
    this.sendAction('action');
  }
});
