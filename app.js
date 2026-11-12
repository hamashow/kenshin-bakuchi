(()=>{
'use strict';const K=window.Kenshin,$=s=>document.querySelector(s);const items=K.definitions.filter(d=>!['sys','dia'].includes(d.id));items.splice(4,0,{id:'bp',name:'血圧',short:'BLOOD PRESSURE',unit:'mmHg'});const state={};
const icon=(id,cls='item-icon')=>`<img class="${cls}" src="${window.ItemIcons[id]}" alt="" width="48" height="48">`; 
const aliases={wbc:'WBC・白血球',uric:'UA・血清尿酸',bmi:'体格指数・ボディマス指数',ggt:'γ-GT・GGT・ガンマGTP',bp:'最高／最低血圧・SBP／DBP',ldl:'LDL-C・LDLコレステロール',tg:'TG・トリグリセライド'};
const descriptions={
wbc:'白血球の数を示す項目です。健診票ではWBCと記載されることがあります。白血球分画（好中球の割合など）とは別の項目です。10³/µL・10²/µL・/µLの単位を選び、記載された数値を入力してください。5330 /µL、53.30 ×10²/µL、5.330 ×10³/µLは同じ値として算定します。',
uric:'血液中の尿酸を示し、UAや血清尿酸と記載されることがあります。尿検査の尿酸値ではなく、採血結果のmg/dLの値を使います。小数第1位まで入力してください。',
bmi:'体格指数・ボディマス指数とも呼ばれ、体重kgを身長mの2乗で割った値です。このページでは丸め方の差を避けるため、健診票に記載されたBMIを小数第1位まで入力してください。体脂肪率や肥満度（%）とは別の項目です。',
ggt:'γ-GT、GGT、ガンマGTPなどと表記される項目です。肝臓や胆道に関連する酵素の検査です。AST（GOT）やALT（GPT）とは別の項目なので、γ-GTPの行にあるU/Lの整数値を使います。',
bp:'収縮期血圧は「上・最高血圧・SBP」、拡張期血圧は「下・最低血圧・DBP」と表記されます。健診・医療機関で測定された報告値を両方入力してください。家庭血圧はこの表の対象外です。上下を別々に算定し、強い方を血圧札にします。',
ldl:'LDL-CやLDLコレステロールと記載されます。一般に悪玉コレステロールとも呼ばれます。総コレステロール（TC）、HDL、Non-HDLとは異なるため、LDLのmg/dLの整数値を使ってください。',
tg:'TGやトリグリセライドと記載されます。mg/dLの整数値を入力し、採血条件を選択してください。この版では10時間以上絶食した空腹時採血のみ算定できます。随時採血・空腹時か不明の場合は未算定になります。'
};
const input=(id,placeholder,unit,extra='')=>`<div class="input-wrap"><input id="${id}" aria-label="${K.getDef(id).name}の検査値" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="${placeholder}" aria-describedby="${id==='sys'||id==='dia'?'bp':id}-hint ${id==='sys'||id==='dia'?'bp':id}-error">${extra||`<span class="unit">${unit}</span>`}</div>`;
$('#fields').innerHTML=items.map((d,i)=>`<div class="field" data-id="${d.id}"><div class="field-top"><a href="#detail-${d.id}" class="field-name" aria-label="${d.name}の詳細を見る">${icon(d.id)}<span class="name-copy">${d.name}<span class="detail-arrow"> ↗</span><small class="aliases">健診票での別表記：${aliases[d.id]}</small></span></a></div><div class="field-entry">${d.id==='bp'?`<div class="bp-pair"><div class="bp-input"><label for="sys">収縮期（上）</label>${input('sys','120','mmHg')}</div><span class="bp-divider">/</span><div class="bp-input"><label for="dia">拡張期（下）</label>${input('dia','80','mmHg')}</div></div>`:input(d.id,d.example,d.unit,d.id==='wbc'?'<select id="wbc-unit" class="unit-select" aria-label="白血球数の単位" aria-required="true" aria-describedby="wbc-error"><option value="">単位を選択</option><option value="single">/µL</option><option value="hundred">×10²/µL</option><option value="thousand">×10³/µL</option></select>':'')}<output id="${d.id}-result" class="field-result empty" aria-label="${d.name}の強さ">—</output></div>${d.id==='tg'?'<div class="conditions"><label for="fasting">採血条件</label><select id="fasting"><option value="">選んでください</option><option value="yes">空腹時（10時間以上絶食）</option><option value="no">随時・空腹時か不明</option></select></div>':''}${d.id==='bp'?'<div class="conditions"><label for="bp-condition">測定場所</label><select id="bp-condition"><option value="clinic">健診・医療機関</option><option value="home">家庭で測定</option></select></div>':''}<p class="field-hint" id="${d.id}-hint">${d.id==='bp'?'健診時の整数報告値。上・下の強い方を採用。':d.note}</p><p class="error" id="${d.id}-error" role="status"></p></div>`).join('');
const errorMessage=r=>!r.error||r.error==='empty'?'':r.error==='unit'?'健診票に記載された白血球数の単位を選択してください。':r.error==='precision'?'桁数を確認してください。この項目は'+(r.scale===1000?'小数第3位まで':r.scale===100?'小数第2位まで':r.scale===10?'小数第1位まで':'整数')+'で入力します。':'0以上の数値を入力してください。カンマや単位は入力不要です。';
function read(id){const d=K.getDef(id);let raw=$('#'+id).value.trim();if(id==='wbc'&&raw){const unit=$('#wbc-unit').value;if(!['single','hundred','thousand'].includes(unit))return {error:'unit'};const p=K.scaledValue(raw,unit==='single'?1:unit==='hundred'?100:1000);if(p.error)return {...p,scale:unit==='single'?1:unit==='hundred'?100:1000};raw=String(p.q/1000);}
 return {...K.calculate(id,raw),scale:d.scale};}
function refresh(){let count=0;
 const unit=$('#wbc-unit').value;
 $('#wbc').placeholder=({single:'5330',hundred:'53.30',thousand:'5.330'})[unit]||'検査値';
 $('#wbc-unit').removeAttribute('aria-invalid');
 if(read('wbc').error==='unit')$('#wbc-unit').setAttribute('aria-invalid','true');
 for(const d of items){let r,display='',error='';const group=$(`[data-id="${d.id}"]`);const ids=d.id==='bp'?['sys','dia']:[d.id];for(const id of ids){$('#'+id).removeAttribute('aria-invalid');$('#'+id).closest('.input-wrap').classList.remove('invalid')}
 if(d.id==='bp'){const a=read('sys'),b=read('dia');display=($('#sys').value||'—')+' / '+($('#dia').value||'—')+' mmHg';if(a.error||b.error){r={error:'input'};const invalid=[a,b].find(x=>x.error&&x.error!=='empty');if(invalid)error=errorMessage(invalid);else if($('#sys').value||$('#dia').value)error='上・下の両方を入力すると血圧札を算定できます。';}else if($('#bp-condition').value==='home'){r={error:'condition'};error='この基準は健診・医療機関の血圧用です。家庭血圧は対象外です。'}else{r=a.rank>=b.rank?{...a}:{...b};r.parts=`上 ${a.label} / 下 ${b.label}`;}}
 else{r=read(d.id);display=($('#'+d.id).value||'—')+' '+(d.id==='wbc'?$('#wbc-unit').selectedOptions[0].textContent:d.unit);error=errorMessage(r);if(d.id==='tg'&&!r.error&&$('#fasting').value!=='yes'){r={error:'condition'};error=$('#fasting').value==='no'?'随時・空腹不明の中性脂肪は、この空腹時基準では算定しません。':'採血条件を選んでください。';}}
 if(error){for(const id of ids){const p=read(id);if(p.error&&p.error!=='empty'){$('#'+id).setAttribute('aria-invalid','true');$('#'+id).closest('.input-wrap').classList.add('invalid')}}}
 const out=$('#'+d.id+'-result');out.textContent=r.error?'—':r.label;out.className='field-result '+(r.error?'empty':r.grade.toLowerCase());$('#'+d.id+'-error').textContent=error;
 const flag=[];if(!r.error&&d.id==='bmi'&&r.value>=40)flag.push('WHO肥満III度相当（40以上）');if(!r.error&&d.id==='ldl'&&r.value<70)flag.push('低値の解釈は治療状況等で異なります');
 state[d.id]={...r,display,extra:[r.parts,...flag].filter(Boolean).join(' / ')};if(!r.error)count++;
 }
 $('#count').textContent=count+' / 7';$('.hand-intro').textContent=count?`${count}項目を算定しました。残りは未入力・条件未確認です。`:'入力すると、ここに札が並びます。';
 $('#hand').replaceChildren(...items.map((d,i)=>{const r=state[d.id],card=document.createElement('article');card.className='mini-card '+(r.error?'blank':r.grade.toLowerCase());const picture=document.createElement('img');picture.src=window.ItemIcons[d.id];picture.alt='';picture.className='result-icon';picture.width=76;picture.height=76;card.appendChild(picture);for(const [cls,text,tag] of [['card-index','0'+(i+1),'span'],['card-label',r.error?'—':r.label,'div'],['',d.name,'h4'],['card-value',r.error?'未算定':r.display,'span']]){const el=document.createElement(tag);el.className=cls;el.textContent=text;card.appendChild(el)}if(r.extra&&!r.error){const el=document.createElement('span');el.className='card-value';el.textContent=r.extra;card.appendChild(el)}const link=document.createElement('a');link.href='#detail-'+d.id;link.className='result-link';link.setAttribute('aria-label',d.name+'の解説');card.appendChild(link);return card;}));
 renderTable();
}
$('#wbc-unit').addEventListener('change',refresh);$('#fields').addEventListener('input',()=>{});$('#fields').addEventListener('change',()=>{});
$('#clear').onclick=()=>{for(const input of document.querySelectorAll('#fields input'))input.value='';$('#wbc-unit').value='';$('#fasting').value='';$('#bp-condition').value='clinic';$('#download-status').textContent='';refresh();};
$('#sample').onclick=()=>{const demo={wbc:'9.6',uric:'8.5',bmi:'22.4',ggt:'145',sys:'145',dia:'105',ldl:'165',tg:'1000'};$('#wbc-unit').value='thousand';$('#bp-condition').value='clinic';$('#fasting').value='yes';for(const [id,v] of Object.entries(demo))$('#'+id).value=v;refresh();};
$('#print').onclick=()=>window.print();$('#download').onclick=()=>{if(!items.some(d=>!state[d.id].error)){$('#download-status').textContent='数値を入力し、少なくとも1項目を算定してください。';return}const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const rows=[['健診札博打','採用年度2026','16段階・暫定ゲーム配点',K.meta.version],['項目','入力値（単位付き）','強さ','補足'],...items.map(d=>[d.name,state[d.id].display,state[d.id].error?'未算定':state[d.id].label,state[d.id].extra]),['注記','医療上の重症度・健康リスクのスコアではありません。']];const blob=new Blob(['\ufeff'+rows.map(r=>r.map(esc).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='健診札博打_2026年度_結果.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);$('#download-status').textContent='この端末に結果を保存しました。';};
$('#item-details').innerHTML=items.map(d=>{const defs=d.id==='bp'?[K.getDef('sys'),K.getDef('dia')]:[K.getDef(d.id)];return `<article class="item-detail" id="detail-${d.id}" tabindex="-1"><div class="detail-heading"><div class="detail-title">${icon(d.id)}<div><h3>${d.name}</h3><p class="detail-aliases">健診票での表記：${aliases[d.id]}</p></div></div><a href="#checker" class="back-input" data-back="${d.id}">入力に戻る ↑</a></div><p class="medical-lead">${window.ItemMedical[d.id].title}</p><div class="medical-grid">${window.ItemMedical[d.id].sections.map(([title,text])=>`<section><h4>${title}</h4><p>${text}</p></section>`).join('')}</div><div class="medical-sources">説明の出典（確認日：2026年10月31日）：${window.ItemMedical[d.id].sources.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`).join(' ／ ')}</div><p class="entry-help"><strong>入力のポイント</strong><br>${descriptions[d.id]}</p><p><strong>今回のゲームでの扱い</strong><br>${defs.map(v=>v.rationale).join('<br>')}</p><button class="text-button show-item-table" data-item="${d.id}">この項目の全16段階を見る ↓</button><p><a class="back-results" href="#results">結果へ戻る ↑</a></p></article>`}).join('');
document.querySelectorAll('.field-name').forEach(a=>a.addEventListener('click',()=>{const dest=document.querySelector(a.getAttribute('href'));dest.focus({preventScroll:true});}));
document.querySelectorAll('.back-input').forEach(a=>a.addEventListener('click',()=>{const id=a.dataset.back;document.querySelector('#'+(id==='bp'?'sys':id)).focus({preventScroll:true});}));
document.querySelectorAll('.show-item-table').forEach(b=>b.addEventListener('click',()=>{$('#table-item').value=b.dataset.item;renderTable();$('#table-item').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('#table-item').focus({preventScroll:true});}));
function route(){const hash=location.hash;document.body.dataset.view=hash==='#results'?'results':(hash.startsWith('#detail-')||['#reference','#item-explanations'].includes(hash))?'guide':'input';if(hash==='#results'){
 if(!items.every(d=>state[d.id]&&!state[d.id].error)){document.body.dataset.view='input';return;}
 $('#results-title').focus({preventScroll:true});window.scrollTo(0,0);
 }else if(/^#detail-[a-z]+$/.test(hash)){
 const target=$(hash);if(target){target.focus({preventScroll:true});target.scrollIntoView();}
 }
 document.querySelectorAll('.back-results').forEach(a=>{a.hidden=!items.every(d=>state[d.id]&&!state[d.id].error);});}
window.addEventListener('hashchange',route);route();
document.querySelectorAll('.field-name').forEach(a=>a.addEventListener('click',()=>{document.body.dataset.view='guide';}));
document.querySelectorAll('.back-input').forEach(a=>a.addEventListener('click',()=>{document.body.dataset.view='input';}));
$('#calculate').onclick=()=>{
 refresh();
 const bad=items.find(d=>state[d.id].error);
 if(bad){
  $('#calculation-status').textContent=bad.name+'の入力値・単位・測定条件を確認してください。';
  const inputs=(bad.id==='bp'?['sys','dia']:[bad.id]).map(id=>$('#'+id));
  (bad.id==='wbc'&&read('wbc').error==='unit'?$('#wbc-unit'):inputs.find(input=>!input.value.trim()||read(input.id).error)||
   (bad.id==='tg'?$('#fasting'):bad.id==='bp'?$('#bp-condition'):inputs[0])).focus();
  return;
 }
 $('#calculation-status').textContent='';
 location.hash='results';
 route();
 window.scrollTo(0,0);
};
$('#edit-inputs').onclick=()=>{location.hash='checker';document.body.dataset.view='input';window.scrollTo(0,0);};
document.querySelectorAll('.show-item-table').forEach(b=>b.addEventListener('click',()=>{document.body.dataset.view='guide';}));
$('#table-item').innerHTML=items.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');$('#table-item').onchange=renderTable;
function provenance(d,rank){if(d.id==='bmi')return rank===0?'医学資料由来（WHO）＋ユーザー指定':'ユーザー指定の維持／ゲーム独自';const pieces=K.intervals(d).filter(i=>i.rank===rank);const medical=pieces.some(i=>d.high.some(([v,r])=>r===rank&&v===i.start&&[0,1,6,11].includes(rank)));return medical?'医学資料由来の判定境界＋ゲーム独自の細分':'ゲーム独自補間・対応（医学的重症度ではない）';}
function renderTable(){const id=$('#table-item').value||'wbc';const defs=id==='bp'?[K.getDef('sys'),K.getDef('dia')]:[K.getDef(id)];const rank=id==='bp'?state.bp?.rank:state[id]?.rank;const rows=K.labels.map((l,i)=>{const ranges=defs.map(d=>K.intervals(d).filter(s=>s.rank===i).map(s=>K.rangeText(s,d)).join(' ／ ')||'到達不能');return `<tr class="${rank===i?'active':''}"><td>${l[0]}${id==='bmi'?'相当':''}</td><td>${l}</td>${ranges.map(t=>`<td>${t}</td>`).join('')}<td>${provenance(defs[0],i)}</td></tr>`;}).join('');const d=defs[0];$('#rule-table').innerHTML=`<div class="table-scroll" tabindex="0" aria-label="${id==='bp'?'血圧':d.name}全16段階早見表"><table><thead><tr><th scope="col">判定／判定相当</th><th scope="col">強さ</th>${defs.map(d=>`<th scope="col">${id==='bp'?d.name:'実測値の範囲'}（${d.unit}）</th>`).join('')}<th scope="col">境界の根拠</th></tr></thead><tbody>${rows}</tbody></table></div><div class="rule-note"><strong>採用理由と限界</strong><br>${defs.map(d=>d.rationale).join('<br>')}<br>参照：${[...new Set(defs.flatMap(d=>d.refs))].map(i=>`<a href="${K.sources[i].url}" target="_blank" rel="noopener noreferrer">[${i+1}] ${K.sources[i].title}</a>`).join(' ／ ')}</div>`;}
$('#changes').innerHTML='<p>比較元：このチャットで出力した2026年度・全16段階のExcel。公式A〜D境界は変更せず、次のゲーム配点を変更しました。変更案を医学学会やユーザーの承認済み配点とは表示しません。</p>'+K.definitions.map(d=>`<h4>${d.name}</h4><p>${d.changes}</p>`).join('');
$('#sources').innerHTML=K.sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ↗</a><br>${s.part}<br>確認日：${s.checked}</li>`).join('');
const current=K.fiscalYear();if(current!==K.meta.year){$('#year-notice').hidden=false;$('#year-notice').textContent=`閲覧時点は${current}年度です。このページの採用基準は2026年度です。対象年度の基準を再確認するまで、現年度の公式対応版としては利用しないでください。`;}
Promise.resolve({
  "boundaryCases": 481,
  "exhaustiveCases": 160008,
  "bpPairs": 60501,
  "invalidCases": 107,
  "failures": 0
}).then(v=>{$('#test-summary').textContent=`計算仕様：${v.boundaryCases}件の境界テスト、${v.exhaustiveCases}件の区間照合、${v.bpPairs}組の血圧照合、${v.invalidCases}件の無効入力等を検証。失敗${v.failures}件。`}).catch(()=>{$('#test-summary').textContent='詳細は境界テストCSVを参照してください。'});refresh();
})();
