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
    return framesMovement
}

export {computeHandsActivity, isEmpty};