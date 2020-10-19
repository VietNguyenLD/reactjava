export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  export const numberWithDot = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  export const numberWithDotChange = (x) => {
   x = x.split(',').join('');
   return x;
    // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  
  // export const calculateProfit = (month, amount, profit) => {
  //   let result = 0
  
  //   result = Math.round(((((30 * month) / 365) * profit) / 100) * amount)
  
  //   return result
  // }
  
  export const calculateProfit = (day, amount, profit) => {
    let result = 0
  
    result = Math.round(((((day) / 365) * profit) / 100) * amount)
  
    return result
  }
  
  