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
