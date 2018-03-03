<template>
    <p>orderInfo</p>
</template>

<script>
    export default {
        name: "",
      mounted:function () {
        this.$nextTick(function () {
          var self=this;
          this.$ajax.get('/getMenuInfo')
            .then(function(response){
              console.log(response);
            });
        })

      },
    }
</script>

<style scoped>

</style>
