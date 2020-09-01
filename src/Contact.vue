<template>
  <div>
    <div class="contactcard">
      <div class="contact__content">
        <template v-if="localContact">
          <h1 class="name">{{getInfo()}}</h1>
          <h3 class="title">contact card</h3>
          <ul class="info">
            <li v-for="(info, index) in localContact" :key="index" class="info_item">
              <template v-if="!info.isChanging">
                <div class="item_text">
                  <strong class="item_key">{{info.key}}</strong>
                  :
                  <span class="item_value">{{info.value}}</span>
                </div>
                <div>
                  <button :disabled="somethingChanging" @click="edit(info,index)">
                    <Edit />
                  </button>
                  <button
                    :disabled="somethingChanging"
                    @click="requireConfirm(info.key,'deleteInfo')"
                  >
                    <Bin />
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="change_inputs">
                  <input type="text" v-model="changeKeyInput" class="change_input" />
                  <input type="text" v-model="changeValueInput" class="change_input" />
                </div>
                <div>
                  <button @click="done(index)">
                    <Ok />
                  </button>
                  <button @click="requireConfirm(info.key,'setChange')">
                    <Cancel />
                  </button>
                </div>
              </template>
            </li>
          </ul>
          <div class="info-input">
            <input placeholder="key" v-model="keyInput" class="key_input" />
            <input placeholder="value" v-model="valueInput" class="value_input" />
            <button :disabled="somethingChanging" @click="addInfo">
              <Add />
            </button>
          </div>
          <div class="steps_buttons">
            <button :disabled="somethingChanging" @click="undo">
              <Undo />
            </button>
            <button :disabled="somethingChanging" @click="redo">
              <Redo />
            </button>
          </div>
        </template>
        <div v-show="!somethingChanging" style="width:2rem">
          <router-link :to="{name:'phone_book'}">back</router-link>
        </div>
      </div>
    </div>

    <Modal @confirmed="getState" />
  </div>
</template>

<script>
import Modal from "./components/modal";
import Add from "./assets/add";
import Bin from "./assets/bin";
import Edit from "./assets/edit";
import Undo from "./assets/undo";
import Redo from "./assets/redo";
import Ok from "./assets/done";
import Cancel from "./assets/cancel";

export default {
  data() {
    return {
      keyInput: "",
      valueInput: "",
      changeKeyInput: "",
      changeValueInput: "",
      localContact: [],
    };
  },
  components: { Modal, Add, Bin, Edit, Undo, Redo, Ok, Cancel },
  beforeMount() {
    this.$store.commit("setCache");
    this.localContact = this.$store.getters.getContact(this.index);
  },
  computed: {
    somethingChanging: function () {
      return this.$store.state.somethingChanging;
    },
  },
  props: ["index"],
  methods: {
    getState() {
      this.localContact = this.$store.getters.getContact(this.index);
    },
    addInfo() {
      if (this.keyInput && this.valueInput) {
        const payload = {
          index: this.index,
          key: this.keyInput,
          value: this.valueInput,
        };

        this.$store.commit("addInfo", payload);
        this.$store.commit("cacheChanges");
        this.keyInput = this.valueInput = "";
        this.getState();
      }
    },
    requireConfirm(name, reason) {
      const payload = {
        name,
        reason,
        index: this.index,
      };
      this.$store.commit("requireConfirm", payload);
    },
    undo() {
      this.$store.commit("undo");
      this.getState();
    },
    redo() {
      this.$store.commit("redo");
      setTimeout(this.getState(), 0);
    },
    edit(info, index) {
      this.$store.commit("setChange");
      this.changeKeyInput = info.key;
      this.changeValueInput = info.value;
      this.localContact[index].isChanging = true;
    },
    done(index) {
      this.localContact[index].isChanging = false;
      this.localContact[index].key = this.changeKeyInput;
      this.localContact[index].value = this.changeValueInput;
      const payload = { data: this.localContact, index: this.index };
      this.$store.commit("setChange");
      this.$store.commit("setContact", payload);
      this.$store.commit("cacheChanges");
    },
    cancel(index) {
      this.localContact[index].isChanging = false;
    },
    getInfo() {
      for (let item of this.localContact) {
        if (item.key === "name") {
          return item.value;
        } else if (item.key === "phone") {
          return item.value;
        } else return null;
      }
    },
  },
};
</script>

<style scoped>
.contactcard {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.contact__content {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 5px;
  border: 1px solid black;
  border-radius: 5px;
}
.name {
  text-transform: capitalize;
  margin-bottom: 5px;
}
.title {
  margin-bottom: 5px;
}
.info_item {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin-top: 10px;
  width: 100%;
  border-bottom: 1px solid black;
}
.item_text {
  font-size: 20px;
}
.info-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 5px 10px;
  max-width: 400px;
  min-height: 34px;
  margin: 15px auto;
  border: 1px solid black;
  border-radius: 17px;
}
.key_input,
.value_input,
.change_input {
  border: none;
  outline: none;
  max-width: 200px;
}
.key_input {
  border-right: 1px solid grey;
  margin-right: 5px;
}
.steps_buttons {
  margin: 0 auto;
}
.change_input {
  background-color: rgb(251, 255, 238);
  font-size: 15px;
  height: 20px;
}
.change_input:first-child {
  margin-bottom: 5px;
}
@media (max-width: 430px) {
  .change_input:first-child {
    border-bottom: 1px solid black;
  }
  .info-input {
    flex-direction: column;
  }
  .key_input {
    text-align: center;
    border: none;
    border-bottom: 1px solid grey;
    margin: 5px 0px;
  }
  .value_input {
    text-align: center;
    margin-bottom: 5px;
  }
}
</style>