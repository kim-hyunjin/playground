<template>
  <h3>Hey!</h3>
  <Greeting :age="age" />
  <user :age="age" @age-change="updateAge" :ageChangeFn="updateAgeCB"></user>
  <app-form>
    <template v-slot:help>
      <p>{{ help }}</p>
    </template>
    <template v-slot:fields>
      <input type="text" />
      <input type="text" />
    </template>
    <template v-slot:buttons>
      <button>button</button>
    </template>
    <p>this is goes to default slot</p>
  </app-form>
  <select v-model="componentName">
    <option value="Home">Home</option>
    <option value="About">About</option>
  </select>

  <keep-alive>
    <component :is="componentName"></component>
  </keep-alive>

  <Animating />
</template>

<script>
import Greeting from '@/components/Greeting.vue';
import User from '@/components/User.vue';
import AppForm from '@/components/Form.vue';
import Home from '@/components/Home.vue';
import About from '@/components/About.vue';
import Animating from '@/components/Animating.vue';

export default {
  name: 'MyApp',
  components: {
    Greeting,
    User,
    AppForm,
    Home,
    About,
    Animating,
  },
  data() {
    return {
      age: 20,
      help: 'this is some help text.',
      componentName: 'Home',
    };
  },
  methods: {
    updateAge(num) {
      this.age += num;
    },
    updateAgeCB(num) {
      this.age += num;
    },
  },
};
</script>
