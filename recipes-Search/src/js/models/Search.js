import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key ='1cc169cd69294c6a33d5b0c2c270c49f';
    const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
    this.result = res.data.recipes;
    //console.log(this.result);
  }
}
