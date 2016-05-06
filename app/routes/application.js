import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/reddits.json').then(payload => {
      return payload.data.children.map(_ => {
        const { data } = _;
        return {
          name: data.display_name,
          title: data.title,
          subscribers: data.subscribers,
          url: data.url,
        };
      });
    });
  },

  afterModel(subreddits, transition) {
    if(!transition.params.hasOwnProperty('subreddit')) {
      this.transitionTo('subreddit', subreddits[0].name);
    }
  },

  init() {
    this.router.one('didTransition', () => Ember.$('#js-loading-screen').addClass('loaded'));
  }
});
