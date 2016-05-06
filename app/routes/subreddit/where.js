import Ember from 'ember';

const parseHtml = toParse => {
  if(toParse) {
    return toParse.replace(/&lt;/g, '<').replace(/&gt;/g, '>') .replace(/&amp;/g, '&').replace(/\"/g, '"');
  }

  return toParse;
}

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  beforeModel() {
    this.controllerFor('subreddit').set('isLoading', true);
  },

  model(params) {
    const subreddit = this.modelFor('subreddit');
    const { where } = params;

    let endpoint = `/r/${subreddit.name}`;

    if(where !== '') {
      endpoint += `/${where}`;
    }

    this.controllerFor('subreddit').set('isLoading', true);

    return this.get('ajax').request(`${endpoint}.json`).then(payload => {
      this.controllerFor('subreddit').set('isLoading', false);
      return payload.data.children.map(_ => {
        const { data } = _;
        return {
          id: data.id,
          author: data.author,
          created: data.created_utc,
          downs: data.downs,
          gilded: data.gilded,
          num_comments: data.num_comments,
          permalink: data.permalink,
          slug: data.permalink.split('/').slice(-2)[0],
          score: data.score,
          thumbnail: data.thumbnail,
          title: data.title,
          ups: data.ups,
          url: data.url,
          score: data.score,
          selftext: data.selftext,
          media: parseHtml(data.media_embed.content),
          image: data.preview ? data.preview.images[0].source : null,
        };
      });
    });
  },
});
