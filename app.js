(() => {
  'use strict';

  const CARDS = window.CARDS;
  const ART = window.ART;
  const byN = (n) => CARDS[n - 1];

  /* 그랑 타블로의 36개 자리(하우스). n번 자리는 n번 카드의 집이다. [주제, 설명] */
  const HOUSES = [null,
    ['소식·움직임', '새로 들어오는 소식과 곧 다가올 일. 이 자리의 카드가 가장 먼저 움직입니다.'],
    ['작은 행운', '뜻밖의 기회와 가벼운 행운이 숨어 있는 곳입니다.'],
    ['이동·먼 곳', '여행, 이동, 해외처럼 넓혀 가고 싶은 영역입니다.'],
    ['가정·기반', '집과 가족, 사생활, 삶의 바탕이 되는 곳입니다.'],
    ['건강·뿌리', '몸과 마음의 건강, 오랜 시간 자라 온 것을 보여 줍니다.'],
    ['혼란', '아직 흐릿하고 불확실해서 헷갈리는 부분입니다.'],
    ['유혹·경쟁', '돌아가는 길, 조심해야 할 사람이나 욕망이 드러나는 곳입니다.'],
    ['끝맺음', '끝나 가는 것, 이제 내려놓아야 할 것입니다.'],
    ['기쁨·선물', '호의와 축하, 기쁜 일이 들어오는 곳입니다.'],
    ['단절·결단', '갑자기 잘려 나가는 것, 결단이 필요한 곳입니다.'],
    ['갈등·반복', '다툼과 되풀이되는 문제가 있는 곳입니다.'],
    ['대화·걱정', '오가는 말과 소문, 마음을 졸이게 하는 일입니다.'],
    ['새 시작', '이제 막 시작한 것, 아직 작고 서툰 것입니다.'],
    ['일·경계', '직장과 업무, 그리고 경계해야 할 속임수입니다.'],
    ['힘·재정', '권력과 재정, 나를 지켜 주거나 누르는 윗사람입니다.'],
    ['희망·목표', '바라보고 있는 꿈과 길잡이가 되는 것입니다.'],
    ['변화', '달라지는 것, 옮겨 가는 것입니다.'],
    ['친구·신뢰', '믿을 수 있는 사람과 우정, 도움의 손길입니다.'],
    ['공적인 일·고독', '기관과 조직, 공적인 일, 혼자 있는 시간입니다.'],
    ['사람들·모임', '대외 활동과 모임, 남들 눈에 비치는 모습입니다.'],
    ['장애물', '가로막고 늦추는 것, 넘어야 할 산입니다.'],
    ['선택', '갈라지는 길, 결정해야 하는 일입니다.'],
    ['손실·스트레스', '조금씩 새어 나가는 것, 갉아먹는 걱정입니다.'],
    ['사랑·감정', '마음이 향하는 곳, 사랑과 애정입니다.'],
    ['약속·계약', '관계의 묶임, 계약과 책임입니다.'],
    ['비밀·배움', '아직 드러나지 않은 것, 공부와 지식입니다.'],
    ['문서·연락', '서류와 메시지, 주고받는 연락입니다.'],
    ['남자', '남성 질문자 본인, 또는 삶에 영향을 주는 남자의 자리입니다.'],
    ['여자', '여성 질문자 본인, 또는 삶에 영향을 주는 여자의 자리입니다.'],
    ['평화·성숙', '오랜 시간과 경험, 차분한 만족입니다.'],
    ['성공·활력', '가장 밝게 빛나는 곳, 성공과 에너지입니다.'],
    ['감정·인정', '무의식과 감정, 남들에게 받는 인정과 명성입니다.'],
    ['해결책', '문제를 푸는 열쇠, 확실해지는 것입니다.'],
    ['돈·사업', '돈의 흐름과 사업, 풍요입니다.'],
    ['안정·정착', '오래 붙들고 있는 것, 직업과 정착입니다.'],
    ['짐·숙명', '짊어지고 가야 하는 것, 피하기 어려운 시련입니다.']
  ];

  const gtGrid = [0, 1, 2, 3].map((r) => Array.from({ length: 9 }, (_, c) => r * 9 + c + 1));
  const gtPositions = {};
  for (let n = 1; n <= 36; n++) gtPositions[n] = [`${byN(n).ko}의 집`, HOUSES[n][1]];

  /* 스프레드. grid: 자리 번호를 놓은 모양(0은 빈칸). 뽑는 순서 = 자리 번호 순서.
   * positions: 자리 번호 → [이름, 설명]. combos: [[자리들], 묶어 읽는 뜻] */
  const SPREADS = {
    one: {
      name: '1카드', sub: '한 장의 답', count: 1, grid: [[1]],
      intro: '오늘의 메시지, 즉답이 필요한 질문, YES or NO를 물을 때.',
      how: '질문을 분명하게 정하고 한 장을 뽑습니다. 카드의 기본 상징에 질문의 맥락을 더해 읽고, YES or NO 질문이라면 카드의 긍정·부정으로 답을 가늠합니다.',
      positions: { 1: ['답 · 메시지', '질문에 대한 답이자 지금 알아야 할 핵심입니다. 긍정 카드면 YES, 부정 카드면 NO 쪽으로 읽습니다.'] },
      combos: []
    },
    two: {
      name: '2카드', sub: '체인 한 쌍', count: 2, grid: [[1, 2]],
      intro: '두 장을 이어 한 문장으로. 1카드보다 조금 더 자세한 답이 필요할 때.',
      how: '레노먼드의 기본인 체인 읽기입니다. 왼쪽 카드가 뼈대, 오른쪽 카드가 살입니다. 질문에 따라 두 자리를 원인–결과, 조언–결과, 나–상대로 바꿔 읽어도 좋습니다.',
      positions: {
        1: ['중심 의미', '문장의 주어가 되는 카드입니다. 질문의 주제, 일이 벌어지는 바탕을 말합니다.'],
        2: ['수식 · 설명', '1번 카드를 꾸며 주는 카드입니다. 그 일이 어떤 모습으로, 어느 쪽으로 흘러가는지 정합니다.']
      },
      combos: [[[1, 2], '두 장을 이어 한 문장으로 읽습니다']]
    },
    three: {
      name: '3카드', sub: '가장 많이 쓰는 배열', count: 3, grid: [[1, 2, 3]],
      intro: '가운데 카드를 중심으로 양옆을 읽습니다. 데일리 리딩과 긍정·부정 판단에 두루 좋습니다.',
      how: '홀수로 펼치는 까닭은 가운데 카드를 중심으로 읽기 위해서입니다. 1번과 2번을 잇고, 다시 2번과 3번을 이어 한 흐름으로 만듭니다.',
      positions: {
        1: ['과거 · 원인', '지금 상황이 만들어진 배경, 여기까지 오게 한 일입니다.'],
        2: ['현재 · 중심', '질문의 한가운데입니다. 양옆 카드가 이 카드를 꾸며 줍니다.'],
        3: ['미래 · 결과', '이대로 흘러갈 때 닿게 될 곳입니다. 답의 긍정·부정은 이 카드가 크게 좌우합니다.']
      },
      combos: [[[1, 2], '지금 상황이 만들어진 흐름'], [[2, 3], '앞으로 이어질 흐름']]
    },
    five: {
      name: '5카드', sub: '한 줄 스토리', count: 5, grid: [[1, 2, 3, 4, 5]],
      intro: '과거에서 미래까지 원인–과정–결과를 한 줄로 읽는 스토리형 배열.',
      how: '왼쪽에서 오른쪽으로 이야기처럼 읽습니다. 3번이 중심이고, 왼쪽 두 장이 원인, 오른쪽 두 장이 결과입니다. 양 끝과 안쪽 카드를 짝지어 한 번 더 읽으면 깊이가 생깁니다.',
      positions: {
        1: ['먼 원인', '이야기의 출발점. 일이 시작된 뿌리입니다.'],
        2: ['가까운 원인', '중심 카드 바로 앞에서 상황을 만든 일입니다.'],
        3: ['중심', '문제의 한가운데이자 질문자의 지금 상태입니다.'],
        4: ['전개', '중심에서 이어져 곧 벌어질 일입니다.'],
        5: ['결과', '흐름이 끝내 닿는 곳입니다.']
      },
      combos: [
        [[1, 2], '3번 카드의 원인'],
        [[4, 5], '결과'],
        [[1, 5], '전체 리딩의 요약'],
        [[2, 4], '주제의 성격을 더 깊이 묘사']
      ]
    },
    cross: {
      name: '십자 스프레드', sub: '핵심과 주변 영향', count: 5, grid: [[0, 4, 0], [1, 2, 3], [0, 5, 0]],
      intro: '가운데 카드를 두고 좌우로 시간, 위아래로 의식과 무의식을 읽습니다.',
      how: '중심–영향–방향–결과를 한눈에 보는 배열입니다. 복잡한 질문보다 “지금 상황의 핵심은?”, “앞으로의 흐름은?” 같은 한 가지 질문에 잘 맞습니다. 가로줄(1–2–3)은 시간의 흐름, 세로줄(4–2–5)은 마음의 겉과 속입니다.',
      positions: {
        1: ['과거 · 동기', '왼쪽. 이 일이 시작된 계기와 지나온 일입니다.'],
        2: ['상황 · 핵심', '가운데. 질문의 중심이자 지금의 상황입니다.'],
        3: ['미래 · 결과', '오른쪽. 앞으로 펼쳐질 방향과 결과입니다.'],
        4: ['생각 · 계획', '위. 머리로 알고 있는 것, 겉으로 드러난 생각과 계획입니다.'],
        5: ['무의식', '아래. 스스로도 잘 모르는 속마음, 바닥에 깔린 진짜 바탕입니다.']
      },
      combos: [
        [[1, 2], '여기까지 온 흐름'],
        [[2, 3], '앞으로의 흐름'],
        [[4, 2], '생각이 상황에 미치는 영향'],
        [[2, 5], '상황 밑에 깔린 속마음']
      ]
    },
    nine: {
      name: '9카드 (3×3)', sub: '미니 그랑 타블로', count: 9, grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      intro: '가로·세로·대각선으로 겹쳐 읽는 입체적인 배열. 연애·금전·일·관계 어디에나.',
      how: '5번이 중심입니다. 한 자리가 가로줄과 세로줄에 동시에 속하므로, 예를 들어 1번은 ‘과거’이면서 ‘생각’입니다. 줄 단위로 세 장씩 이어 읽은 뒤 대각선으로 주제의 성질을 확인합니다.',
      positions: {
        1: ['생각 × 과거', '예전부터 품어 온 생각, 일의 계기에 대한 인식입니다.'],
        2: ['생각 · 의식', '지금 머릿속을 차지한 것. 동기와 계획, 걱정입니다.'],
        3: ['생각 × 미래', '앞날에 대해 기대하거나 염려하는 것입니다.'],
        4: ['과거', '사건의 동기와 계기. 중심 카드 바로 앞의 일입니다.'],
        5: ['중심', '질문의 핵심 테마. 모든 줄이 이 카드를 지납니다.'],
        6: ['미래', '가능한 결과. 중심 카드에서 이어질 일입니다.'],
        7: ['무의식 × 과거', '오래된 감정의 뿌리, 과거에서 온 바탕입니다.'],
        8: ['감정 · 무의식', '근본이 되는 것. 상황을 밑에서 받치는 감정입니다.'],
        9: ['무의식 × 미래', '감정이 끝내 향하는 곳, 바닥에서 자라는 결과입니다.']
      },
      combos: [
        [[1, 2, 3], '생각·의식의 영역 (동기, 계획, 걱정)'],
        [[7, 8, 9], '감정·무의식의 영역 (근본, 바탕)'],
        [[1, 4, 7], '과거, 사건의 동기나 계기'],
        [[3, 6, 9], '미래, 가능한 결과'],
        [[1, 5, 9], '중심 테마의 성질'],
        [[3, 5, 7], '중심 테마의 성질']
      ]
    },
    gt: {
      name: '그랑 타블로', sub: '36장 전체', count: 36, grid: gtGrid, auto: true,
      intro: '36장을 모두 펼쳐 삶 전체의 지도를 봅니다. 자리마다 ‘집’의 의미가 있습니다.',
      how: '9장씩 4줄로 36장을 모두 펼칩니다. 먼저 질문자 카드(여자 29 · 남자 28)를 찾고, 그 카드를 기준으로 방향을 읽습니다. 그다음 궁금한 주제의 카드(사랑은 심장, 돈은 물고기, 일은 여우)가 어느 집에 앉았는지 봅니다.',
      rules: [
        ['질문자 카드의 왼쪽', '같은 줄의 왼쪽 카드들은 지나온 일입니다. 가까울수록 최근입니다.'],
        ['질문자 카드의 오른쪽', '같은 줄의 오른쪽 카드들은 다가올 일입니다. 가까울수록 곧 일어납니다.'],
        ['질문자 카드의 위', '같은 칸 위쪽 카드들은 머릿속 생각, 의식하고 있는 것입니다.'],
        ['질문자 카드의 아래', '같은 칸 아래쪽 카드들은 무의식, 발 딛고 있는 현실입니다.'],
        ['맞닿은 카드', '둘러싼 여덟 장은 지금 가장 가깝게 영향을 주는 것입니다. 멀수록 영향이 옅습니다.'],
        ['첫 세 장', '1·2·3번 자리의 카드는 이번 타블로의 주제를 알려 줍니다.'],
        ['네 모서리', '1·9·28·36번 자리의 카드는 전체를 감싸는 틀입니다.'],
        ['집(하우스)', 'n번 자리는 n번 카드의 집입니다. 그 집의 주제 위에 놓인 카드가 올라탑니다. 자기 집에 앉은 카드는 뜻이 강해집니다.']
      ],
      positions: gtPositions,
      combos: []
    }
  };

  const TONE = { pos: '긍정', neu: '중립', neg: '부정' };
  const ASPECTS = [['health', '건강'], ['solo', '솔로'], ['couple', '커플'], ['money', '금전'], ['work', '직장'], ['person', '인물'], ['timing', '시기']];

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* 치우침 없는 난수 (0 이상 n 미만) */
  function rand(n) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / n) * n;
    do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % n;
  }
  function shuffled(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ── 그림 ─────────────────────────── */
  function faceHTML(c) {
    return `<span class="face"><svg class="card-art tone-${c.tone}" viewBox="0 0 120 200" role="img" aria-label="${esc(c.ko)} 카드">` +
      '<rect class="c-bg" width="120" height="200"/><rect class="c-frame" x="6" y="6" width="108" height="188" rx="5"/>' +
      `<text class="c-num" x="60" y="28">${c.n}</text><circle class="c-tone" cx="60" cy="37" r="2"/>` +
      `<g class="c-icon" transform="translate(13 46) scale(.94)">${ART[c.n]}</g>` +
      `<text class="c-ko" x="60" y="166">${esc(c.ko)}</text><text class="c-en" x="60" y="181">${esc(c.en.toUpperCase())}</text></svg></span>`;
  }

  const BACK_SVG = '<svg class="back-art" viewBox="0 0 100 166" preserveAspectRatio="none" aria-hidden="true">' +
    '<rect class="b-ground" width="100" height="166"/>' +
    '<rect class="b-frame" x="5" y="5" width="90" height="156" rx="4"/>' +
    '<circle class="b-ring" cx="50" cy="83" r="30"/>' +
    '<path class="b-star" d="M50 55L54 79L78 83L54 87L50 111L46 87L22 83L46 79Z"/>' +
    '<path class="b-dot" d="M22 30l1.5 4.5 4.5 1.5-4.500 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5zM80 128l1.2 3.6 3.600 1.2-3.600 1.2-1.2 3.6-1.2-3.6-3.600-1.2 3.600-1.2z"/>' +
    '</svg>';

  /* ── 체인 ─────────────────────────── */
  const isPerson = (n) => n === 28 || n === 29;
  /* a가 앞, b가 뒤인 체인을 찾는다. 없으면 순서를 뒤집어 찾고 reversed 표시. */
  function findChain(a, b) {
    const hit = (x, y) => (x.chains || []).find((ch) => ch[0] === y.n || (ch[0] === 0 && isPerson(y.n)));
    const f = hit(a, b);
    if (f) return { kind: f[1], text: f[2], reversed: false };
    const r = hit(b, a);
    return r ? { kind: r[1], text: r[2], reversed: true } : null;
  }
  const partnerName = (n) => (n === 0 ? '인물(남자·여자)' : byN(n).ko);

  /* ── 해설 조각 ─────────────────────── */
  function tagsHTML(c) {
    return `<div class="tags"><span class="tag tone-${c.tone}">${TONE[c.tone]} 카드</span>` +
      (c.tone === 'neu' ? '<span class="tag">주변 카드 영향</span>' : '') +
      (c.n === 2 || c.n === 31 ? '<span class="tag">부정 카드 완화</span>' : '') + '</div>';
  }
  function chainsHTML(c) {
    if (!c.chains || !c.chains.length) return '';
    return '<details class="chains"><summary>체인 예시</summary><ul>' + c.chains.map((ch) =>
      `<li><span class="dot tone-${ch[1]}"></span><b>${esc(c.ko)} + ${esc(partnerName(ch[0]))}</b>${esc(ch[2])}</li>`).join('') + '</ul></details>';
  }
  function bodyHTML(c) {
    return tagsHTML(c) +
      `<div><p class="sub">키워드</p><ul class="kw">${c.kw.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` +
      (c.note ? `<p class="kw-note">${esc(c.note)}</p>` : '') + '</div>' +
      '<div><p class="sub">주제별 풀이</p><dl class="aspects">' +
      ASPECTS.filter(([k]) => c[k]).map(([k, label]) => `<dt>${label}</dt><dd>${esc(c[k])}</dd>`).join('') + '</dl></div>' +
      chainsHTML(c);
  }
  function titleHTML(c, id) {
    return `<h3${id ? ` id="${id}"` : ''}><b class="num">${c.n}</b>${esc(c.ko)} <span>${esc(c.en)}</span></h3>`;
  }
  function readingHTML(posLine, c, extra) {
    return `<div class="reading-card">${faceHTML(c)}</div>` +
      `<div class="reading-body">${posLine}${titleHTML(c)}${extra || ''}${bodyHTML(c)}</div>`;
  }
  function dialogHTML(c) {
    return `<div class="dialog-head"><div class="reading-card">${faceHTML(c)}</div><div>${titleHTML(c, 'dialogTitle')}` +
      `<p class="house-line">그랑 타블로 ${c.n}번 자리 · ${esc(HOUSES[c.n][0])}</p></div></div>` +
      `<div class="dialog-sections">${bodyHTML(c)}</div>`;
  }

  /* ── 스프레드 도식 · 자리 안내 ───────── */
  function miniHTML(s) {
    const cols = s.grid[0].length;
    const tiny = s.count > 9;
    const cells = s.grid.map((row, r) => row.map((p, c) =>
      (p ? `<i style="grid-area:${r + 1}/${c + 1}">${tiny ? '' : p}</i>` : '')).join('')).join('');
    return `<span class="mini${tiny ? ' is-tiny' : ''}" style="grid-template-columns:repeat(${cols},auto)" aria-hidden="true">${cells}</span>`;
  }
  function guideBodyHTML(s) {
    let html = `<p class="how">${esc(s.how)}</p>`;
    if (s.rules) {
      html += '<dl class="pos-list">' + s.rules.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('') + '</dl>' +
        '<details class="houses"><summary>36개 자리(집)의 의미 모두 보기</summary><ol class="house-list">' +
        HOUSES.slice(1).map((h, i) => `<li><b>${i + 1}</b><strong>${esc(byN(i + 1).ko)}의 집 · ${esc(h[0])}</strong><span>${esc(h[1])}</span></li>`).join('') +
        '</ol></details>';
      return html;
    }
    html += '<dl class="pos-list">' + Object.keys(s.positions).map((p) =>
      `<dt><b>${p}</b>${esc(s.positions[p][0])}</dt><dd>${esc(s.positions[p][1])}</dd>`).join('') + '</dl>';
    if (s.combos.length) {
      html += '<p class="sub">묶어 읽기</p><ul class="combo-list">' + s.combos.map(([ps, label]) =>
        `<li><b>${ps.map((p) => p + '번').join(' + ')}</b>${esc(label)}</li>`).join('') + '</ul>';
    }
    return html;
  }

  /* ── 함께 읽기 ─────────────────────── */
  function tallyHTML(cards) {
    const count = { pos: 0, neu: 0, neg: 0 };
    cards.forEach((c) => { count[c.tone]++; });
    return { count, html: `<p class="tally"><span class="tone-pos">긍정 ${count.pos}</span><span class="tone-neu">중립 ${count.neu}</span><span class="tone-neg">부정 ${count.neg}</span></p>` };
  }
  function chainLine(a, b) {
    const ch = findChain(a, b);
    if (!ch) return '';
    return `<span class="chain-hit"><span class="dot tone-${ch.kind}"></span>${esc(ch.text)}` +
      (ch.reversed ? ` <em>(${esc(b.ko)}+${esc(a.ko)} 순서의 체인)</em>` : '') + '</span>';
  }
  function togetherHTML(s, at) {
    const cards = Object.keys(s.positions).map((p) => at[p]);
    if (s.count === 1) {
      const c = cards[0];
      const verdict = { pos: ['YES', '긍정 카드입니다. YES or NO 질문이라면 답은 YES 쪽입니다.'], neg: ['NO', '부정 카드입니다. YES or NO 질문이라면 답은 NO 쪽입니다.'], neu: ['—', '중립 카드입니다. YES도 NO도 아닌, 상황과 내 행동에 달린 답입니다. 한 장을 더 뽑아 이어 읽어도 좋습니다.'] }[c.tone];
      return `<h3>한 장의 답</h3><p class="verdict tone-${c.tone}"><b>${verdict[0]}</b>${esc(verdict[1])}</p>`;
    }
    const t = tallyHTML(cards);
    const lines = [];
    if (t.count.pos > t.count.neg) lines.push('긍정 카드가 더 많습니다. 전체 흐름은 밝은 쪽으로 기울어 있습니다.');
    else if (t.count.neg > t.count.pos) lines.push('부정 카드가 더 많습니다. 서두르기보다 걸림돌이 무엇인지 먼저 살필 때입니다.');
    else lines.push('긍정과 부정이 팽팽합니다. 중심 카드와 마지막 카드가 어느 쪽 손을 들어 주는지 보세요.');
    const soothers = cards.filter((c) => c.n === 2 || c.n === 31);
    const negs = cards.filter((c) => c.tone === 'neg');
    if (soothers.length && negs.length) lines.push(`${soothers.map((c) => c.ko).join(', ')} 카드가 ${negs.map((c) => c.ko).join(', ')} 카드의 부정적인 기운을 덜어 줍니다.`);
    const neutrals = cards.filter((c) => c.tone === 'neu');
    if (neutrals.length) lines.push(`${neutrals.map((c) => c.ko).join(', ')} 카드는 중립입니다. 바로 옆 카드의 색을 입혀 읽으세요.`);

    const combos = s.combos.map(([ps, label]) => {
      const cs = ps.map((p) => at[p]);
      const hits = [];
      for (let i = 0; i + 1 < cs.length; i++) { const h = chainLine(cs[i], cs[i + 1]); if (h) hits.push(h); }
      return `<li><p class="combo-head"><b>${ps.map((p) => p + '번').join(' + ')}</b>${esc(label)}</p>` +
        `<p class="combo-cards">${cs.map((c) => `<span class="tone-${c.tone}"><span class="dot"></span>${esc(c.ko)}</span>`).join('<i>+</i>')}</p>${hits.join('')}</li>`;
    }).join('');

    return '<h3>함께 읽기</h3>' + t.html +
      `<ul class="plain">${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` +
      (combos ? `<p class="sub">묶어 읽기</p><ul class="combos">${combos}</ul>` : '');
  }

  /* ── 상태 ─────────────────────────── */
  const state = { spreadKey: 'three', deck: [], at: {}, picked: 0, flipped: new Set(), question: '', sig: 29, sel: null };
  const spread = () => SPREADS[state.spreadKey];

  function renderSpreadOptions() {
    $('spreadOptions').innerHTML = Object.entries(SPREADS).map(([key, s]) =>
      `<label class="spread-option"><input type="radio" name="spread" value="${key}"${key === state.spreadKey ? ' checked' : ''}>` +
      `<span class="spread-card">${miniHTML(s)}` +
      `<span><strong>${esc(s.name)}</strong><em>${esc(s.sub)} · ${s.count}장</em><p>${esc(s.intro)}</p></span>` +
      '</span></label>').join('');
  }
  function renderSpreadBook() {
    $('spreadList').innerHTML = Object.entries(SPREADS).map(([key, s]) =>
      `<article class="spread-entry" id="spread-${key}"><header>${miniHTML(s)}<div><h3>${esc(s.name)}</h3><p class="entry-sub">${esc(s.sub)} · ${s.count}장</p></div></header>` +
      `${guideBodyHTML(s)}</article>`).join('');
  }

  /* ── 테이블 ───────────────────────── */
  function startReading() {
    const s = spread();
    state.deck = shuffled(CARDS);
    state.at = {};
    state.picked = 0;
    state.flipped = new Set();
    state.sel = null;

    $('table').hidden = false;
    $('tableActions').hidden = true;
    $('together').hidden = true;
    $('sigPick').hidden = !s.auto;
    $('spreadTitle').textContent = `${s.name} · ${s.sub}`;
    const asked = $('asked');
    asked.hidden = !state.question;
    asked.textContent = state.question;

    $('posGuide').innerHTML = `<summary>이 스프레드의 자리 의미</summary>${guideBodyHTML(s)}`;
    $('posGuide').open = !s.auto;

    const layout = $('layout');
    layout.dataset.spread = state.spreadKey;
    layout.style.gridTemplateColumns = `repeat(${s.grid[0].length}, var(--cw))`;
    const deck = $('deck');

    if (s.auto) {
      deck.classList.add('is-done');
      deck.innerHTML = '';
      $('readings').innerHTML = '<article class="reading" id="gtDetail" hidden></article>';
      state.deck.forEach((c, i) => { state.at[i + 1] = c; });
      layout.innerHTML = state.deck.map((c, i) => {
        const p = i + 1;
        return `<button type="button" class="gt-cell" data-pos="${p}" style="grid-area:${Math.floor(i / 9) + 1}/${(i % 9) + 1};--i:${i}" aria-label="${p}번 자리 ${esc(byN(p).ko)}의 집: ${esc(c.ko)}">` +
          `<span class="gt-house"><b>${p}</b>${esc(byN(p).ko)}의 집</span>${faceHTML(c)}</button>`;
      }).join('');
      $('tableActions').hidden = false;
      $('flipAll').hidden = true;
      updateGT(true);
    } else {
      deck.classList.remove('is-done');
      deck.innerHTML = state.deck.map((_, i) =>
        `<button type="button" class="deck-card" style="--i:${i}" data-i="${i}" aria-label="${i + 1}번째 카드 뽑기">${BACK_SVG}</button>`).join('');
      layout.innerHTML = s.grid.map((row, r) => row.map((p, c) => (p ?
        `<div class="slot" data-pos="${p}" style="grid-area:${r + 1}/${c + 1}">` +
        `<div class="slot-label"><b>${p}</b>${esc(s.positions[p][0])}</div>` +
        `<div class="slot-hole">${p}</div><div class="slot-name"></div></div>` : '')).join('')).join('');
      $('readings').innerHTML = Object.keys(s.positions).map((p) =>
        `<article class="reading" data-pos="${p}" hidden></article>`).join('');
    }
    updateStatus();
  }

  function updateStatus() {
    const s = spread();
    let msg;
    if (s.auto) {
      msg = '36장을 모두 펼쳤습니다. 카드를 누르면 그 자리의 풀이가 열립니다.';
    } else {
      const left = s.count - state.picked;
      if (left > 0) {
        msg = state.picked === 0 ? `질문을 떠올리며 마음이 가는 카드를 ${s.count}장 골라 주세요.` : `${left}장 더 골라 주세요.`;
      } else if (state.flipped.size < s.count) {
        msg = '카드를 눌러 뒤집어 보세요.';
      } else {
        msg = s.count > 1 ? '1번 자리부터 차례로, 옆 카드와 이어서 읽어 보세요.' : '카드가 건네는 답을 읽어 보세요.';
      }
    }
    $('status').textContent = msg;
  }

  function pick(i) {
    const s = spread();
    if (state.picked >= s.count) return;
    const card = state.deck[i];
    const pos = ++state.picked;
    state.at[pos] = card;

    const slot = $('layout').querySelector(`.slot[data-pos="${pos}"]`);
    slot.querySelector('.slot-hole').outerHTML =
      `<button type="button" class="flip" data-pos="${pos}" aria-label="${pos}번 자리 카드 뒤집기">` +
      `<span class="flip-inner"><span class="side back">${BACK_SVG}</span>` +
      `<span class="side front">${faceHTML(card)}</span></span></button>`;

    if (state.picked === s.count) {
      $('deck').classList.add('is-done');
      $('tableActions').hidden = false;
      $('flipAll').hidden = false;
      const first = $('layout').querySelector('.flip[data-pos="1"]');
      if (first) first.focus({ preventScroll: true });
    }
    updateStatus();
  }

  function flip(pos, quiet) {
    pos = Number(pos);
    if (state.flipped.has(pos) || !state.at[pos]) return;
    state.flipped.add(pos);
    const c = state.at[pos];
    const s = spread();

    const slot = $('layout').querySelector(`.slot[data-pos="${pos}"]`);
    const btn = slot.querySelector('.flip');
    btn.classList.add('is-flipped');
    btn.setAttribute('aria-label', `${pos}번 자리: ${c.ko} (${TONE[c.tone]})`);
    slot.querySelector('.slot-name').innerHTML = `<span class="dot tone-${c.tone}"></span>${esc(c.ko)}`;

    const article = $('readings').querySelector(`.reading[data-pos="${pos}"]`);
    const posLine = `<p class="pos"><b>${pos}</b>${esc(s.positions[pos][0])}</p><p class="pos-desc">${esc(s.positions[pos][1])}</p>`;
    article.innerHTML = readingHTML(posLine, c);
    article.hidden = false;

    const done = state.flipped.size === s.count;
    if (done) {
      $('flipAll').hidden = true;
      $('together').innerHTML = togetherHTML(s, state.at);
      $('together').hidden = false;
    }
    updateStatus();
    if (!quiet && done) setTimeout(() => $('together').scrollIntoView({ block: 'start' }), 700);
  }

  /* ── 그랑 타블로 ───────────────────── */
  const posOf = (n) => Number(Object.keys(state.at).find((p) => state.at[p].n === n));
  const rc = (p) => [Math.floor((p - 1) / 9), (p - 1) % 9];
  const cardBtn = (p) => { const c = state.at[p]; return `<button type="button" class="link tone-${c.tone}" data-go="${p}"><span class="dot"></span>${esc(c.ko)}</button>`; };

  function updateGT(first) {
    const sp = posOf(state.sig);
    if (first || state.sel == null) state.sel = sp;
    const [sr, sc] = rc(sp);
    const near = [], left = [], right = [], up = [], down = [];
    for (let p = 1; p <= 36; p++) {
      if (p === sp) continue;
      const [r, c] = rc(p);
      if (Math.abs(r - sr) <= 1 && Math.abs(c - sc) <= 1) near.push(p);
      if (r === sr) (c < sc ? left : right).push(p);
      if (c === sc) (r < sr ? up : down).push(p);
    }
    left.reverse(); up.reverse(); /* 가까운 카드부터 */

    $('layout').querySelectorAll('.gt-cell').forEach((cell) => {
      const p = Number(cell.dataset.pos);
      cell.classList.toggle('is-sig', p === sp);
      cell.classList.toggle('is-near', near.includes(p));
      cell.classList.toggle('is-line', left.includes(p) || right.includes(p) || up.includes(p) || down.includes(p));
      cell.classList.toggle('is-sel', p === state.sel);
    });
    $('sigPick').querySelectorAll('.chip').forEach((b) => {
      const on = Number(b.dataset.sig) === state.sig;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });

    const sigCard = byN(state.sig);
    const row = (label, desc, ps, empty) => `<dt>${label}<small>${desc}</small></dt><dd>${ps.length ? ps.map(cardBtn).join('') : `<span class="none">${empty}</span>`}</dd>`;
    const t = tallyHTML(near.map((p) => state.at[p]));
    $('together').innerHTML = '<h3>그랑 타블로 읽기</h3>' +
      `<p class="gt-lead">질문자 카드 <b>${esc(sigCard.ko)}</b>는 <b>${sp}번 자리 · ${esc(byN(sp).ko)}의 집</b>에 놓였습니다. ` +
      (sp === state.sig ? '자기 집에 앉았습니다. 지금은 스스로가 삶의 중심에 서 있습니다.' : `지금 삶의 무게가 ‘${esc(HOUSES[sp][0])}’ 쪽에 실려 있습니다.`) + '</p>' +
      '<dl class="gt-groups">' +
      row('과거', '왼쪽 · 가까운 순', left, '왼쪽 끝입니다. 지나온 일보다 앞으로의 일이 중심입니다.') +
      row('미래', '오른쪽 · 가까운 순', right, '오른쪽 끝입니다. 새 일보다 지나온 일을 정리하는 때입니다.') +
      row('생각 · 의식', '위', up, '맨 윗줄입니다. 생각보다 현실이 앞서 있습니다.') +
      row('무의식 · 현실', '아래', down, '맨 아랫줄입니다. 발밑보다 머릿속이 바쁩니다.') +
      row('가까운 영향', '맞닿은 카드', near, '') +
      row('타블로의 주제', '첫 세 장', [1, 2, 3], '') +
      row('전체의 틀', '네 모서리', [1, 9, 28, 36], '') +
      '</dl>' +
      `<p class="sub">맞닿은 카드의 성격</p>${t.html}` +
      '<p class="fine">카드 이름을 누르면 그 자리의 풀이로 갑니다.</p>';
    $('together').hidden = false;
    renderGTDetail();
  }

  function renderGTDetail() {
    const p = state.sel;
    const c = state.at[p];
    const owner = byN(p);
    const [r, col] = rc(p);
    const posLine = `<p class="pos"><b>${p}</b>${esc(owner.ko)}의 집 · ${esc(HOUSES[p][0])}</p><p class="pos-desc">${esc(HOUSES[p][1])}</p>`;
    const notes = [];
    if (c.n === p) notes.push('자기 집에 앉은 카드입니다. 이 카드의 뜻이 한층 또렷하고 강하게 드러납니다.');
    else {
      notes.push(`‘${owner.ko}의 집’이 다루는 ${HOUSES[p][0]}에 ${c.ko} 카드의 ${c.kw.slice(0, 3).join('·')} 기운이 들어와 있습니다.`);
      const op = posOf(p);
      notes.push(`이 집의 주인인 ${owner.ko} 카드는 ${op}번 자리(${byN(op).ko}의 집)에 가 있습니다. 두 자리를 이어 읽어 보세요.`);
    }
    if (c.n === state.sig) notes.push('질문자 카드입니다. 이 카드를 기준으로 방향을 읽습니다.');
    let chains = '';
    if (col > 0) { const a = state.at[p - 1]; const h = chainLine(a, c); chains += `<li><b>${esc(a.ko)} + ${esc(c.ko)}</b>왼쪽 카드와 이어 읽기${h}</li>`; }
    if (col < 8) { const b = state.at[p + 1]; const h = chainLine(c, b); chains += `<li><b>${esc(c.ko)} + ${esc(b.ko)}</b>오른쪽 카드와 이어 읽기${h}</li>`; }
    if (r > 0) { const a = state.at[p - 9]; chains += `<li><b>${esc(a.ko)} ↓ ${esc(c.ko)}</b>위 카드가 이 카드에 얹는 생각</li>`; }
    if (r < 3) { const b = state.at[p + 9]; chains += `<li><b>${esc(c.ko)} ↓ ${esc(b.ko)}</b>이 카드를 밑에서 받치는 바탕</li>`; }
    const extra = `<ul class="plain house-notes">${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` +
      `<div><p class="sub">이웃 카드</p><ul class="combo-list">${chains}</ul></div>`;
    const article = $('gtDetail');
    article.innerHTML = readingHTML(posLine, c, extra);
    article.hidden = false;
  }

  function selectGT(p, scroll) {
    state.sel = Number(p);
    $('layout').querySelectorAll('.gt-cell').forEach((cell) => cell.classList.toggle('is-sel', Number(cell.dataset.pos) === state.sel));
    renderGTDetail();
    if (scroll) $('gtDetail').scrollIntoView({ block: 'start' });
  }

  /* ── 도감 ─────────────────────────── */
  function renderLibrary() {
    $('cardGrid').innerHTML = CARDS.map((c, i) =>
      `<button type="button" class="card-tile" data-i="${i}" data-tone="${c.tone}" aria-label="${esc(c.ko)} 풀이 보기">` +
      `${faceHTML(c)}<span class="tile-name"><b>${c.n}</b>${esc(c.ko)}</span></button>`).join('');
    const n = (t) => CARDS.filter((c) => c.tone === t).length;
    $('cntAll').textContent = CARDS.length;
    $('cntPos').textContent = n('pos');
    $('cntNeu').textContent = n('neu');
    $('cntNeg').textContent = n('neg');
  }

  /* ── 이벤트 ───────────────────────── */
  $('setup').addEventListener('submit', (e) => {
    e.preventDefault();
    const checked = document.querySelector('input[name="spread"]:checked');
    if (checked) state.spreadKey = checked.value;
    state.question = $('question').value.trim();
    startReading();
    $('table').scrollIntoView({ block: 'start' });
  });

  $('deck').addEventListener('click', (e) => {
    const btn = e.target.closest('.deck-card');
    if (!btn || btn.classList.contains('is-taken')) return;
    btn.classList.add('is-taken');
    btn.disabled = true;
    pick(Number(btn.dataset.i));
  });

  $('layout').addEventListener('click', (e) => {
    const cell = e.target.closest('.gt-cell');
    if (cell) { selectGT(cell.dataset.pos, true); return; }
    const btn = e.target.closest('.flip');
    if (btn) flip(btn.dataset.pos);
  });

  $('together').addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]');
    if (go) selectGT(go.dataset.go, true);
  });

  $('sigPick').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    state.sig = Number(chip.dataset.sig);
    updateGT(true);
  });

  $('flipAll').addEventListener('click', () => {
    const rest = Object.keys(state.at).map(Number).filter((p) => !state.flipped.has(p)).sort((a, b) => a - b);
    rest.forEach((p, i) => setTimeout(() => flip(p, i < rest.length - 1), i * 260));
  });

  $('redraw').addEventListener('click', () => {
    startReading();
    $('table').scrollIntoView({ block: 'start' });
  });

  $('filters').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const tone = chip.dataset.tone;
    $('filters').querySelectorAll('.chip').forEach((b) => {
      const on = b === chip;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $('cardGrid').querySelectorAll('.card-tile').forEach((t) => {
      t.hidden = tone !== 'all' && t.dataset.tone !== tone;
    });
  });

  const dialog = $('cardDialog');
  $('cardGrid').addEventListener('click', (e) => {
    const tile = e.target.closest('.card-tile');
    if (!tile) return;
    $('dialogBody').innerHTML = dialogHTML(CARDS[Number(tile.dataset.i)]);
    dialog.showModal();
    dialog.scrollTop = 0;
  });
  $('dialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  renderSpreadOptions();
  renderSpreadBook();
  renderLibrary();
})();
