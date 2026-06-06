import type { Directive } from 'vue'

export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-xl`

    if (binding.modifiers.right) {
      iconClass += ' float-right'
    } else if (binding.modifiers.left) {
      iconClass += ' float-left'
    }

    if (binding.modifiers.yellow) {
      iconClass += ' text-yellow-400'
    } else {
      iconClass += ' text-green-400'
    }

    if (binding.arg === 'full') {
      iconClass = binding.value
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
} as Directive
