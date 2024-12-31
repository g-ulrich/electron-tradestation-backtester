class DataFrame {
    constructor(bars) {
      this.columns = Object.keys(bars[0]);
      this.bars = bars;
      this.data = {};
      this.columns.forEach((col)=>{this.data[col] = bars.map(row => row[col]);});
    }

    length(){
        return this.bars.length;
    }

    getRow(index) {
        return this.bars[index];
      }

    getRowRange(startIndex, endIndex) {
    if (startIndex < 0 || endIndex >= this.length()) {
        throw new Error("Invalid range: start index must be non-negative and end index must be less than dataframe length");
    }
    
    const data = [];
    this.columns.forEach((col, i)=>{
        data[col] = this.data[col].slice(startIndex, endIndex + 1);
    });
    return data;
    }
  }

  class DataFramePlus {
    constructor(df){
        this.df = df;
        this.data = this.df.data;
    }
    lastbar(key){
        return this.data[key][this.df.length -1];
    }
  }

  module.exports = {DataFrame: DataFrame, DataFramePlus: DataFramePlus};