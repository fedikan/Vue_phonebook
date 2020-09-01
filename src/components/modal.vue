<template>
  <div class="modal" v-if="showModal">
    <div class="content">
      Are You sure?
      <div class="modal__buttons">
        <button v-on:click="confirm">
          <Ok />
        </button>
        <button v-on:click="$store.commit('setModal')">
          <Cancel />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Ok from "../assets/done";
import Cancel from "../assets/cancel";

export default {
  components: { Ok, Cancel },
  computed: mapGetters(["showModal"]),
  methods: {
    confirm() {
      this.$store.dispatch("confirmed");
      this.$store.commit("cacheChanges");
      this.$emit("confirmed");
    },
  },
};
</script>


<style scoped>
.modal {
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.5);
  top: 0px;
  left: 0px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  padding: 40px;
  border: 1px solid black;
  border-radius: 4px;
  background: white;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>