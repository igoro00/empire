export const loadMap = (url, x,y,seacolor)=>{
    return new Promise((resolve,reject)=>{
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width=x;
        canvas.height=y;
        const img = new Image();
        img.src = url;
        img.onload = ()=>{
            canvas.width = x;
            canvas.height = y;
            context.drawImage(img, 0, 0, x,y );
            const buf = new Uint32Array(context.getImageData(0, 0, x,y).data.buffer)
            resolve(Array.from(buf).map(elem=>elem!==seacolor));
        }
    })
}