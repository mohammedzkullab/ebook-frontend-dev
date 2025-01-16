<script setup>
import {ref} from "vue";

const props = defineProps({
    data: {
        type: Object,
        default: {}
    }
});

const emit = defineEmits(['next', 'prev'])

const getParameters = (link) => {
  let url = new URL(link)
  return (new URLSearchParams(url.search)).get('page')
}

const next = () => {
  let page = getParameters(props.data.next)
  emit('next', page)
}

const prev = () => {
  let page = getParameters(props.data.prev)
  emit('prev', page);
}
</script>

<template>
  <nav v-show="data.prev || data.next" class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 float-end" aria-label="Table navigation">
    <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
      <li>
        <Button @click="prev"
                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-graydark text-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-[#1a222c] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                :class="{'opacity-50 cursor-not-allowed': ! data.prev}"
        >
          Previous
        </Button>
      </li>
      <li>
        <Button @click="next"
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-graydark text-white hover:bg-white hover:text-graydark border border-gray-300 rounded-e-lg dark:bg-[#1a222c] dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                :class="{'opacity-50 cursor-not-allowed': ! data.next}"
        >
          Next
        </Button>
      </li>
    </ul>
  </nav>
</template>
