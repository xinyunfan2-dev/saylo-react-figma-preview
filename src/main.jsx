import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { House, WandSparkles, UserRound, Moon, Sun, AudioLines, MessageCircle, BriefcaseBusiness, Mail, Check, ChevronRight, ArrowRight, ArrowLeft, Sparkles, Pencil, AlignLeft, Send, Plus, Copy, Clock3, CreditCard, ShieldCheck, CircleHelp, Crown, Heart, Headphones, Globe2 } from 'lucide-react'
import './styles.css'

const scenes = [
  { id:'default',name:'默认',hint:'自然整理，保留你的表达',icon:AudioLines },
  { id:'casual',name:'闲聊',hint:'像平时聊天那样自然',icon:MessageCircle },
  { id:'work',name:'职场',hint:'清楚得体，不套公文腔',icon:BriefcaseBusiness },
  { id:'email',name:'邮件',hint:'有条理地写成邮件',icon:Mail },
]
const languages = ['跟随原话','简体中文','英语','粤语繁体','日语','韩语']
const defaults = [
  {id:'demo-1',name:'像我平时说话',scene:'闲聊',rule:'少一点客套，保留我说话时的节奏。'},
  {id:'demo-2',name:'清爽职场',scene:'职场',rule:'先说结论，句子短一点，不改变承诺强度。'},
]
function useStore(key,initial){
  const [value,setValue]=useState(()=>{try{return JSON.parse(localStorage.getItem(key)) ?? initial}catch{return initial}})
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}},[key,value])
  return [value,setValue]
}
function Logo({small=false}){return <div className={'logo '+(small?'small':'')} aria-label="Saylo 标志">{[9,17,25,14,22,11,18].map((n,i)=><i key={i} style={{height:n}}/>)}</div>}
function CardTitle({children,right}){return <div className="card-title"><div><span className="mark"/>{children}</div>{right}</div>}
function PillButton({children,onClick,ghost=false}){return <button className={'pill-button '+(ghost?'ghost':'')} onClick={onClick}>{children}</button>}
function Home({scene,setScene,selected,setSelected,go,notify}){
  const [more,setMore]=useState(false),[detail,setDetail]=useState(false),[done,setDone]=useState(false)
  function toggleLanguage(name){if(selected.includes(name)){if(selected.length>1)setSelected(selected.filter(x=>x!==name))}else if(selected.length<3)setSelected([...selected,name]);else notify('最多选择 3 种输出语言')}
  return <div className="page home">
    <div className="intro"><div><span className="eyebrow">早上好，欢迎回来</span><h1>让表达，<br/>更像你。</h1><p>把想说的话，变成想发出去的话。</p></div><div className="intro-star"><Sparkles size={26}/></div></div>
    <section className="glass-card service">
      <button className="service-head" onClick={()=>setDetail(!detail)} aria-expanded={detail}><span><i className="green-dot"/>语音服务运行中</span><ChevronRight size={20} className={detail?'rotated':''}/></button>
      <div className="rule-line"/>
      <div className="steps">{[['开启键盘','设置 → 通用 → 键盘 → 添加 Saylo'],['允许完全访问','共享链路与拉起主 App 需要'],['按住说话试一句','松手后自动整理成文字']].map(([a,b],i)=><div className="step" key={a}><span className={'step-check '+(i<2||done?'yes':'')}>{i<2||done?<Check size={12} strokeWidth={3}/>:null}</span><div><b>{a}</b><small>{b}</small></div></div>)}</div>
      {detail&&<div className="service-info"><Headphones size={16}/> 待机已就绪，回到任意输入框试试看</div>}
      <PillButton onClick={()=>{setDone(true);notify('键盘已标记为开启')}}>我已开启键盘 <ArrowRight size={18}/></PillButton>
    </section>
    <div className="section-label"><span>偏好</span><span>按你的习惯来</span></div>
    <section className="glass-card"><CardTitle right={<button className="link-button" onClick={()=>go('agent')}>让 Hermes 帮我选 <ArrowRight size={14}/></button>}>表达风格</CardTitle><div className="style-grid">{scenes.map(s=>{let I=s.icon;return <button key={s.id} className={'style-tile '+(scene===s.id?'selected':'')} onClick={()=>setScene(s.id)} aria-pressed={scene===s.id}><span className="tile-icon"><I size={24}/></span><strong>{s.name}{scene===s.id&&<Check size={17} strokeWidth={3}/>}</strong></button>})}</div><p className="caption">{scenes.find(s=>s.id===scene)?.hint}</p></section>
    <section className="glass-card languages"><CardTitle right={<span className="minor">已选 {selected.length}/3</span>}>输出语言</CardTitle><div className="chips">{(more?languages:languages.slice(0,4)).map(l=><button key={l} onClick={()=>toggleLanguage(l)} className={'chip '+(selected.includes(l)?'selected':'')} aria-pressed={selected.includes(l)}>{l}</button>)}</div><button className="expand" onClick={()=>setMore(!more)}>{more?'收起':'查看全部语言'} <ChevronRight size={13}/></button></section>
    <div className="section-label"><span>最近</span><button className="link-button" onClick={()=>notify('这是静态演示记录')}>查看全部 <ArrowRight size={14}/></button></div>
    <section className="glass-card recent">{[['周五下午三点和老张确认预算，别忘了让他带上报表。','职场','今天 14:32'],['Thanks for the update — I’ll review the draft tomorrow morning.','邮件','昨天 18:06']].map(([t,s,d])=><div className="recent-item" key={t}><p>{t}</p><div><span className="mini-chip">{s}</span><small>{d}</small><button aria-label="复制" onClick={()=>{navigator.clipboard?.writeText(t);notify('已复制')}}><Copy size={16}/></button></div></div>)}</section>
  </div>
}
function Agent({scene,setScene,presets,setPresets,notify}){
  const [phase,setPhase]=useState('start'),[method,setMethod]=useState('describe'),[input,setInput]=useState(''),[rule,setRule]=useState(''),[name,setName]=useState('新的写法'),[active,setActive]=useStore('saylo-active-preset','demo-1'),[assist,setAssist]=useState(0)
  const current=presets.find(p=>p.id===active)||presets[0],sceneName=scenes.find(s=>s.id===scene)?.name
  const utterance='周五下午三点和老张确认预算，别忘了让他带上报表。'
  useEffect(()=>{if(phase!=='ask')return;setAssist(0);const timers=[setTimeout(()=>setAssist(1),10000),setTimeout(()=>setAssist(2),25000),setTimeout(()=>setAssist(3),45000)];return()=>timers.forEach(clearTimeout)},[phase,method,input])
  function begin(m){setMethod(m);setPhase('ask');setInput('');setRule('')}
  function submit(){if(!input.trim())return;setRule(method==='example'?'保留范例的句子节奏与直接表达，避免额外客套。':input.trim());setInput('');setPhase('review')}
  function choose(v){setRule(v==='a'?'同样意思下，句子短一点，先说重点。':v==='b'?'同样意思下，保留自然的衔接和完整信息。':v==='both'?'保留自然节奏，按内容决定句子长短。':'');setPhase('review')}
  function save(){if(!rule.trim())return notify('先写一条规则');const p={id:'preset-'+Date.now(),name:name.trim()||'新的写法',scene:sceneName,rule:rule.trim()};setPresets([p,...presets]);setActive(p.id);setPhase('saved');notify('预设已保存并启用')}
  return <div className="page agent">
    <div className="agent-intro"><div className="agent-icon"><Sparkles size={27}/></div><div><span className="eyebrow purple">SAYLO AGENT</span><h1>Hermes</h1><p>一起找到更像你的写法。</p></div></div>
    <section className="glass-card active-preset"><CardTitle right={<span className="minor">{presets.length} 个预设</span>}>正在使用</CardTitle><div className="preset-main"><span className="preset-emblem"><WandSparkles size={21}/></span><div><b>{current?.name||'默认写法'}</b><small>{current?.scene} · {current?.rule}</small></div><span className="using">使用中</span></div>{presets.filter(p=>p.id!==active).slice(0,2).map(p=><button className="preset-other" key={p.id} onClick={()=>{setActive(p.id);notify('已切换写法')}}><span>{p.name}</span><small>{p.scene}</small><ChevronRight size={16}/></button>)}</section>
    <div className="section-label"><span>做一套新的写法</span><span>先选场景</span></div><div className="scene-tabs">{scenes.map(s=><button key={s.id} onClick={()=>setScene(s.id)} className={scene===s.id?'on':''}>{s.name}</button>)}</div>
    <section className="glass-card chat"><div className="chat-header"><span className="bot-avatar"><Sparkles size={19}/></span><div><b>Hermes</b><small>你的表达搭档</small></div><i className="green-dot"/></div>
      {phase==='start'&&<><div className="bubble">你想怎样表达？直接告诉我，也可以给我一段喜欢的文字。</div><div className="method-grid"><button onClick={()=>begin('describe')}><Pencil size={21}/><b>直接说要求</b><small>最快开始</small></button><button onClick={()=>begin('example')}><AlignLeft size={21}/><b>给我一个例子</b><small>从文字找规律</small></button><button onClick={()=>begin('compare')}><MessageCircle size={21}/><b>聊一聊</b><small>比较两种写法</small></button></div></>}
      {phase==='ask'&&<><button className="back" onClick={()=>setPhase('start')}><ArrowLeft size={14}/> 换一种方式</button><div className="bubble">{method==='compare'?'同一句话，两种写法。哪一版更像你会发出去的？':method==='example'?'贴一段你满意的表达。我只提取写法，不把人名和事实记成偏好。':`在「${sceneName}」场景，你希望 Saylo 怎样帮你写？`}</div>{assist>0&&<div className="pacer-hint"><Sparkles size={14}/><span>{assist===1?'换个角度想：如果这是发给朋友或同事，你会怎么写？':assist===2?'没关系，可以先跳过，保留默认写法。':'我们可以先停在这里，下次再继续。'}</span></div>}{method==='compare'?<><div className="raw-text"><small>原话</small>{utterance}</div><div className="comparison"><button onClick={()=>choose('a')}><small>A · 简洁直接</small><p>周五三点找老张确认预算，请他带上报表。</p></button><button onClick={()=>choose('b')}><small>B · 自然完整</small><p>周五下午三点和老张确认一下预算，也别忘了提醒他带上报表。</p></button></div><div className="neutral"><button onClick={()=>choose('both')}>都可以</button><button onClick={()=>choose('neither')}>都不像</button><button onClick={()=>{setPhase('start');notify('已跳过，不记录偏好')}}>跳过</button></div></>:<><div className="composer"><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={method==='example'?'粘贴你喜欢的表达…':'例如：少一点客套，先说重点…'} aria-label="输入写法要求"/><button onClick={submit} disabled={!input.trim()} aria-label="发送"><Send size={19}/></button></div><button className="skip" onClick={()=>{setRule('保留自然表达，不添加额外客套。');setPhase('review')}}>先用默认写法 <ArrowRight size={14}/></button></>}</>}
      {phase==='review'&&<><div className="bubble">我整理成了这条规则。你可以修改，再用同一句话看看效果。</div><label className="field">预设名字<input value={name} maxLength={20} onChange={e=>setName(e.target.value)}/></label><label className="field">写法规则<textarea value={rule} onChange={e=>setRule(e.target.value)} placeholder="写下你的表达习惯…"/></label><div className="compare-title">同一句，看看效果 <small>示例预览</small></div><div className="preview-pair"><div><small>原话</small><p>{utterance}</p></div><div><small>按这套写法</small><p>周五下午三点和老张确认预算，也请他带上报表。</p></div></div><div className="actions"><PillButton ghost onClick={()=>setPhase('start')}>重新开始</PillButton><PillButton onClick={save}>保存并启用 <Check size={16}/></PillButton></div></>}
      {phase==='saved'&&<div className="saved"><span><Check size={26}/></span><h2>这套写法记住了</h2><p>「{name}」已经启用。你可以随时回来修改。</p><PillButton ghost onClick={()=>setPhase('start')}><Plus size={16}/> 再做一套</PillButton></div>}
    </section><p className="demo-disclaimer">交互演示 · 数据仅保存在当前浏览器</p>
  </div>
}
function Profile({theme,setTheme,notify}){
  const [notifications,setNotifications]=useStore('saylo-demo-notifications',true)
  return <div className="page profile"><div className="profile-intro"><div className="avatar">允</div><div><span className="eyebrow">MY SAYLO</span><h1>好好表达，<br/>自在生活。</h1><p>范同学 · 个人账户</p></div></div><div className="plan-card"><div className="plan-top"><span><Crown size={17}/> SAYLO PLUS</span><b>体验中</b></div><h2>你的声音，值得更多可能。</h2><p>本周已使用 38 / 60 分钟</p><div className="progress"><i/></div><div className="plan-bottom"><small>下次更新 · 周一</small><button onClick={()=>notify('静态原型：查看方案')}>查看方案 <ArrowRight size={14}/></button></div></div>
    <div className="section-label"><span>账户与偏好</span></div><section className="glass-card settings">{[[Clock3,'使用记录','查看最近的表达','purple'],[CreditCard,'订阅与额度','管理你的方案','yellow'],[ShieldCheck,'隐私与数据','管理写法和记录','mint']].map(([I,a,b,c])=><button key={a} onClick={()=>notify(`静态原型：${a}`)}><span className={'setting-icon '+c}><I size={19}/></span><span><b>{a}</b><small>{b}</small></span><ChevronRight size={18}/></button>)}</section>
    <div className="section-label"><span>邀请朋友</span></div><section className="glass-card invite"><div className="invite-art"><Heart size={25}/><Sparkles size={16}/></div><div><b>好表达，一起分享</b><p>邀请朋友加入，彼此都能获得额外时长。</p></div><PillButton ghost onClick={()=>{navigator.clipboard?.writeText('SAYLO-FRIEND');notify('邀请码已复制')}}><Copy size={16}/> 复制邀请码</PillButton></section>
    <div className="section-label"><span>显示与帮助</span></div><section className="glass-card settings"><button onClick={()=>setTheme(theme==='light'?'dark':'light')}><span className="setting-icon purple">{theme==='light'?<Moon size={19}/>:<Sun size={19}/>}</span><span><b>外观</b><small>浅色 / 深色</small></span><em>{theme==='light'?'浅色':'深色'}</em><ChevronRight size={18}/></button><div className="setting-row"><span className="setting-icon yellow"><Sparkles size={19}/></span><span><b>提醒</b><small>只发送必要通知</small></span><button className={'switch '+(notifications?'on':'')} role="switch" aria-checked={notifications} aria-label="提醒" onClick={()=>setNotifications(!notifications)}><i/></button></div><button onClick={()=>notify('静态原型：帮助与反馈')}><span className="setting-icon mint"><CircleHelp size={19}/></span><span><b>帮助与反馈</b><small>有问题，我们在这里</small></span><ChevronRight size={18}/></button></section><p className="footer-quote">Saylo · 让每句话都恰到好处</p>
  </div>
}
function App(){
  const [tab,setTab]=useState('home'),[theme,setTheme]=useStore('saylo-theme','light'),[scene,setScene]=useStore('saylo-scene','casual'),[selected,setSelected]=useStore('saylo-languages',['简体中文']),[presets,setPresets]=useStore('saylo-presets',defaults),[toast,setToast]=useState('')
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme])
  function notify(s){setToast(s);clearTimeout(window.sayloToast);window.sayloToast=setTimeout(()=>setToast(''),2400)}
  function go(t){setTab(t);document.querySelector('.app-scroll')?.scrollTo({top:0,behavior:'smooth'})}
  const labels={home:['Saylo','语音整理键盘'],agent:['我的写法','让每一句更像你'],profile:['我的','你的 Saylo 空间']}
  return <div className="showcase"><aside className="showcase-copy"><span>DESIGN PREVIEW / 01</span><h2>说出来，<br/><em>就写好了。</em></h2><p>按照看板讨论重新搭建的三页静态原型。试试切换主题、风格，或和 Hermes 做一套自己的写法。</p><div className="showcase-tag"><i/> REACT · INTERACTIVE MOCKUP</div></aside><div className="device"><div className="app"><div className="status"><b>9:41</b><i/><span>●●●　◕　▰</span></div><div className="app-scroll"><header className="header"><div className="header-brand"><Logo/><div><strong>{labels[tab][0]}</strong><small>{labels[tab][1]}</small></div></div><button onClick={()=>setTheme(theme==='light'?'dark':'light')} aria-label="切换浅深色主题">{theme==='light'?<Moon size={20}/>:<Sun size={20}/>}</button></header>{tab==='home'?<Home scene={scene} setScene={setScene} selected={selected} setSelected={setSelected} go={go} notify={notify}/>:tab==='agent'?<Agent scene={scene} setScene={setScene} presets={presets} setPresets={setPresets} notify={notify}/>:<Profile theme={theme} setTheme={setTheme} notify={notify}/>}</div><nav className="tabbar" aria-label="主导航"><button className={tab==='home'?'active':''} onClick={()=>go('home')} aria-current={tab==='home'?'page':undefined}><House size={22} fill={tab==='home'?'currentColor':'none'}/><span>首页</span></button><button className={tab==='agent'?'active':''} onClick={()=>go('agent')} aria-current={tab==='agent'?'page':undefined}><WandSparkles size={22}/><span>我的写法</span></button><button className={tab==='profile'?'active':''} onClick={()=>go('profile')} aria-current={tab==='profile'?'page':undefined}><UserRound size={22} fill={tab==='profile'?'currentColor':'none'}/><span>我的</span></button></nav>{toast&&<div className="toast" role="status">{toast}</div>}</div></div></div>
}
createRoot(document.getElementById('root')).render(<App/>)
