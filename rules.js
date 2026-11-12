/* 2026年度 / 全16段階。医療上の重症度スコアではない。 */
(function(root){
const labels=['A0',...['B','C','D'].flatMap(c=>[1,2,3,4,5].map(n=>c+n))];
const official='日本人間ドック・予防医療学会 2026年度判定区分表 p.1（2026-04-01改定）';
const source=(title,url,part)=>({title,url,part,checked:'2026-10-31'});
const sources=[
source(official,'https://www.ningen-dock.jp/ningendock/wp-content/uploads/2026/02/2026hanteikijun.pdf','p.1 各項目行、p.2 注3・7・8。公式年度一覧で2026年度の適用を確認。'),
source('WHO NLiS / Malnutrition in women','https://www.who.int/data/nutrition/nlis/info/malnutrition-in-women','成人BMIの18.5・25・30、低値17・16。版・更新日の表示なし。'),
source('WHO / Obesity: preventing and managing the global epidemic（1998）','https://iris.who.int/bitstream/handle/10665/63854/WHO_NUT_NCD_98.1_%28p159-276%29.pdf','p.253 成人肥満分類35・40。検索抽出で確認。WHO欧州現行指標も検索抽出では一致、本文取得は502。'),
source('日本痛風・核酸代謝学会 / 腎性低尿酸血症診療ガイドライン 第1版（2017）','https://www.tukaku.jp/securewp/wp-content/uploads/2017/04/gl2017-2.pdf','エッセンスp.1 CQ1、p.2診断指針。尿酸2.0以下は鑑別診断の対象。'),
source('日本高血圧協会 / 高血圧Q&A','https://www.ketsuatsu.net/faq/','B1・B2。JSH2025 p.45表5-5・p.65表6-2の正式転載。診察室血圧180/110以上＝III度。原著書籍全体は未取得。'),
source('日本アフェレシス学会 / 技術マニュアル 2-2-12 白血球増多症','https://www.apheresis-jp.org/143203.html','疾患概念。100,000/µL以上のhyperleukocytosis。主に血液疾患の文脈、一般成人の共通重症度ではない。Web版の改定日表示なし。'),
source('日本アフェレシス学会 / 技術マニュアル 6-5-32 高TG血症に伴う急性膵炎','https://www.apheresis-jp.org/143230.html','疾患概念。TG500〜1,000 mg/dL超での膵炎発症可能性。1000のD5への対応は本ゲームの設定。改定日表示なし。'),
source('日本動脈硬化学会 / 成人FH診療ガイドライン フォーカスアップデート2025','https://www.j-athero.org/jp/wp-content/uploads/publications/pdf/JAS_FH_GL2025.pdf','p.10 表1・2.4.1。未治療LDL180以上、250以上でFHを強く疑う。LDL単独で確定診断しない。'),
source('日本動脈硬化学会 / 低脂血症の診断と治療2023','https://www.j-athero.org/jp/wp-content/uploads/publications/pdf/guide2023_s/hypolipidemia2023.pdf','2023-06-30発行。冊子p.2低脂血症の定義、p.3 ABL診断のLDL15未満。原因・治療状況で意味が違う。'),
source('日本医師会 / 健康の森 γ-GTP','https://www.med.or.jp/forest/check/kensa/gtp/index.html','200超での詳細検査の説明。医学的最高重症度の境界ではない。版・更新日の表示なし。'),
source('日本動脈硬化学会 / 動脈硬化性疾患予防ガイドライン2022 第2章','https://www.j-athero.org/jp/wp-content/uploads/publications/pdf/GL2022_s/02_230210.pdf','表2-1、空腹時と随時TGの条件。治療目標と健診の判定区分を区別する。'),
source('日本痛風・尿酸核酸学会 / ガイドライン一覧','https://www.tukaku.jp/guideline/','高尿酸血症・痛風 第3版2018、追補2022掲載を確認。書籍本文は未取得。尿酸の汎用D5は未確認。'),
source('日本人間ドック・予防医療学会 / 検査表の見方','https://www.ningen-dock.jp/other_inspection/','2026年度判定区分表と2026-04-01施行の改定案内を確認。'),
source('国立長寿医療研究センター / 白血球数が多いと言われたら','https://www.ncgg.go.jp/hospital/navi/70.html','白血球分画・原因・症状を含めて評価する説明。総白血球数だけで診断しない。')];
// 数値は各項目の最小刻みで整数化。下限以上・次の下限未満。
const definitions=[
{id:'wbc',name:'白血球数',short:'WHITE BLOOD CELLS',unit:'10³/µL',scale:10,example:'6.2',high:[[31,0],[85,1],[86,2],[87,3],[88,4],[89,5],[90,6],[92,7],[94,8],[96,9],[98,10],[100,11],[325,12],[550,13],[775,14],[1000,15]],low:[[0,15],[10,14],[15,13],[20,12],[25,11]],normal:31,
note:'10³/µLなら6.2、/µLなら6,200。単位を選んで入力してください。',refs:[0,5,13],rationale:'高値D5＝100.0（100,000/µL）は血液疾患領域の著明増多の定義を参考にしたゲーム上の対応。10.0〜99.9を4等分。低値D5＝0.9以下には汎用の医学的最高重症度の根拠を確認できず、旧表を暫定維持。代替は低値Dを固定とする方式。',changes:'高値D5：14.0以上 → 100.0以上。D1〜D4を再配分。低値・A〜Cは維持。'},
{id:'uric',name:'尿酸',short:'URIC ACID',unit:'mg/dL',scale:10,example:'5.8',high:[[21,0],[71,1],[73,2],[75,3],[77,4],[79,5],[80,6],[82,7],[84,8],[86,9],[88,10],[90,11],[100,12],[110,13],[120,14],[130,15]],low:[[0,10],[5,9],[9,8],[13,7],[17,6]],normal:21,
note:'健診票の小数第1位の値を入力。低値側も判定します。',refs:[0,3,11],rationale:'2.0以下は低尿酸血症の鑑別対象。低値C1〜C5のリスク順序は未確認のためゲーム独自の暫定細分。高値D5＝13.0以上も汎用の最高重症度の根拠は未確認。旧表を暫定維持し、代替はD内固定または医学資料追加後に再設計。',changes:'全16段階の旧表を維持。13段階版の「低値＝5」とは別仕様。'},
{id:'bmi',name:'BMI',short:'BODY MASS INDEX',unit:'単位なし',scale:10,example:'22.4',high:[[185,0],[250,1],[260,2],[270,3],[280,4],[290,5],[300,6],[310,7],[320,8],[330,9],[340,10],[350,11],[370,12],[390,13],[410,14],[430,15]],low:[[0,15],[120,14],[130,13],[140,12],[150,11],[160,10],[162,9],[164,8],[166,7],[168,6],[170,5],[173,4],[176,3],[179,2],[182,1]],normal:185,
note:'健診票に記載されたBMIを入力。成人向け。',refs:[1,2],rationale:'保存済みユーザー指定「BMI配点を維持」を優先し、直前の16段階表を維持。WHOの16・17・18.5・25・30・35を参考にA〜D相当へ対応。D5の43以上／12未満はゲーム独自で医学的最高区分ではない。WHO肥満III度の40以上は補足表示で保持。代替案は高値D5を40以上、低値D5を16未満にする方式だが、本版では変更しない。',changes:'既存16段階のBMI配点を維持（保存済み指定）。WHOの40以上は別途表示。'},
{id:'ggt',name:'γ-GTP',short:'GAMMA-GTP',unit:'U/L',scale:1,example:'35',high:[[0,0],[51,1],[57,2],[63,3],[69,4],[75,5],[81,6],[85,7],[89,8],[93,9],[97,10],[101,11],[126,12],[151,13],[176,14],[201,15]],refs:[0,9],
note:'γ-GTと表記されることもあります。整数で入力。',rationale:'200超の詳細検査の説明を参考に、201以上をゲームD5の暫定開始点とした。101〜200を4等分。最高重症度の境界とは未確認で、飲酒・薬剤・他検査によって解釈が変わる。代替は旧181以上の維持または基準値上限比による設計。',changes:'D5：181以上 → 201以上。D1〜D4を25刻みに変更。A〜Cは維持。'},
{id:'sys',name:'収縮期血圧',unit:'mmHg',scale:1,high:[[0,0],[130,1],[132,2],[134,3],[136,4],[138,5],[140,6],[144,7],[148,8],[152,9],[156,10],[160,11],[165,12],[170,13],[175,14],[180,15]],refs:[0,4],rationale:'健診D160以上とJSH2025 III度180以上を固定。160〜179を4等分。180以上をD5に対応すること自体はゲーム独自。',changes:'D5：200以上 → 180以上。'},
{id:'dia',name:'拡張期血圧',unit:'mmHg',scale:1,high:[[0,0],[85,1],[86,2],[87,3],[88,4],[89,5],[90,6],[92,7],[94,8],[96,9],[98,10],[100,11],[103,12],[105,13],[108,14],[110,15]],refs:[0,4],rationale:'健診D100以上とJSH2025 III度110以上を固定。100〜109を4分割し下限を切り上げ。110以上をD5に対応すること自体はゲーム独自。',changes:'D5：120以上 → 110以上。'},
{id:'ldl',name:'LDLコレステロール',short:'LDL CHOLESTEROL',unit:'mg/dL',scale:1,example:'105',high:[[60,0],[120,1],[124,2],[128,3],[132,4],[136,5],[140,6],[148,7],[156,8],[164,9],[172,10],[180,11],[198,12],[215,13],[233,14],[250,15]],low:[[0,15],[15,14],[26,13],[38,12],[49,11]],normal:60,refs:[0,7,8,10],
note:'治療中でも数値からゲームの強さを算定。医師のE判定とは別です。',rationale:'高値250以上はFHを強く疑う数値を参考にしたゲームD5の暫定値。一般成人の最高重症度ではない。180〜249を4分割。低値15未満は疾患固有の診断条件を参考にした独自D5で、一般の危険度ではない。15〜59を4分割。代替は低値D固定。70未満の専門学会定義を補足し、健診A60〜69を変更しない。',changes:'高値D5：260以上 → 250以上。低値D5：19以下 → 14以下。D1〜D4再配分。候補案を承認済みとは扱わず本サイトの暫定ゲーム設定として採用。'},
{id:'tg',name:'中性脂肪',short:'TRIGLYCERIDES',unit:'mg/dL',scale:1,example:'120',high:[[30,0],[150,1],[180,2],[210,3],[240,4],[270,5],[300,6],[340,7],[380,8],[420,9],[460,10],[500,11],[625,12],[750,13],[875,14],[1000,15]],low:[[0,15],[6,14],[12,13],[18,12],[24,11]],normal:30,refs:[0,6,8,10],
note:'10時間以上の絶食後の採血値のみ対象。水・お茶などカロリーのない水分は可。',rationale:'500の健診Dと1000の高リスク参考点を固定し、500〜999を4等分。D5以上でリスクが止まる意味ではない。低値D5＝5以下の最高重症度の根拠は未確認で旧表を暫定維持。代替は低値D固定。13段階版の9／12を流用せず、16段階のD1／D5へ対応。',changes:'高値D5：900以上 → 1000以上。D1〜D4を125刻みに再配分。低値・A〜C維持。'}];
function getDef(id){return definitions.find(d=>d.id===id)}
function scaledValue(raw,scale){
 const text=String(raw??'').trim();
 if(!text)return {error:'empty'};
 if(!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(text))return {error:'number'};
 const [whole,fraction='']=text.split('.');
 const digits=String(scale).length-1;
 if(fraction.length>digits)return {error:'precision'};
 const q=Number((whole||'0')+fraction.padEnd(digits,'0'));
 if(!Number.isSafeInteger(q))return {error:'precision'};
 return {q,value:q/scale};
}
function at(q,points){let rank=null;for(const [start,s] of points){if(q<start)break;rank=s;}return rank}
function calculate(id,raw){const d=getDef(id);if(!d)return {error:'item'};const p=scaledValue(raw,d.scale);if(p.error)return p;const points=d.low&&p.q<d.normal?d.low:d.high;const rank=at(p.q,points);if(rank===null)throw Error('Unmapped input');return {...p,rank,label:labels[rank],grade:labels[rank][0]}}
function fiscalYear(date=new Date()){const a=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);const n=t=>Number(a.find(x=>x.type===t).value);return n('year')-(n('month')<4?1:0)}
function intervals(d){const points=[...(d.low||[]),...d.high].sort((a,b)=>a[0]-b[0]);return points.map(([start,rank],i)=>({start,end:points[i+1]?points[i+1][0]-1:null,rank}));}
function formatNumber(q,d){return (q/d.scale).toFixed(d.scale===10?1:0)}
function rangeText(i,d){if(i.end===null)return formatNumber(i.start,d)+'以上';if(i.start===i.end)return formatNumber(i.start,d);return formatNumber(i.start,d)+'〜'+formatNumber(i.end,d)}
const api={labels,definitions,sources,calculate,scaledValue,fiscalYear,intervals,formatNumber,rangeText,getDef,meta:{year:2026,checked:'2026-10-31',version:'2026.10.31-16-v1',status:'公式判定境界確認済み／ゲーム細分化は暫定版'}};
root.Kenshin=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
