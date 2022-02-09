export class Person{
    constructor(tribe,idx){
        this.tribe = tribe;
        this.idx = idx;
    }
    breed(xOffset, yOffset){
        let [myX,myY] = getXYFromIdx(this.idx);
        const newIdx = getIdxFromXY((myX+xOffset).clamp(0,canvas.width-1),(myY+yOffset).clamp(0,canvas.height-1));
        if(mapBuf[newIdx] && people[newIdx]===undefined){
            people[newIdx]=new Person(this.tribe,newIdx);
        }
    }
    move(xOffset,yOffset){
        let [myX,myY] = getXYFromIdx(this.idx);
        const newIdx = getIdxFromXY((myX+xOffset).clamp(0,canvas.width-1),(myY+yOffset).clamp(0,canvas.height-1));
        if(mapBuf[newIdx] && people[newIdx]===undefined){
            people[newIdx]=this;
            people[this.idx]=undefined;
            this.idx=newIdx;
        }
    }
}