<template></template>
<a @click="handleClick">新页面打开</a>
<iframe class="reg" src="https://c.runoob.com/front-end/854/" frameborder="0"></iframe>


<script setup>
function handleClick() {
	window.open('https://c.runoob.com/front-end/854/')
}
</script>

<style>
a {
	cursor: pointer;
}
.reg {
	width: 100%;
	height: 800px;
}
</style>

