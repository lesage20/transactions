<template>

    <div id='print'>
        
    </div>
</template>

<script>
export default {
    name: "Imprimer",
    props: ["content"],
    data(){

    },
    methods: {
        printdocument(){
            let toPrint = document.getElementById('print')
            toPrint.innerHTML = this.content 
            
        }
    },
    created(){
        console.log('printer page')
    }
}
</script>