// Day 20: Pulse Propagation - Part 1
// https://adventofcode.com/2023/day/20

var pulsePropagation = function (input) {
  const { modules, inputs } = getData(input);
  const result = solve(modules, inputs);
  return result;

  function solve(modules, inputs) {
    const PULSE = {
      LOW_PULSE: 0,
      HIGH_PULSE: 1,
    };
    let sum = [0, 0]; // LOW, HIGH
    const queue = [];

    for (let i = 0; i < 1000; i++) {
      sum[0]++;
      queue.push(['button', 'broadcaster', PULSE.LOW_PULSE]);
      while (queue.length) {
        const [from, module, pulse] = queue.shift();
        if (module === 'output') continue;
        if (module === 'rx') continue;

        const { type, to, signal } = modules[module];
        if (module === 'broadcaster') {
          for (const m of to) {
            queue.push([module, m, pulse]);
            sum[pulse]++;
          }
          continue;
        }

        // Flip-flop modules (prefix %)
        if (type === '%' && pulse === PULSE.LOW_PULSE) {
          const nextPulse = signal ^ 1;
          modules[module].signal = nextPulse;
          for (const nextModule of to) {
            queue.push([module, nextModule, nextPulse]);
            sum[nextPulse]++;
          }
          continue;
        }

        // Conjunction modules (prefix &)
        if (type === '&') {
          inputs[module][from] = pulse;
          const nextPulse = Object.values(inputs[module]).every(Boolean) ? PULSE.LOW_PULSE : PULSE.HIGH_PULSE;
          for (const nextModule of to) {
            queue.push([module, nextModule, nextPulse]);
            sum[nextPulse]++;
          }
          continue;
        }
      }
    }

    return sum[0] * sum[1];
  }

  function getData(input) {
    const modules = {};
    const inputs = {};
    input.split('\n').forEach((line) => {
      const {
        groups: { type, from, mods },
      } = line.match(/(?<type>[%&]?)(?<from>.+) -> (?<mods>.+)/);
      const to = mods.split(', ');
      modules[from] = { type, to, signal: 0 };
      to.forEach((m) => {
        inputs[m] ??= {};
        inputs[m][from] = 0;
      });
    });

    return { modules, inputs };
  }
};

console.time('day-20_part-1');

var input = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;
var expected = 32000000;
var result = pulsePropagation(input);
console.log(result, result === expected);

var input = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;
var expected = 11687500;
var result = pulsePropagation(input);
console.log(result, result === expected);

var input = `%ls -> gl
%rz -> vm, gl
broadcaster -> rz, fp, kv, fd
%ql -> bn
%bm -> hr, fj
%fp -> cc, gk
&lk -> nc
%xg -> gl, mz
%dg -> gk, mp
%zg -> ls, gl
%lg -> hr
%pt -> lg, hr
%sp -> mj
%ms -> gl, hx
%kj -> fl, gk
%bn -> rj, gk
%xc -> vq
%fl -> gk
%dh -> hr, nm
%jk -> gk, dg
%tf -> cb
%kd -> cm, nr
&hr -> hh, kv, xl, qq
%kv -> xr, hr
%hq -> ql
&fn -> nc
%vm -> gl, xn
%jh -> nr, kd
%mz -> dd
%tp -> hq
%cf -> nr
%gr -> jh
%jd -> hr, bm
%xr -> qq, hr
%cm -> nr, cf
&fh -> nc
%rb -> xl, hr
&nc -> rx
%mp -> gk, kj
&nr -> fd, gr, fn, cb, tf, xc, vq
&gl -> fh, xn, sp, mz, rz, mj, dd
%rj -> jk
&hh -> nc
%fd -> nr, df
&gk -> lk, tp, fp, ql, hq, rj
%fj -> pt, hr
%qq -> dh
%df -> nr, nv
%mj -> ms
%xn -> xg
%cc -> gk, tp
%nm -> rb, hr
%dd -> sp
%vq -> gr
%cb -> xc
%nv -> tf, nr
%xl -> jd
%hx -> gl, zg`;
var expected = 1020211150;
var result = pulsePropagation(input);
console.log(result, result === expected);

console.timeEnd('day-20_part-1');
