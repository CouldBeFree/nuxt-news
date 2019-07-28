import Vuex from 'vuex';
import md5 from 'md5';
import db from '~/plugins/firestore';
import { saveUserData, clearUserData } from '~/utils';

const createStore = () => {
  return new Vuex.Store({
    state: {
      headlines: [],
      loading: false,
      category: '',
      token: '',
      country: 'us',
      user: null
    },
    mutations: {
      setHeadlines(state, headlines) {
        state.headlines = headlines;
      },
      setLoading(state, loading) {
        state.loading = loading;
      },
      setCategory(state, category) {
        state.category = category;
      },
      setCountry(state, country) {
        state.country = country;
      },
      setToken(state, token) {
        state.token = token;
      },
      setUser(state, user){
        state.user = user;
      },
      clearToken: state => (state.token = ''),
      clearUser: state => (state.user = null)
    },
    actions: {
      async loadHeadlines({ commit }, apiUrl) {
        commit('setLoading', true);
        const { articles } = await this.$axios.$get(apiUrl);
        commit('setLoading', false);
        commit('setHeadlines', articles);
      },
      async authenticateUser({ commit }, userPayload) {
        try{
          commit('setLoading', true);
          const authUserData = await this.$axios.$post(`/${userPayload.action}/`, {
            email: userPayload.email,
            password: userPayload.password,
            returnSecureToken: userPayload.returnSecureToken
          });
          let user;
          if(userPayload.action === 'register') {
            const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?d=identicon`;
            user = { email: authUserData.email, avatar };
            await db.collection('users').doc(userPayload.email).set(user);
          } else {
            const loginRef = db.collection('users').doc(userPayload.email);
            const loggedInUser = await loginRef.get();
            user = loggedInUser.data();
          }
          saveUserData(authUserData, user);
          commit('setUser', user);
          commit('setToken', authUserData.idToken);
          commit('setLoading', false);
        } catch(err){
          console.error(err);
          commit('setLoading', false);
        }
      },
      setLogoutTimer({ dispatch }, interval){
        setTimeout(() => dispatch('logoutUser'), interval)
      },
      logoutUser({ commit }){
        commit('clearToken');
        commit('clearUser');
        clearUserData();
      }
    },
    getters: {
      headlines: state => state.headlines,
      loading: state => state.loading,
      category: state => state.category,
      user: state => state.user,
      country: state => state.country,
      isAuthenticated: state => !!state.token
    }
  });
};

export default createStore;
