importScripts(
    "jspdf/jspdf.js",
    "jspdf/plugins/addimage.js"
);
self.addEventListener("message", function(e) {
    var images = e.data.images;
    var isMin = e.data.isMin;
    var pdf = null;
    const PAPERSIZE ={
        p:{
            width:595,
            height:842
        },
        l:{
            width:842,
            height:595
        }
        
    }
    images.forEach(function(item, index) {
        var orientation = "p";
        if(item.width > item.height){
            orientation = "l";

        }
        if(item.width>PAPERSIZE[orientation].width){
            var heightFactor = PAPERSIZE[orientation].width/item.width;
            item.width=PAPERSIZE[orientation].width;
            item.height*=heightFactor;
        }
        if(item.height>PAPERSIZE[orientation].height){
            var widthFactor = PAPERSIZE[orientation].height/item.height;
            item.height = PAPERSIZE[orientation].height;
            item.width*=widthFactor;
        } 
        
        if (index == 0) {
            pdf = new jsPDF({
                orientation: orientation,
                unit: "px",
                // format: [item.width, item.height],
                format: [PAPERSIZE[orientation].width, PAPERSIZE[orientation].height],
                compress: true
            });
            if(isMin){
                pdf.addImage(item.base64Min, "JPEG", 0, 0, item.width, item.height);
            } else {
                pdf.addImage(item.base64, "JPEG", 0, 0, item.width, item.height);
            }
        } else {
            // pdf.addPage([item.width, item.height], orientation);
            pdf.addPage([PAPERSIZE[orientation].width, PAPERSIZE[orientation].height], orientation);
            if(isMin){
                pdf.addImage(item.base64Min, "JPEG", 0, 0, item.width, item.height);
            } else {
                pdf.addImage(item.base64, "JPEG", 0, 0, item.width, item.height);
            }
        }
    });
    self.postMessage(pdf.output("datauristring"));
}, false);

