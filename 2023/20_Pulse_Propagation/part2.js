// Day 20: Pulse Propagation - Part 2
// https://adventofcode.com/2023/day/20

var pulsePropagation = function (input) {
  const { modules, inputs } = getData(input);

  const [conjunction] = Object.keys(inputs['rx']);
  const watchList = Object.keys(inputs[conjunction]).reduce((map, key) => ({ ...map, [key]: null }), {});
  const presses = solve(modules, inputs, watchList);
  const minPresses = leastCommonMultiple(...presses);
  return minPresses;

  function solve(modules, inputs, watchList) {
    const PULSE = {
      LOW_PULSE: 0,
      HIGH_PULSE: 1,
    };
    let sum = [0, 0]; // LOW, HIGH
    const queue = [];

    for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
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
          if (module === 'nc') {
            if (watchList[from] === null && pulse) {
              watchList[from] = i;
            }
          }
          for (const nextModule of to) {
            queue.push([module, nextModule, nextPulse]);
            sum[nextPulse]++;
          }
          continue;
        }
      }

      const values = Object.values(watchList);
      const finished = values.every((value) => value !== null);
      if (finished) {
        return values;
      }
    }
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

  function leastCommonMultiple(...nums) {
    const _gcd = (x, y) => (!y ? x : _gcd(y, x % y));
    const _lcm = (x, y) => (x * y) / _gcd(x, y);
    return [...nums].reduce((a, b) => _lcm(a, b));
  }
};

console.time('day-20_part-2');

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
var expected = 238815727638557;
var result = pulsePropagation(input);
console.log(result, result === expected);

console.timeEnd('day-20_part-2');
