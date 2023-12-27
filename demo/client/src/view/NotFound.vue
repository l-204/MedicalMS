<template>
    <div class="NotFoundBackground">
        <div style="font-size:100px">( ._.)</div>
        <div style="font-size:60px">出错啦</div>
        <div style="font-size:30px">找不到你想要的页面，去别的地方看看吧</div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.NotFoundBackground {
    position: fixed;
    background-color: #1c64b3;
    width: 100%;
    height: 100vh;
    color: #fff;
    padding: 150px 0 0 450px;
}

.NotFoundBackground div {
    padding-bottom: 50px;
}
</style>