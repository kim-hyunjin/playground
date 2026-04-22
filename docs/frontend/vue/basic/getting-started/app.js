const vm = Vue.createApp({
  data() {
    return {
      firstName: 'John',
      middleName: '',
      lastName: 'Doe',
      url: 'https://google.com',
      raw_url: '<a href="https://google.com" target="_blank">Google</a>',
      age: 20,
    };
  },
  methods: {
    // 다른 data가 변경될 때도 fullName 메소드가 호출됨
    fullName() {
      console.log('Full name method was called!');
      return `${this.firstName} ${this.middleName} ${this.lastName.toUpperCase()}`;
    },
    increment() {
      this.age++;
    },
    updateLastName(msg, event) {
      // console.log(msg);
      this.lastName = event.target.value;
    },
    updateMiddleName(event) {
      this.middleName = event.target.value;
    },
  },
  // https://vuejs.org/guide/essentials/computed.html#basic-example
  computed: {
    // fullName 내부에서 사용되는 data가 변경되는 경우에만 호출됨
    fullName() {
      console.log('Full name computed property was called!');
      return `${this.firstName} ${this.middleName} ${this.lastName.toUpperCase()}`;
    },
  },
  watch: {
    age(newVal, oldVal) {
      // free to use asyncronous job.
      setTimeout(() => {
        this.age = 20;
      }, 3000);
    },
  },
}).mount('#app1');

setTimeout(() => {
  // without proxy
  vm.$data.firstName = 'Bob';

  // with proxy
  vm.lastName = 'Bob';
}, 2000);

// Vue.createApp({
//   data() {
//     return {
//       firstName: 'John',
//       lastName: 'Doe',
//     };
//   },
// }).mount('#app2');
