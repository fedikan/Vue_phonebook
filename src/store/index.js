import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    contacts: [
      { name: "egor", phone: "123123123" },
      { name: "petr", phone: "121231233" },

    ],
    showModal: false,
    confirmIndex: -1,
    confirmReason: '',
    confrirmName: '',
    cache: [],
    cacheCounter: 0,
    somethingChanging: false
  },
  actions: {
    confirmed(ctx) {
      ctx.commit('setModal')
      ctx.commit(ctx.state.confirmReason)
    },
    cacheChanges(ctx) {
      ctx.commit('cacheChanges')
    },
  },
  mutations: {
    dropState(state) {
      state.showModal = false,
        state.confirmIndex = -1,
        state.confirmReason = '',
        state.confrirmName = '',
        state.cache = [],
        state.cacheCounter = 0,
        state.somethingChanging = false
    },
    setCache(state) {
      const newCache = _.cloneDeep(state.contacts)
      state.cache = [newCache]
    },
    cacheChanges(state) {
      if (state.cache.length - state.cacheCounter < 2) {
        const newState = _.cloneDeep(state.contacts)
        const newCache = _.cloneDeep(state.cache)
        newCache.push(newState)
        state.cache = newCache
        state.cacheCounter++
      } else {
        const newCache = _.cloneDeep(state.cache)
        const newState = _.cloneDeep(state.contacts)
        const SPLICE_START = state.cacheCounter + 1
        const SPLICE_AMOUNT = state.cache.length - state.cacheCounter - 1
        newCache.splice(SPLICE_START, SPLICE_AMOUNT)
        newCache.push(newState)
        state.cache = newCache
        state.cacheCounter++
      }
    },
    requireConfirm(state, payload) {
      state.showModal = true
      state.confirmIndex = payload.index
      state.confirmName = payload.name
      state.confirmReason = payload.reason
    },
    addContact(state, name) {
      const newContacts = _.cloneDeep(state.contacts)
      newContacts.push({ name })
      state.contacts = newContacts
    },
    deleteContact(state) {
      const newContacts = _.cloneDeep(state.contacts)
      newContacts.splice(state.confirmIndex, 1)
      state.contacts = newContacts

    },

    setContact(state, payload) {
      let localContact = {}
      for (let item of payload.data) {
        localContact[item.key] = item.value
      }
      state.contacts[payload.index] = localContact
    },
    addInfo(state, payload) {
      const newContacts = _.cloneDeep(state.contacts)
      newContacts[payload.index][payload.key] = payload.value
      state.contacts = newContacts
    },

    deleteInfo(state) {
      const newContacts = [...state.contacts]
      delete newContacts[state.confirmIndex][state.confirmName]
      state.contacts = newContacts

    },
    undo(state) {
      if (state.cacheCounter !== 0) {
        state.cacheCounter--
        const pastState = _.cloneDeep(state.cache[state.cacheCounter])
        state.contacts = pastState
      }
    },
    redo(state) {
      if (state.cacheCounter < state.cache.length - 1) {
        state.cacheCounter++
        const nextState = _.cloneDeep(state.cache[state.cacheCounter])
        state.contacts = nextState
      }
    },
    setModal(state) {
      state.showModal ? state.showModal = false : state.showModal = true
    },
    setChange(state) {
      state.somethingChanging ? state.somethingChanging = false : state.somethingChanging = true
    }
  },
  getters: {
    contacts(state) {
      return state.contacts
    },
    getContact: state => id => {
      let contactAsArray = []
      for (let key in state.contacts[id]) {
        contactAsArray.push({ key: key, value: state.contacts[id][key], isChanging: false })
      }
      return contactAsArray
    },
    showModal(state) {
      return state.showModal
    },
    cache(state) {
      return state.cache
    }
  }
})

export default store