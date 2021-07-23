import * as types from './mutation-types';

const mutations = {
  [types.SET_LOADED_LINKS](state, links) {
    state.loadedAsyncLinks = links;
    console.log('mutations: ', state.loadedAsyncLinks);
  },
  [types.SET_GUIDE_APP_FLAG](state, flag) {
    state.guideAppAlertFlag = flag;
  },
  [types.SET_GUIDE_BROWSER_FLAG](state, flag) {
    state.guideBrowserOpenFlag = flag;
  },
  settoken(state, token) {
    state.token = token;
  },
};

export default mutations;
