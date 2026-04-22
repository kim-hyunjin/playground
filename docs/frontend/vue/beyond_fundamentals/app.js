let vm = Vue.createApp({
  data() {
    return {
      message: 'Hello world!',
    };
  },
  // https://vuejs.org/guide/essentials/lifecycle.html
  beforeCreate() {
    console.log('beforeCreate() fn called!', this.message);
  },
  created() {
    console.log('created() fn called!', this.message);
  },
  beforeMount() {
    console.log('beforeMount() fn called!', this.$el);
  },
  mounted() {
    console.log('mounted() fn called!', this.$el);
  },
  beforeUpdate() {
    console.log('beforeUpdate() fn called!', this.message);
  },
  updated() {
    console.log('updated() fn called!', this.message);
  },
  beforeUnmount() {
    console.log('beforeUnmount() fn called!', this.$el);
  },
  unmounted() {
    console.log('unmounted() fn called!', this.$el);
  },
  template: `{{ message }}`,
});

vm.mount('#app');

// setTimeout(() => {
//   vm.mount('#app');
// }, 3000);

let vm2 = Vue.createApp({
  data() {
    return {
      message: 'Hello world!',
    };
  },
  render() {
    return Vue.h('h1', this.message);
  },
}).mount('#app2');

let vm3 = Vue.createApp({});

vm3.component('hello', {
  template: `<h1>{{message}}</h1>`,
  data() {
    return {
      message: 'hello I am component!',
    };
  },
});

vm3.mount('#app3');
