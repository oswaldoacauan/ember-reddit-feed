import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  beforeModel() {
    this.controllerFor('subreddit').set('isLoading', true);
  },

  model(params) {
    const endpoint = `/r/${params.name}/about`;

    return this.get('ajax').request(`${endpoint}.json`).then(payload => {
      const { data } = payload;
      return {
        name: data.display_name,
        title: data.title,
        subscribers: data.subscribers,
        url: data.url,
      };
    });
  },

  afterModel(subreddits, transition) {
    if(!transition.params.hasOwnProperty('subreddit.where')) {
      this.transitionTo('subreddit.where', '');
    }
  },
});
