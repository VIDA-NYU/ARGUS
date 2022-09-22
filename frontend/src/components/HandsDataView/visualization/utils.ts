function computeFrameJointMovement(frameJoint0, frameJoint1){
    let xMovement = frameJoint1.pose.position.x - frameJoint0.pose.position.x;
    let yMovement = frameJoint1.pose.position.y - frameJoint0.pose.position.y;
    let zMovement = frameJoint1.pose.position.z - frameJoint0.pose.position.z;
    let distance = Math.sqrt(xMovement * xMovement + yMovement * yMovement + zMovement * zMovement);
    return distance;
}

function computeFrameHandMovement(frameHand0, frameHand1){

    let accMovement = 0
    for (let jointIndex = 0; jointIndex < frameHand0.items.length; jointIndex++){
        let jointMovement = computeFrameJointMovement(frameHand0.items[jointIndex], frameHand1.items[jointIndex])
        accMovement += jointMovement
    }
    let avgMovement = accMovement / frameHand0.items.length;
    return avgMovement;

}


function computeFrameMovement(frame0, frame1){
    let leftMovement = computeFrameHandMovement(frame0.left, frame1.left);
    let rightMovement = computeFrameHandMovement(frame0.right, frame1.right);
    return {
        avg: (leftMovement + rightMovement) / 2,
        left: leftMovement,
        right: rightMovement
    }

}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


function add(accumulator, a) {
    return {
        avg: accumulator.avg + a.avg,
        left: accumulator.left + a.left,
        right: accumulator.right + a.right
    }
}

function divideMovement(acc, n){
    return {
        avg: acc.avg / n,
        left: acc.left / n,
        right: acc.right / n
    }
}

function computeMovingAverage(data){
    const targetTickNum = 50;
    let interval = Math.floor(data.length / targetTickNum);
    let movingAverageData = []
    for(let i = 0; i < targetTickNum; i++){
        let keyframe = i * interval;
        let movingAverageValue = divideMovement(data.slice(keyframe, keyframe + interval * 2).map(d => d.movement).reduce(add, {
            avg: 0, left: 0, right: 0
        }), data.slice(keyframe, keyframe + interval * 2).length);

        movingAverageData.push({
            frame: keyframe,
            movement: movingAverageValue
        })
    }
    return movingAverageData;
}

function computeHandsActivity(data){
    if(isEmpty(data)){
        return [];
    }
    let framesMovement = []
    for (let frameIndex = 1; frameIndex < data.length; frameIndex++){
        let frameMovement = computeFrameMovement(data[frameIndex - 1], data[frameIndex]);
        framesMovement.push(
            {
                frame: frameIndex,
                movement: frameMovement
            });
    }
    return computeMovingAverage(framesMovement);
}

function sampleArray(data, sampleRate){
    let sampledArray = []
    for(let i = 0; i < data.length; i=i+sampleRate){
        sampledArray.push(data[i])
    }
    return sampledArray;
}

export {computeHandsActivity, isEmpty, sampleArray};