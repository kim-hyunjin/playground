function solution(bridge_length, weight, truck_weights) {
  let time = 0,
    bridge = [[0, 0]], // [무게, 시간]
    weightOnBridge = 0;

  while (bridge.length > 0 || truck_weights.length > 0) {
    if (bridge[0][1] === time) {
      weightOnBridge -= bridge.shift()[0];
    }

    if (weightOnBridge + truck_weights[0] <= weight) {
      weightOnBridge += truck_weights[0];
      bridge.push([truck_weights.shift(), time + bridge_length]);
    } else {
      if (bridge[0]) {
        time = bridge[0][1] - 1;
      }
    }
    time++;
  }
  return time;
}
