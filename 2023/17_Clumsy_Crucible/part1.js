// Day 17: Clumsy Crucible - Part 1
// https://adventofcode.com/2023/day/17

var clumsyCrucible = function (input) {
  const grid = getGrid(input);
  const rows = grid.length;
  const cols = grid[0].length;

  const startingPoint = { x: 0, y: 0 };
  const endingPoint = { x: cols - 1, y: rows - 1 };

  const dirs = { '>': [1, 0], v: [0, 1], '^': [0, -1], '<': [-1, 0] };
  const opposite = { '<': '>', '>': '<', v: '^', '^': 'v' };

  const pathToVisit = new MinHeap(
    [
      [0, '>', startingPoint],
      [0, 'v', startingPoint],
    ],
    (a, b) => a[0] - b[0]
  );
  const seen = new Set();

  while (pathToVisit.length > 0) {
    const [heat, path, { x, y }] = pathToVisit.pop();
    const key = `${x},${y},${path}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    for (const dir in dirs) {
      const [dx, dy] = dirs[dir];
      const newPoint = { x: x + dx, y: y + dy };

      // out of grid range
      if (newPoint.x < 0 || newPoint.x >= cols || newPoint.y < 0 || newPoint.y >= rows) continue;

      // path longer than 3 blocks
      if (dir === path[path.length - 1] && path.length === 3) continue;

      // turning back
      if (path[path.length - 1] === opposite[dir]) continue;

      const newDir = dir === path[path.length - 1] ? path + dir : dir;
      const newKey = `${newPoint.x},${newPoint.y},${newDir}`;

      if (seen.has(newKey)) {
        continue;
      }

      if (newPoint.x === endingPoint.x && newPoint.y === endingPoint.y) {
        return heat + grid[newPoint.y][newPoint.x];
      }

      pathToVisit.push([heat + grid[newPoint.y][newPoint.x], newDir, newPoint]);
    }
  }

  return 0;

  function getGrid(input) {
    return input.split('\n').map((line) => line.split('').map(Number));
  }
};

class MinHeap {
  constructor(data = [], compare = (a, b) => a - b) {
    this.data = data;
    this.length = this.data.length;
    this.compare = compare;

    if (this.length > 0) {
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
    }
  }

  push(item) {
    this.data.push(item);
    this.length++;
    this._up(this.length - 1);
  }

  pop() {
    if (this.length === 0) return undefined;

    const top = this.data[0];
    const bottom = this.data.pop();
    this.length--;

    if (this.length > 0) {
      this.data[0] = bottom;
      this._down(0);
    }

    return top;
  }

  peek() {
    return this.data[0];
  }

  _up(pos) {
    const { data, compare } = this;
    const item = data[pos];

    while (pos > 0) {
      const parent = (pos - 1) >> 1;
      const current = data[parent];
      if (compare(item, current) >= 0) break;
      data[pos] = current;
      pos = parent;
    }

    data[pos] = item;
  }

  _down(pos) {
    const { data, compare } = this;
    const halfLength = this.length >> 1;
    const item = data[pos];

    while (pos < halfLength) {
      let left = (pos << 1) + 1;
      let best = data[left];
      const right = left + 1;

      if (right < this.length && compare(data[right], best) < 0) {
        left = right;
        best = data[right];
      }
      if (compare(best, item) >= 0) break;

      data[pos] = best;
      pos = left;
    }

    data[pos] = item;
  }
}

console.time('day-17_part-1');

var input = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;
var expected = 102;
var result = clumsyCrucible(input);
console.log(result, result === expected);

var input = `421255121134531324434224143433234222645522263425354652265654465343546325466356326664652622552555634426222232263662453455414535421555533532144
115335113455213225154512464534444422544555235634536325456463446546565455557574772332654534352536225446456322346564565553325132355512443432135
355244523125333225432546332644522424432353444424446545656637773367534765747475377767353346466566225342546432566355543235521125113543125335514
223524152215141341522232643256424445432364224566533525564655346557745366734756474473335637454223262633526446625566662352231143345152222144332
421141232152431534123355244224326464224426235362533737536644737346333775653665545734677475333322452546446655363464565333423141243222512121532
254443245414531215134624243625645643522446553237746773464633457737375437556563434563773757733445325432222636622662436364336213543122335315322
133342114314213314525565522233455366253542357533567557573375746676354465656663443675555453756473764636464256465254635423564452112322112212245
153441335331333226224336522665662432532526664673336564346574336335554346434544463376733466537646763573232433554235353223544436443442324525112
131433342422422253262236434443323664355534365737463343676655665655676576474543635366434646654374346367425356353536244562664543334144255143133
331154541541452565532523333644554444456374773773775437476465353746663466446573336776774737676364433536636544235636563346342266463423423323545
355153332244434266363632535435446664673344667777337573453556333453535457643764644777557666667354543766766475524426455655542333456423315344333
524532431145535226556243332246226555747477765335773534643565576753467344763677534375343355564543637566646637534563264452264656533431245535533
151434125125622422665635633542364567547375373356574647437557433435553365733747564444776335456666457644736476662564553424253422465445224534252
345511533146565243523453563665255377365654464647733454745563474436577663334354764477633664534763343645673447535634626333426452223324445352442
213135415225554442532425264256445665766435663346763734457763443346555455664456663445635665346467446735354643764573455422623334545545544354441
232135535226335656236262434556657535437733334767345533477566353358447476468874434443334557353544564655577334365335546433456565552634523443114
344325124643622524352436664753373566653354753657746557564764467584646674855687457854546446637647353456355475445556766356533264224354546555142
243551344652526562245666424745333744755547633535656557566545775674466748846686446745588745575476344764665773677666574446626354452555322351542
224524235545535432263352245337467334746545345637346357757856845574484845458888746754486566473565573477553654644663367536624524642563556531442
443124325546333526542643467577463675557765774436664864648846788648745545586788748786856877844534363447563667663453356776363433323656446562221
342522434434625455553257535453777567455745643554456686668457676555756767547445545476465466746454364563346673475746454654652336353545635566232
555255556523332234363434337346364554773644473676455654554655774678768744884865456575464774844666664374745465374577333655633424234434265446621
151444326222346246622367457464563554736556556844745754786788675787547774857558645666887868664844588675746475734457634737755353265665456223245
555266354423233256254747466645674336537667668587845687876776644746457675547466648845577787454454464566336567533333546577674354534664242626263
564432554562232365457446665634563465636357577887478868574885876856457744574444778544466676755655465478753665344356577547665425366366522553366
124223354322232665744565457355473336453585547874866884664888647784478848747658476476474588676484885468564446356466777555476376325424425622326
644423455455466625363464753754334435576688656546577574666546768556665656684868448844784447584565684887677473566476575655365553633454452365362
425653534643566457456743656364656654865687866467487488648658486878587747746576564466556464777658455848846475673637663436644365424546462364433
642464526644334275665535534455776556686578846746665574858565844468575677444468475757484754478465668758455546567635673754775476335656654335624
243542326526226667754545774773444777648566876667544887485474545465599988557544487488767577488454864657467567667534454745463456674465255625564
353234523652335435545677457376545786866855555655886864545845686568796965967787596565875554685485686877546446647555735546745463554652426566443
332254365554657573454736676576667676457786488774487447466595755676865587897965676967585847558875855658846468867366635755477363537765345633326
433336326653337766453334555465348664885875475756868684468966557596766695597978988878697665687767655755775568657855735546737776663722363224654
522663252244666366443447643754884575486677655865477447799869555767859785657965578656588565684664874877654457846574656543776366564564336456553
366562664554434477535363766467457544866856474477478557888667879556789879578755876577675898567686866784755478687767647436554767354663552526246
564654266657744647664444437586578674765584448764498656599986989796769859558865856576888789768674848484565767767864747634353743355543425264222
564235645257436736446444555858644746864474586677555579997799868956999559779877965676787698699968765678587585668644647533445457367756463643333
523562446373443365664753565675875785577675544888858856785979868767855569589755596758765598776677848564575474484845477675635757465565654336436
366556222363446434644536565475464467867677755857568655699886785659876879785879666597756669657767554658475484848488564674467645466736655664623
625225465666476674434755764758567548744655879698598987766685797796795798597586879867876758959875855867486446487466566744537537636635375652533
244645356663474773345775465477558888448744675658578958695555976975596678695786556666866876897896695768555584645688686567745634676733755255243
536536633333444656545775487747887465568487786765558657585895899886997597789978579965975567856558896957845744546884487475466446547557737225653
533635457663536355344658474476847485455856698688967557986685768855995767579986589556779699679867566765745854458668688487563437636644465645453
456365437733635377554376487477766687568887796678689887578695678978756798876566595575755589698988758955664646686848765757654577766654343555442
633534464777476634636575866758865857665687557589785785967775989788988869998896965576578776886675775888985668887685875546546766636637466766245
642555633337734337436476764887746754557878666997677866667767777998669797976967968768577776688866765758669687875464587456743675673466544435465
363425375446756344564746688646864557679999655777559986755876678787799886799869866979896755656796955559769544587665656785564665667756357734642
622354757664466366645784748874784457867766765659687987568779889787876688678677766789699879676769995898995958554668557484847545544657333464436
545645574654347437738555555487475564978887985686676659797699767669696676676797799886989699986957955958688577845648484488648354535346756576323
634666574637356445474667776468676479576675668558685589978776899969987979666786679897688797759887855975577776758488578666677737363765645756345
456374666365354356545488485664477478576896789559575776867977698686787996976798678789869799557977898985859886585677765786846836447675333367555
256654544777745763358564775858464655789796598656856677987968898999666987878897698776697678988859888577857696576484877568676766346546464345733
553247336346575356577477458768587785596995587765699886799789966997998867888996887978769679675856758958665855885746487788556855647545664634346
642743537457676333774875568578887656677977989789868787669968686688667769987886669796668879776565898885856555897864585466856655533663443533576
636537677637763455754587768667678698668766597785776678868889978868799986676696696996789679797766966658765955778648688777688777776677374763332
225436674537435767477457886544588759786788679969977787799697797696998878699978966877766997886786858787559867867745668476746558755357563546342
535445656465766548848655476564749779885886757589667667989979979678896666889769969879798698867896688897795656799446887867664876664577666667673
236565467574365746855846666687445895759767955956768787789996667898868998978897699776699776776966877978895656678555557866856648536566744436467
535775374445436576474677444557558958685578785787866696688966978798987878877999666769669699768796788556956799786666475565886568673375465346747
667373644375676388858788886546865667966855567777778789696987768979998998798797797779688968866769776996556967555648466446475587676737645447547
436556453474343786865565585876566759787789999787689789866889786788898779788998889886788898886976768785869866995777455788657677776553475443654
523533746477744745876456887754899666886896785687896988997988989897777799977787778689896969699669886985587789786695465466444768474633633554777
433735357473375484487768778887968857966658777978866998677678988799989899987897987778966778689987967556857896678667445845775848566465476355465
354745776356335378878576785585965756798965658986878866878986789777977997788977778786699898696689878755698976756788684688874585754345437373476
336455743476566558558888768886798678586579859898789967769898999898987789777998878789877697768978977856567777865767874744877567657673635565767
564547366655543666848545585554696795999679777778698669966968887889797899987988979998688999978889766795856878977685448845755664744335436674447
576376443536447545885544658568558658587779659998777778879887779977889978999887878799767766976787787887688675757865745758755455846543637343364
544745536777763678476578888479877556956659787787766679978688987879777878787797997799868989866766767687887879769969688484565474844674677576437
656674655637553787648654758888755796956578898969868778668887898887887878977787788899989968868679789699989756879997867464787488454533743566536
634373355776736886557784576765575965788785567899998689897699987889797999999788989877787699699878998686885779895568654756755758553466335476545
544647553357667846647548586476796787687558679886779878889777987878898799779978797897987976686777878695787965555759575467748584685553635633445
567535336575445684444578868566776965979975586767979779876978988778989798889998777999996997799876777756579566858787455555584674773556453357445
434743577676774865684676786566788867979566567677767787989789999997788997999987978898977778689988696867888566667886484486874457685655747733534
575647737367767587476544475857956577669856666889689766676879987987989977988979789899786677886797799995799868665597556588584444867643345766565
533567774576434875645675466857856758977969987969869968968799878978979777799799898788778676888996896969678989756557478568877768687746473567336
443434575766674878784865486566675867787566558876987696897878987778879799787799777897898899666887699968856578867698484778585674555567556433635
454664547645657457647856676548796976966987886798789988779977778788897877887978879799966989898777767795669566899598465746844877574743553466435
257475377473655584486454547644566656686955688987886968969898799879797988997999897889899666686689887897789777988584558688856488453666555774573
374375355677663764486857458667598597769867568889899699766667779878977889779989987799666896669678977677785985899577455775447668545336375547673
255353444577537554455847745585768697775759888868986879776668888979797987899778777996976977786798886957895965569574888548565487864335333777535
533664665757775468548656545545596859856595559779688666798698788877777998899877777879966798977788878969559767897676584466787885667447736553353
456356553474443676446686466884798577597878977779988799879886679987987999889778999878788669987979799689555756867568845656688485775464433446437
557544567743733768754546754548596758669799778776798798897688979999987787779987787678878677979668879997685986869778886587546558655336777677565
247663557566457466575886484655888976859778557786667889778969998778997787789987796698798989767786996795796798677666688667475645853675636674774
664766376734757377764776658485459559965568978566677696876787988998979787799989669998976666886777976995879565768645588888676674673664447466577
554635364435555465455568457674457556969665557666769698677689889999998879966986897888867877767996596966878969696744467655575746564676544376375
255773544375533567456777778767586856596695669558879787877798866886697696868967997797887796698687997669889995698574586674584488354774357356655
545544674563347765644846858656476989985775569557876869896686797897866779977976677699796797669878587688677565769847678444675456644747555555436
343743444574763733558486654455786967868759799987686676898977768997866969896889986888986786779759968999596798797857748566575573634454346337744
525663645346743743478578874845856759766756668796557976768687687689997979978787799868976969968977886668668858584547885867776755635534563643552
362377743473635766765776768846764776995755595996585669989866796766977969968778986996868997875797685698688899755664477754586553765356533657536
233634754455337557474758656568784788969678687866776666878666866669789797999876768786988786697789996567675975645656545757647766346536555547756
464446563464553353556654868568557855986898889857889786877697996677988868968768779666899869577768598956896566844646758776664737366673653355362
326234645347457347477447877576785865868776797887659655698998979866767666897868768799897798659795876856687686456766657467555455343664636347343
626225565447635667658568546547867867689589997796587756966978679869899677678767667899997799868778965655966785585547666647567633644356674663433
562644567363545753368757467658644687487665986798765797797789987976796899776876767796679785789577567895765885858858748754664333367346473354455
243235444546773366375447685465585456487755589758755695978878967779687889777699798687756798595957678695596868765748464854665434646445753754243
464444337547437447446776745885858766747755769798667757656885586968769868778787798977666955665598965869787548487676877757676666775754546446353
242653435373674755574776556656667668675975968679767567676676587978897986796968667568868575678599775686587655775757647847537366374575764473535
452325574374343356576456775877758854584479889778567856798985566996868696687585659557667877695657658876546855546744676784745663547757364643622
522364355563354555467568645486576454486559997977755669776558565575979685859899999795876876587599695886684488577457565765434334365333733364533
225546463743757445535333664676887647648447989765756655985698767696659995659979856959855895655778878667784544565864467476365756574733435234636
456644334457453567666666445686576567776767575788899886788757668867666965769877787596995788965555969565854645757686646463364666543734346523555
534342325375573453346676476877848644478655556878587779698796665885677599598569769596995596859885567746484888478455687557633344346647445545653
343332424357763564753365578485674556856866754566879559768957576557678997675956866899599689885978877858868584855684546533353734775646652336563
242435433267656756543646667474575864767775677589888857997686878887958577758589578679577876697879684544675875564588877376466454444546434256562
256242322233337655776663553567465586484488854755885775698677695769898589879555696897869856779787754684654787686464856576334347453637645362435
423433542445645447455366456678758768484644486685659959778855997588978689967969697576586856588964758657547566768656536655463336473464635526354
332644433332435476543367655668787675476458788748776765856755669665878868766777875559976999578888876768477585478774345534646733367564544655546
653226642464373556774433535477458465464887667448647486688985778959685786758589566975778686445887854847476765574486777357464347644364442244452
532654562562345336536466433644348878886757575778788475678859579758695597595898757765666544885484546575644686475477677437377574575633666245455
432622622346276735374556376737738846446677478444478867665678779697575787757857567557548786647568857886766856576574347647556563564754346425362
425362465323653373463653474654456688878686774687647865744468859655555655887756668548557456477887577444567577553653434375534333466535566423323
344343252336652767743576775773756744677744774674574445555875468568485657765674785667887648484586676657854484853756537747336646375242332244252
254252532622424457673564576347336368877586784848647754788867576774787568567744784756457676545555647685647457377547775545734734665553622455533
263465655256545375353464657553545447767564686686664876657847455546444684786688756755774775874847885447775863477636355545677364465525552435325
455626343256542246433354675546444466755466466644454557567868686446786564447677645685665854484848786748658577457347443554554477256343344655223
544245444226246443656475544733357636637677688865754754775685858645548487576544558884686844855455866885685575675667363464666652356222364363536
152354264624433326265634466433645455464356868775864467847568676448578575767857887648764664875848558688767567377676347477437633334224425324532
523655254425336522564753747433533733567347648766846486546775487686857547777577555778666554865485455757466437353575446454645242556652256366465
535253425563625245554675346377644334474535347866877674477866488678674664454555664584875488756775584563646547664636747454775533426533322234633
254454523446632552524475564645644467754743376486544654768448667468646555745586645688646676458584876555547776463567574435325652362332322552354
544225234365666563223226546553574737347466634548564465446586667788444768658485447544574667767887736467445557535366766736226532565325432666334
522344326525545623266544765436554653356574446534676456746748657888844455786555644646747658664577746446675647467637757345356436445534435332534
315344654232463423333646246664753467454647346676746345645758544874645788555788646477446477666653753356556557736336633736644242633646436453232
245214246235633545226234344454556455664443636464366633546648844878447545475847587746875755363333353535736437735633556363446453622635655243433
232543465556246522655562456643774466475665447434355753646674754554446466857747844584557645356747736336634354667543746664425354236546654634514
115345324342632645625525642365445335537755446453535676446546445658547748466847636445435655537576743635334635335764625523326552345552254112451
144122354453366465325535452333445536553345467545556574437637744557343756473336673376734345646676343634755554547662432432625264253432435441511
343453251325653266264253665235644775437547563776456374663467663745336466444755664676635433337467554536657546643755556434232426442435455153323
351553215246633633422465265445442756743746453437653775347736745633376573473755546434356747454765764346465467373254652622435635433532141244433
253524111232424255263336334652523324643554354434675353647673365564456534344454656775365453753637556374755353622654553454225454445461125223334
332331155531545232255432263444362462676475573436533543745547374476466733775546566463574576454655373377535675565333443252324655464412355425455
114223345251513435264422435445335264663443364735656336435566445335657735333646375447466553337536454743443642325664663342453254666553435234322
124351244122335465426632534425425626466634546457347337656345377375766547633567477464743335736656546756353244242556354252326434532214523123245
252544132251134124625536626442466563253426463636366437355365363776744757676654565743556445645363353664356236334245233424524644421512354141442
333245112424114245466532252662664235335563253547354734377466546533745344643466466436436344334447575555442244223263532222423623144312315315244
233131323312245445556654634462432522665544534325747347374475453765775535646733533764667367647757336262665543256536365432365434421153115155254
212324141243242341514552355225445345344422636343353566454455565376736357345457776437445664376434654234235524343243253463623253145213142141413
542412235413324555521652356456554564253652333234455624645437733646665374457654663655557637624433662434435265453424552623634432224341415425444
354345422213222523445512245236255624325622555254435435356757456446675636464464443535576253654362224525232266665346633255235124354324132424545`;
var expected = 1155;
var result = clumsyCrucible(input);
console.log(result, result === expected);

console.timeEnd('day-17_part-1');
