function solution(bridge_length, weight, truck_weights) {
  var answer = 0;
  const trucks = truck_weights.slice();
  const passed = [];
  const bridge = [];
  let bridgeWeight = 0;
  for (let i = 0; i < bridge_length; i++) {
    bridge[i] = 0;
  }
  for (;;) {
    answer += 1;
    let passedTruck = bridge.shift();
    bridge[bridge_length - 1] = 0;
    if (passedTruck != 0) {
      bridgeWeight -= passedTruck;
      passed.push(passedTruck);
    }

    if (trucks[0]) {
      if (bridgeWeight + trucks[0] <= weight) {
        bridgeWeight += trucks[0];
        bridge[bridge_length - 1] = trucks.shift();
      }
    }

    if (passed.length == truck_weights.length) {
      break;
    }
  }

  return answer;
}

function main() {
  console.log(solution(2, 10, [7, 4, 5, 6]));
}
main();
