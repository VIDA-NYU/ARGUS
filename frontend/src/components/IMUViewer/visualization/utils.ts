function computeFrameAvg(frame){
    let x_vals = 0
    let y_vals = 0
    let z_vals = 0

    for (let i = 0; i < frame.data.length; i = i + 1){
        x_vals = x_vals + frame.data[i][0]
        y_vals = y_vals + frame.data[i][1]
        z_vals = z_vals + frame.data[i][2]
    }

    return {
        x_avg: x_vals/frame.data.length,
        y_avg: y_vals/frame.data.length,
        z_avg: z_vals/frame.data.length,
        //total_avg: (x_vals/frame.data.length + y_vals/frame.data.length + z_vals/frame.data.lengt) / 3
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
        x_val: acc.x_avg / n,
        y_val: acc.y_avg / n,
        z_val: acc.z_avg / n
    }
}

function computeMovingAverage(data){
    const targetTickNum = 50;
    let interval = Math.floor(data.length / targetTickNum);
    let movingAverageData = []
    for(let i = 0; i < targetTickNum; i++){
        let keyframe = i * interval;
        let movingAverageValue = divideMovement(data.slice(keyframe, keyframe + interval * 2).map(d => d.movement).reduce(add, {
            avg: 0, x_val: 0, y_val: 0, z_val: 0
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
    let recordingName = data.pop() //need recording name to draw start-of-task lines later
    let framesAvg = []
    for (let frameIndex = 1; frameIndex < data.length; frameIndex++){
        let frameAvg = computeFrameAvg(data[frameIndex]);
        framesAvg.push(
            {
                frame: frameIndex,
                time: data[frameIndex].time,
                avg: frameAvg
            });
    }

    //let movingAvgArr = computeMovingAverage(framesAvg)
    //movingAvgArr.push(recordingName) 

    framesAvg.push(recordingName)
    return framesAvg;
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

function preprocessData(data){
    if(isEmpty(data)){
        return data;
    }
    const targetLen = 100;
    let sampleRate = Math.ceil(data.length / targetLen);
    data = sampleArray(data, sampleRate)
    //data.push({"recordingName": recordingName})
    return data;
}

function mapFunction(obj) {
    let new_obj = {}
    new_obj["timestamp"] = obj.timestamp
    new_obj["imu_values"] = obj.data[0].map((col, i) => obj.data.map(row => row[i]).reduce((acc, c) => acc + c, 0) / obj.data.length)
    return new_obj
}

function preprocessDataNew(data){
    if(isEmpty(data)){
        return data;
    }

    let start_unix_timestamp = String(data[0].timestamp).slice(0,-2)
    
    let data_processed = data.map((obj, index) => ({"timestamp": obj.timestamp, "imu_values": obj.data[0].map((col, i) => obj.data.map(row => row[i]).reduce((acc, c) => acc + c, 0) / obj.data.length)}))

    for (let i = 0; i < data_processed.length; i++) {
        let current_unix_timestamp = String(data_processed[i].timestamp).slice(0,-2)
        let sec_from_start = (parseInt(current_unix_timestamp) -parseInt(start_unix_timestamp))/1000
        data_processed[i]["sec_from_start"] = sec_from_start
    }

    return data_processed;
}

export {computeIMUActivity, isEmpty, sampleArray, preprocessData, preprocessDataNew};