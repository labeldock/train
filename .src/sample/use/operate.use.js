import { operate } from '../../src';

const op = operate({
  limitOutput:1,
  input:({ entry, output })=>{
    output(entry)
  },
  output:({ entry })=>{
    console.log('entry',entry);
  }
});

op.push(1);
op.push(2);
op.push(3);