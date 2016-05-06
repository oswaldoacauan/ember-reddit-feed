import Ember from 'ember';

const parseHtml = toParse => {
  if (toParse) {
    return toParse.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\"/g, '"');
  }

  return toParse;
}

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  beforeModel() {
    this.controllerFor('subreddit').set('isLoading', true);
  },

  model(params) {
    const subreddit = this.paramsFor('subreddit').name;
    const {
      id,
      slug
    } = params;

    let endpoint = `/r/${subreddit}/comments/${id}/${slug}`;

    this.controllerFor('subreddit').set('isLoading', true);

    return this.get('ajax').request(`${endpoint}.json`).then(payload => {
      this.controllerFor('subreddit').set('isLoading', false);
      const post = payload[0].data.children[0].data;
      return {
        id: post.id,
        author: post.author,
        created: post.created_utc,
        downs: post.downs,
        gilded: post.gilded,
        num_comments: post.num_comments,
        permalink: post.permalink,
        slug: post.permalink.split('/').slice(-2)[0],
        score: post.score,
        thumbnail: post.thumbnail,
        title: post.title,
        ups: post.ups,
        url: post.url,
        score: post.score,
        selftext: post.selftext,
        media: parseHtml(post.media_embed.content),
        image: post.preview ? post.preview.images[0].source : null,
        comments: payload[1].data.children.map(_ => {
          const comment = _.data;
          return {
            // id: comment.id,
            author: comment.author,
            created: comment.created_utc,
            downs: comment.downs,
            gilded: comment.gilded,
            num_comments: comment.num_comments,
            permalink: comment.permalink,
            score: comment.score,
            ups: comment.ups,
            url: comment.url,
            score: comment.score,
            selftext: comment.selftext,
            replies: comment.replies,
            body: comment.body,
          };
        })
      };
    });
  },
});
