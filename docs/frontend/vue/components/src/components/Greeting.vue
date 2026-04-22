<template>
  <p v-if="age >= 25">{{ msg }}</p>
  <p v-else>You must be 25 years or older to view this message</p>
</template>

<script>
export default {
  name: 'Greeting',
  props: ['age'],
  data() {
    return {
      msg: 'hello world!',
    };
  },
};
</script>

<style scoped lang="scss">
p {
  color: red;
  &:hover {
    color: darken($color: #cc4444, $amount: 15%);
  }
}
</style>
