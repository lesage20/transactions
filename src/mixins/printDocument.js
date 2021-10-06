const ipcRenderer = require("electron").ipcRenderer;

export default {
    data(){
        return {
            printers: [],
        }
    },
    methods: {
        printDocument(id, title){
            let content = document.getElementById(id).innerHTML
           
            ipcRenderer.send("print", content, title)
        },
        getPrinterList() {
            ipcRenderer.send("getPrinterList")
            ipcRenderer.once("getPrinterList", (event, data) => {
                //data is the printer list
                console.log("printers: ",data);
                this.printers = data
            });
        },
    },
}