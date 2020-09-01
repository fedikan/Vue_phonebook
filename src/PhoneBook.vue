<template>
  <div class="phonebook">
    <h3 class="title">PhoneBook</h3>
    <div class="content">
      <div class="new-contact">
        <input
          type="text"
          v-model="newContactInput"
          placeholder="New contact"
          class="new-contact__input"
        />
        <button v-on:click="addContact">
          <Add />
        </button>
      </div>
      <ul>
        <li v-for="(contact,index) of contacts" :key="index" class="contact-li">
          <span>
            <router-link :to="{name:'contact',params:{contact,index}}" :index="index">
              <template v-if="contact.name">{{contact.name}}</template>
              <template v-else-if="contact.phone">{{contact.phone}}</template>
              <template v-else>Пустой контакт</template>
            </router-link>
          </span>
          <button v-on:click="requireConfirm(index,'deleteContact')">
            <Bin />
          </button>
        </li>
      </ul>
    </div>
    <Modal />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Modal from "./components/modal";
import Add from "./assets/add";
import Bin from "./assets/bin";
export default {
  data() {
    return {
      newContactInput: "",
    };
  },
  components: { Modal, Add, Bin },
  computed: mapGetters(["contacts"]),
  methods: {
    addContact() {
      if (this.newContactInput) {
        this.$store.commit("addContact", this.newContactInput);
        this.newContactInput = "";
      }
    },
    requireConfirm(index, reason) {
      const payload = {
        index,
        reason,
      };
      this.$store.commit("requireConfirm", payload);
    },
  },
};
</script>

<style scoped>
.phonebook {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.title {
  font-size:25px;
  font-family: 'Inconsolata', monospace;
}
.content {
  max-width: 600px;
  min-height: 100px;
  padding: 20px;

  border: 1px solid black;
  border-radius: 4px;
}
.contact-li {
  padding-top: 10px;
  list-style: none;
  font-size: 20px;
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;
}

.new-contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  width: 100%;
  border: 1px solid black;
  border-radius: 15px;
  padding: 0 5px;
}
.new-contact__input {
  border: none;
  margin: 0 10px;
  outline: none;
}
</style>