//Rendu de monnaie 
const countChange = (money, coins) =>{
  const ways = new Array(money + 1).fill(0);
  ways[0] = 1; 
  for (const coin of coins) {
    for (let i = coin; i <= money; i++) {
      ways[i] += ways[i - coin];
    }
  }
  return ways[money];
}


//FSM to TCP
function traverseTCPStates(eventList){
  const state = "CLOSED";   
  const states = { 
    CLOSED : { APP_PASSIVE_OPEN : "LISTEN", APP_ACTIVE_OPEN : "SYN_SENT" },
    LISTEN: { RCV_SYN : "SYN_RCVD", APP_SEND : "SYN_SENT", APP_CLOSE : "CLOSED" },
    SYN_RCVD: { APP_CLOSE : "FIN_WAIT_1", RCV_ACK : "ESTABLISHED" },
    SYN_SENT: { RCV_SYN : "SYN_RCVD", RCV_SYN_ACK : "ESTABLISHED", APP_CLOSE : "CLOSED" },
    ESTABLISHED: { APP_CLOSE : "FIN_WAIT_1", RCV_FIN : "CLOSE_WAIT" },
    FIN_WAIT_1: { RCV_FIN : "CLOSING", RCV_FIN_ACK : "TIME_WAIT", RCV_ACK : "FIN_WAIT_2" },
    CLOSING: { RCV_ACK : "TIME_WAIT" },
    FIN_WAIT_2: { RCV_FIN : "TIME_WAIT" },
    TIME_WAIT: { APP_TIMEOUT : "CLOSED" },
    CLOSE_WAIT: { APP_CLOSE : "LAST_ACK" },
    LAST_ACK: { RCV_ACK : "CLOSED" },
    ERROR: {}
  };

  return eventList.reduce(function(state, input) { return states[state][input] || "ERROR"; }, state);
}


// sum of digits
const findAllDigits = (sumOfDigits, digits) => {
  let firstOfDigitRange = Number('1'.repeat(digits));
  let lastOfDigitRange = Number('9'.repeat(digits));
  let range = [];
  
  for (let i = firstOfDigitRange; i <= lastOfDigitRange; i++) {
    while (i.toString().includes('0')) {
      i = i.toString().split('');
      i = i.map((el, ind) => el === '0' ? el.replace('0', i[ind-1]) : el).join('');
    }
    if (i.toString().split('').reduce((acc, curr) => acc + Number(curr), 0) === sumOfDigits) {
      range.push(i);
    }
  }

  if (range.length === 0) {
    return []
  } else if (range.length === 1) {
    return [1, range[0].toString(), range[0].toString()]
  } else {
    return [range.length, range[0].toString(), range[range.length - 1].toString()]
  }
}
