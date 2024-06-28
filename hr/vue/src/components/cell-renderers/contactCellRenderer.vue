<script setup>
import { computed } from "vue";

const { params } = defineProps(["params"]);

const emailName = computed(() => {
  return params.data.orgHierarchy.at(-1).toLowerCase().replace(" ", ".");
});
</script>

<template>
  <div class="contactCell">
    <div class="iconContainer">
      <button class="button-secondary">
        <a
          href="https://www.linkedin.com/company/ag-grid/"
          target="_blank"
          rel="noopener noreferrer"
          class="iconLink"
        >
          <img class="icon" src="/example/hr/linkedin.svg" alt="linkedin" />
        </a>
      </button>
      <button class="button-secondary">
        <a :href="`mailto:${emailName}@company.com`" class="iconLink">
          <img class="icon" src="/example/hr/email.svg" alt="email" />
        </a>
      </button>
    </div>
  </div>
</template>

<style>
.icon {
  height: 16px;
  width: 16px;
  padding-top: 1px;
}

.iconContainer button {
  margin: 8px;
  width: 24px;
}

.iconLink {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
