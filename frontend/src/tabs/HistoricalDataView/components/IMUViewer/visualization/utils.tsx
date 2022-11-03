/*
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
*/

function computeFrameDiff(frame0, frame1){
    const x_accel_diff = frame1[0] - frame0[0]
    const y_accel_diff = frame1[1] - frame0[1]
    const z_accel_diff = frame1[2] - frame0[2]

    return {
        avg: (x_accel_diff + y_accel_diff + z_accel_diff) / 3,
        x_accel_diff: x_accel_diff,
        y_accel_diff: y_accel_diff,
        z_accel_diff: z_accel_diff
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
        x_accel_diff: acc.x_accel_diff / n,
        y_accel_diff: acc.y_accel_diff / n,
        z_accel_diff: acc.z_accel_diff / n
    }
}

function computeMovingAverage(data){
    const targetTickNum = 50;
    let interval = Math.floor(data.length / targetTickNum);
    let movingAverageData = []
    for(let i = 0; i < targetTickNum; i++){
        let keyframe = i * interval;
        let movingAverageValue = divideMovement(data.slice(keyframe, keyframe + interval * 2).map(d => d.movement).reduce(add, {
            avg: 0, x_accel_diff: 0, y_accel_diff: 0, z_accel_diff: 0
        }), data.slice(keyframe, keyframe + interval * 2).length);

        movingAverageData.push({
            frame: keyframe,
            movement: movingAverageValue
        })
    }
    return movingAverageData;
}

function computeIMUActivity(data){
    if(isEmpty(data)){
        return [];
    }
    let framesMovement = []
    for (let frameIndex = 1; frameIndex < data.length; frameIndex++){
        let frameMovement = computeFrameDiff(data[frameIndex - 1], data[frameIndex]);
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

function preprocessIfJSON(dataItem){
    if(typeof dataItem === "string") {
        return JSON.parse(dataItem)
    }else{
        return dataItem;
    }
}

function addTimestep(data){
    let dataTime = []
    for(let i = 1; i < data.length + 1; i=i+1){
        dataTime.push(data[i-1].concat(i))
    }
    return dataTime;
}

function preprocessData(data, recordingName){
    if(isEmpty(data)){
        return data;
    }
    const targetLen = 100;
    let sampleRate = Math.ceil(data.length / targetLen);
    data = sampleArray(data, sampleRate)
    let dataTime = addTimestep(data)
    dataTime.push([recordingName, recordingName, recordingName])
    return dataTime;
}

export {computeIMUActivity, isEmpty, sampleArray, preprocessData};