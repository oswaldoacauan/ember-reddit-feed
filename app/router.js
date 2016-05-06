import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('subreddit', { path: '/r/:name' }, function() {
    this.route('comments', { path: '/comments/:id/:slug' });
    this.route('where', { path: '/:where' });
  });
});

export default Router;
