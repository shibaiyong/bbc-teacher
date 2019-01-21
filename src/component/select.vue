
<template>
    <div class="home" v-cloak>
        <div class="menu">
            <p>下拉菜单</p>
            <div class="main" v-clickoutside="handleClose">
                <button @click="show = !show">点击显示下拉菜单</button>
                <div class="dropdown" v-show = "show" @click="show=false"> 
                    <p>下拉框的内容,点击外面区域可以关闭</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'selectt',
    data() {
        return {
            show:false
        }
    },
    methods:{
    // 下拉菜单 
        handleClose(){
            this.show = false
        }
    },
    //自定义指令clickoutside绑定了一个函数handleClose用来关闭菜单
    directives:{
        clickoutside:{
            bind:function(el,binding,vnode){
                function documentHandler(e){
                    if(el.contains(e.target)){
                        //console.log('lalalalla')
                        return false
                    }
                    if(binding.expression){
                        //console.log(typeof binding.value)
                        binding.value(e)
                    }
                    // console.log(e.target)
                    // console.log(el)
                    // console.log('hahahah')
                }
                el._vueClickOutside_ = documentHandler;
                document.addEventListener('click',documentHandler)
            },
            unbind:function(el,binding){
                document.removeEventListener('click',el._vueClickOutside_)
                delete el._vueClickOutside_
            }
        }
    }
    
};
</script>
<style scoped>
    
    [v-cloak] {
        display: none;
    }
    table {
        border: 1px solid #e9e9e9;
        border-collapse: collapse;
        border-spacing: 0;
        empty-cells: show;
    }
    th,
    td {
        padding: 8px 16px;
        border: 1px solid #e9e9e9;
        text-align: left;
    }
    th {
        background: #f7f7f7;
        color: #5c6b77;
        font-weight: 600;
        white-space: nowrap;
    }
    .menu{
        border: 1px solid #ccc;
    }
</style>
