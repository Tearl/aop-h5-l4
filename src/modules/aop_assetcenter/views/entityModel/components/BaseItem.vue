<template functional>
  <p>
    <span class="label">{{ props.label }}</span
    ><span class="value">{{ props.value || "/" }}</span>
  </p>
</template>
<style lang="scss" scoped>
p {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  line-height: 2.4;
  flex-shrink: 0;
}
.label {
  color: #555;
  width: 100px;
  text-align: right;
}
.value {
  color: #1b1d1d;
  flex: 1;
  word-wrap: break-word;
  word-break: break-all;
}
</style>

