<template>
  <div class="md-layout md-alignment-center" style="margin: 4em 0;">
    <md-toolbar class="fixed-toolbar" elevation="1">
      <md-button @click="showLeftSidePanel = true" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
      <nuxt-link class="md-primary md-title" to="/">
        NuxtNews
      </nuxt-link>
      <div class="md-toolbar-section-end">
        <template v-if="isAuthenticated">
          <md-button>
            <md-avatar><img :src="user.avatar" :alt="user.email"></md-avatar>
            {{user.email}}
          </md-button>
          <md-button @click="logoutUser">Logout</md-button>
        </template>
        <template v-else>
          <md-button to="/login">Login</md-button>
          <md-button to="/register">Register</md-button>
        </template>
        <md-button @click="showRightSidePanel = true" class="md-accent">Categories</md-button>
      </div>
    </md-toolbar>
    <md-drawer md-fixed :md-active.sync="showLeftSidePanel">
      <md-toolbar md-elevation="1">
        <span class="md-title">Personal Feed</span>
        <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
        <md-field>
          <label for="country">Country</label>
          <md-select @input="changeCountry" :value="country" name="country" id="country">
            <md-option value="us">United States</md-option>
            <md-option value="ca">Canada</md-option>
            <md-option value="de">Germany</md-option>
            <md-option value="ua">Ukraine</md-option>
          </md-select>
        </md-field>
      </md-toolbar>
      <md-empty-state class="md-primary" v-if="feed.length === 0 && !user" md-icon="bookmarks" md-label="Nothing in Feed"
        md-description="Login to bookmark headlines">
        <md-button to="/login" class="md-primary md-raised">Login</md-button>
      </md-empty-state>
      <md-empty-state v-else-if="feed.length === 0" class="md-accent" md-icon="bookmark_outline" md-label="Nothing if Feed" md-description="Anything
      you bookmark will be safely stored here">
      </md-empty-state>
      <md-list class="md-triple-line" v-else v-for="headline in feed" :key="headline.id">
        <md-list-item>
          <md-avatar>
            <img :src="headline.urlToImage" :alt="headline.title">
          </md-avatar>
          <div class="md-list-item-text">
            <span><a :href="headline.url" target="_blank">{{headline.title}}</a></span>
            <span>{{headline.source.name}}</span>
            <span>View comments</span>
          </div>
          <md-button @click="removeHeadlineFromFeed(headline)" class="md-icon-button md-list-action">
            <md-icon class="md-accent">delete</md-icon>
          </md-button>
        </md-list-item>
        <md-divider class="md-inset"></md-divider>
      </md-list>
    </md-drawer>
    <md-drawer class="md-right" md-fixed :md-active.sync="showRightSidePanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">News categories</span>
      </md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
      <md-list>
        <md-subheader class="md-primary">Categories</md-subheader>
        <md-list-item v-for="(newsCategory, i) in newsCategories" :key="i" @click="loadCategory(newsCategory.path)">
          <md-icon :class="newsCategory.path === category ? 'md-primary' : ''">{{newsCategory.icon}}</md-icon>
          <span class="md-list-item-text">{{newsCategory.name}}</span>
        </md-list-item>
      </md-list>
    </md-drawer>
    <div class="md-layout-item md-size-95">
      <md-content class="md-layout md-gutter" style="background: #007998; padding: 1em;">
        <ul v-for="headline in headlines" :key="headline.id" class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card style="margin-top: 1em;" md-with-hover>
            <md-ripple>
              <md-card-media md-ratio="16:9">
                <img :src="headline.urlToImage" :alt="headline.title">
              </md-card-media>
              <md-card-header>
                <div class="md-title">
                  <a :href="headline.url" target="_blank">{{headline.title}}</a>
                </div>
                <div>
                  {{headline.source.name}}
                  <md-icon class="small-icon">book</md-icon>
                </div>
                <div class="md-subhead" v-if="headline.author">
                  {{headline.author}}
                  <md-icon class="small-icon">face</md-icon>
                </div>
                <div class="md-subhead">
                  {{headline.publishedAt}}
                  <md-icon class="small-icon">alarm</md-icon>
                </div>
              </md-card-header>
              <md-card-content>{{headline.description}}</md-card-content>
              <md-card-actions>
                <md-button @click="addHeadlineToFeed(headline)" class="md-icon-button" :class="isInFeed(headline.title)">
                  <md-icon>bookmark</md-icon>
                </md-button>
                <md-button @click="saveHeadline(headline)" class="md-icon-button">
                  <md-icon>message</md-icon>
                </md-button>
              </md-card-actions>
            </md-ripple>
          </md-card>
        </ul>
      </md-content>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      showRightSidePanel: false,
      showLeftSidePanel: false,
      newsCategories: [
        { name: 'Top Headlines', path: '', icon: 'today' },
        { name: 'Technology', path: 'technology', icon: 'keyboard' },
        { name: 'Business', path: 'business', icon: 'business_center' },
        { name: 'Entertainment', path: 'entertainment', icon: 'weekend' },
        { name: 'Health', path: 'health', icon: 'fastfood' },
        { name: 'Science', path: 'science', icon: 'fingerprint' },
        { name: 'Sports', path: 'sports', icon: 'golf_course' }
      ]
    }),
    async fetch({ store }){
      await store.dispatch('loadHeadlines', `/api/top-headlines?country=${store.state.country}&category=${store.state.category}`);
      await store.dispatch('loadUserFeed');
    },
    computed: {
      headlines(){
        return this.$store.getters.headlines;
      },
      category(){
        return this.$store.getters.category;
      },
      loading(){
        return this.$store.getters.loading
      },
      country(){
        return this.$store.getters.country
      },
      isAuthenticated(){
        return this.$store.getters.isAuthenticated
      },
      user(){
        return this.$store.getters.user
      },
      feed(){
        return this.$store.getters.feed
      }
    },
    watch: {
      async country() {
        await this.$store.dispatch(
                "loadHeadlines",
                `/api/top-headlines?country=${this.country}&category=${this.category}`
        );
      }
    },
    methods: {
      async loadCategory(category){
        this.$store.commit('setCategory', category);
        await this.$store.dispatch('loadHeadlines', `/api/top-headlines?country=${this.country}&category=${this.category}`)
      },
      changeCountry(country) {
        this.$store.commit("setCountry", country);
      },
      logoutUser(){
        this.$store.dispatch('logoutUser')
      },
      async addHeadlineToFeed(headline){
        if(this.user){
          await this.$store.dispatch('addHeadlineToFeed', headline);
        }
      },
      isInFeed(title){
        const inFeed = this.feed.findIndex(headline => headline.title === title) > -1;
        return inFeed ? 'md-primary' : '';
      },
      async removeHeadlineFromFeed(headline){
        await this.$store.dispatch('removeHeadlineFromFeed', headline);
      },
      async saveHeadline(headline){
        await this.$store.dispatch('saveHeadline', headline).then(() => {
          this.$router.push(`/headlines/${headline.slug}`)
        });
      }
    }
  }
</script>

<style scoped>
  .small-icon{
    font-size: 18px !important;
  }

  .fixed-toolbar{
    position: fixed;
    z-index: 5;
    top: 0;
  }
</style>
