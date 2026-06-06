<template>
  <div>The User is {{ age }} years old</div>
  <button @click="onClickAge">Updage Age</button>
  <button @click="ageChangeFn(3)">Updage Age with callback</button>
  <p>{{ ageDoubled }}</p>
</template>

<script>
export default {
  name: 'User',
  props: {
    age: {
      type: Number,
      // required: true,
      // default: 20,
      validator(value) {
        return value < 130;
      },
    },
    ageChangeFn: Function,
  },
  emits: ['age-change'],
  computed: {
    ageDoubled() {
      return this.age * 2;
    },
  },
  methods: {
    onClickAge() {
      this.$emit('age-change', 3);
    },
  },
};
</script>

<style lang="scss" scoped></style>
