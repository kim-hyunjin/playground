<template>
  <button @click="flag = !flag">Toggle</button>
  <transition name="fade" mode="out-in">
    <h2 v-if="flag" key="1">Hello fade</h2>
    <h2 v-else key="2">Another fade</h2>
  </transition>

  <transition name="zoom">
    <h2 v-if="flag">Zoom</h2>
  </transition>

  <transition name="zoom" appear>
    <h2>Zoom amimate at first</h2>
  </transition>

  <!-- <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    @enter-cancelled="onEnterCancelled"
    @leave-cancelled="onLeaveCancelled"
    :css="false"
  >
    <h2 v-if="flag">animate with javascript</h2>
  </transition> -->

  <transition
    @before-enter="beforeEnter"
    @enter="enter2"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave2"
    @after-leave="afterLeave"
    @enter-cancelled="onEnterCancelled"
    @leave-cancelled="onLeaveCancelled"
    :css="true"
    name="fade"
  >
    <h2 v-if="flag">leave animation to css and check event with js</h2>
  </transition>

  <button @click="addItem">Add</button>
  <ul>
    <!-- https://animate.style/ -->
    <transition-group
      name="fade"
      enter-active-class="animate__animated animate__flipInX"
      leave-active-class="animate__animated animate__flipOutX"
    >
      <li v-for="(number, index) in numbers" :key="number" @click="removeItem(index)">
        {{ number }}
      </li>
    </transition-group>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      flag: false,
      numbers: [1, 2, 3, 4, 5],
    };
  },
  methods: {
    beforeEnter(el) {
      console.log('before enter', el);
    },
    enter(el, done) {
      console.log('enter', el);
      const animation = el.animate(
        [
          {
            transform: 'scale3d(0, 0, 0)',
          },
          {},
        ],
        { duration: 1000 }
      );
      animation.onFinish = () => {
        done();
      };
    },
    enter2(el) {
      console.log('enter2', el);
    },
    afterEnter(el) {
      console.log('after enter', el);
    },
    beforeLeave(el) {
      console.log('before leave', el);
    },
    leave(el, done) {
      console.log('leave', el);
      const animation = el.animate(
        [
          {},
          {
            transform: 'scale3d(0, 0, 0)',
          },
        ],
        { duration: 1000 }
      );
      animation.onFinish = () => {
        done();
      };
    },
    leave2(el) {
      console.log('leave2', el);
    },
    afterLeave(el) {
      console.log('after leave', el);
    },
    onEnterCancelled(el) {
      console.log('onEnterCancelled', el);
    },
    onLeaveCancelled(el) {
      console.log('onLeaveCancelled', el);
    },
    addItem() {
      const num = Math.floor(Math.random() * 100 + 1);
      const index = Math.floor(Math.random() * this.numbers.length);
      this.numbers.splice(index, 0, num);
    },
    removeItem(index) {
      this.numbers.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 1s linear;
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-to {
  transition: all 1s linear;
  opacity: 0;
}

.fade-move {
  transition: all 1s linear;
}

.fade-leave-active {
  position: absolute;
}
.animate__flipOutX {
  position: absolute;
}

.animate__animated {
  animation-duration: 1.5s;
}

h2 {
  width: 400px;
  padding: 20px;
  margin: 20px;
}

.zoom-enter-active {
  animation: zoom-in 1s linear forwards;
}

.zoom-leave-active {
  animation: zoom-out 1s linear forwards;
}

@keyframes zoom-in {
  from {
    transform: scale(0, 0);
  }
  to {
    transform: scale(1, 1);
  }
}
@keyframes zoom-out {
  from {
    transform: scale(1, 1);
  }
  to {
    transform: scale(0, 0);
  }
}

li {
  font-size: 22px;
  cursor: pointer;
}
</style>
