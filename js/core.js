/* Ubuntu Bible — data registry. Content files call UB.sec({...}); tools.js fills UB.T */
window.UB = {
  VERSION: '1.9.0',
  S: [],
  T: {},
  sec(s) { this.S.push(s); },
  tools(map) { Object.assign(this.T, map); },
  add(id, cards) { const s = this.S.find(x => x.id === id); if (s) s.cards.push(...cards); else console.warn('UB.add: unknown section ' + id); }
};
