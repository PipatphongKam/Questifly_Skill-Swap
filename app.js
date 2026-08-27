/* ============================================================
   QUESTIFLY — App Logic (Clean Rebuild)
   Knowledge Exchange Platform
   ============================================================ */

// ---- STATE ----
const state = {
    quests: [],
    myQuestIds: new Set(),
    filter: 'all',
    searchTerm: '',
    postedCount: 0,
    acceptedCount: 0,
};

// ---- MOCK DATA ----
const MOCK_QUESTS = [
    {
        id: 'q1',
        want: 'สอนพื้นฐาน Python',
        offer: 'สอน Graphic Design เบื้องต้น',
        desc: 'ตอนนี้กำลังหัดเขียนโค้ดอยู่ครับ ติดเรื่อง Loop และ Dictionary พอมีเวลาช่วยอธิบายสั้นๆ ได้ไหมครับ ผมจะสอนใช้ Photoshop ให้เป็นการแลกเปลี่ยนน้า',
        category: 'coding',
        duration: '45 นาที',
        author: 'สโรชา',
        avatarSeed: 'Sarocha',
        time: '2 ชม. ที่แล้ว',
    },
    {
        id: 'q2',
        want: 'ติว Calculus 1',
        offer: 'สอนจับคอร์ดกีตาร์ 4 คอร์ดแรก',
        desc: 'ตาย... integration by parts ไม่ผ่านเลยค่ะ 😂 ใครว่างมาช่วยก่อน midterm บ้าง แลกกับการสอนกีตาร์เบสิคนะคะ',
        category: 'academic',
        duration: '30 นาที',
        author: 'มินณิดา',
        avatarSeed: 'Minnida',
        time: '30 นาทีที่แล้ว',
    },
    {
        id: 'q3',
        want: 'คุยภาษาอังกฤษแบบ Native',
        offer: 'สอนภาษาสเปนพื้นฐาน',
        desc: 'ขอเพื่อนคุยภาษาอังกฤษแบบไม่เกร็งครับ มาฝึกสนทนากัน แลกกับผมสอนภาษาสเปนง่าย ๆ ตั้งแต่เบสิคเลย',
        category: 'language',
        duration: '1 ชั่วโมง',
        author: 'คาร์ลอส',
        avatarSeed: 'Carlos',
        time: '1 ชม. ที่แล้ว',
    },
    {
        id: 'q4',
        want: 'ฝึกวาดรูปดิจิตอล Procreate',
        offer: 'อธิบาย React Hooks อย่างละเอียด',
        desc: 'ผมสอนโค้ด React ได้ดี แต่อยากหัดวาดรูปสไตล์ Cozy Illustration บ้างครับ ใครถนัดวาดรูปมาแลกกันได้เลย!',
        category: 'skills',
        duration: '1.5 ชั่วโมง',
        author: 'อเล็กซ์',
        avatarSeed: 'Alex',
        time: '5 นาทีที่แล้ว',
    },
    {
        id: 'q5',
        want: 'ฝึก IELTS Speaking Part 2',
        offer: 'ช่วยตรวจและแก้ไข Essay',
        desc: 'กำลังเตรียมสอบ IELTS อยู่ค่ะ อยากหาคู่ซ้อมพูดแบบไม่กดดัน เดี๋ยวช่วยตรวจ Essay แล้วก็ให้ feedback ภาษาอังกฤษให้ด้วยนะคะ',
        category: 'language',
        duration: '40 นาที',
        author: 'เจน',
        avatarSeed: 'Jane',
        time: '4 ชม. ที่แล้ว',
    },
    {
        id: 'q6',
        want: 'เรียนทำ Latte Art',
        offer: 'สอนตัดต่อวิดีโอ CapCut',
        desc: 'ทำกาแฟที่บ้านบ่อยมาก อยากเรียนวิธีทำ Latte Art ง่ายๆ สักลายหนึ่ง แลกกับสอนตัดต่อคลิปสั้นๆ ใน CapCut นะจ๊ะ',
        category: 'skills',
        duration: '30 นาที',
        author: 'นิก',
        avatarSeed: 'Nick',
        time: '6 ชม. ที่แล้ว',
    },
];

// ---- CATEGORY CONFIG ----
const CAT = {
    academic: { label: 'วิชาการ',  emoji: '📚', cls: 'cat-academic'  },
    coding:   { label: 'โค้ดดิ้ง', emoji: '💻', cls: 'cat-coding'    },
    skills:   { label: 'ทักษะ',    emoji: '🎨', cls: 'cat-skills'    },
    language: { label: 'ภาษา',     emoji: '🌏', cls: 'cat-language'  },
};

// ---- HELPERS ----
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function catPillHTML(cat) {
    const c = CAT[cat] || { label: cat, emoji: '🔖', cls: '' };
    return `<span class="cat-pill ${c.cls}">${c.emoji} ${c.label}</span>`;
}

function durationHTML(d) {
    return `<span class="duration-tag">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${d}
    </span>`;
}

// ---- RENDER FEED ----
function renderFeed() {
    state.quests = MOCK_QUESTS;
    const list = $('#feed-list');
    const filtered = state.quests.filter(q => {
        const matchCat = state.filter === 'all' || q.category === state.filter;
        const matchSearch = !state.searchTerm ||
            q.want.toLowerCase().includes(state.searchTerm) ||
            q.offer.toLowerCase().includes(state.searchTerm) ||
            q.desc.toLowerCase().includes(state.searchTerm);
        return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        list.innerHTML = `<div class="empty-state"><span class="empty-icon">🔍</span><p>ไม่พบงานที่ตรงกับการค้นหา</p></div>`;
        return;
    }

    list.innerHTML = filtered.map((q, i) => cardHTML(q, i)).join('');

    // Attach events
    $$('.quest-card', list).forEach(card => {
        const id = card.dataset.id;
        card.addEventListener('click', () => openDetail(id));
    });
    $$('.btn-accept', list).forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation(); acceptQuest(btn.dataset.id, btn); });
    });
}

function cardHTML(q, i) {
    const isAccepted = state.myQuestIds.has(q.id);
    return `
    <div class="quest-card" data-id="${q.id}" style="animation-delay:${i * 0.07}s">
        <div class="card-meta">
            <div class="card-author">
                <img class="author-avatar" width="28" height="28" src="https://api.dicebear.com/7.x/lorelei/svg?seed=${q.avatarSeed}&backgroundColor=c0aede,b6e3f4,d1d4f9,ffd5dc,ffdfbf" alt="${q.author}">
                <span class="author-name">${q.author}</span>
            </div>
            <span class="card-time">${q.time}</span>
        </div>
        ${catPillHTML(q.category)}
        <h3 class="card-title">${q.want}</h3>
        <div class="exchange-row">
            <span class="ex-icon">🤝</span>
            <div class="ex-body">
                <p class="ex-label">สิ่งที่ได้รับกลับมา</p>
                <p class="ex-value">${q.offer}</p>
            </div>
        </div>
        <p class="card-desc">${q.desc}</p>
        <div class="card-footer">
            ${durationHTML(q.duration)}
            <button class="btn-accept ${isAccepted ? 'accepted' : ''}" data-id="${q.id}" ${isAccepted ? 'disabled' : ''}>
                ${isAccepted ? '✓ ส่งคำขอแล้ว' : 'ขอแลกเปลี่ยน'}
            </button>
        </div>
    </div>`;
}

// ---- RENDER MY QUESTS ----
function renderMyQuests() {
    const list = $('#my-quests-list');
    const mine = state.quests.filter(q => state.myQuestIds.has(q.id));
    if (mine.length === 0) {
        list.innerHTML = `<div class="empty-state"><span class="empty-icon">🌱</span><p>ยังไม่มีการแลกเปลี่ยนเลยน้า</p><p class="empty-sub">กดปุ่ม <strong>หน้าหลัก</strong> แล้วเลือกงานที่สนใจ</p></div>`;
        return;
    }
    list.innerHTML = mine.map((q, i) => cardHTML(q, i)).join('');
    $$('.quest-card', list).forEach(card => {
        card.addEventListener('click', () => openDetail(card.dataset.id));
    });
}

// ---- ACCEPT QUEST ----
function acceptQuest(id, btn) {
    if (state.myQuestIds.has(id)) return;
    state.myQuestIds.add(id);
    state.acceptedCount++;
    $('#stat-accepted').textContent = state.acceptedCount;
    btn.textContent = '✓ ส่งคำขอแล้ว';
    btn.classList.add('accepted');
    btn.disabled = true;
}

// ---- DETAIL PANEL ----
function openDetail(id) {
    const q = state.quests.find(x => x.id === id);
    if (!q) return;
    const isAccepted = state.myQuestIds.has(id);
    $('#detail-content').innerHTML = `
        <div class="detail-header">
            <div class="detail-author-row" style="margin-bottom:12px">
                <img width="28" height="28" src="https://api.dicebear.com/7.x/lorelei/svg?seed=${q.avatarSeed}&backgroundColor=c0aede,b6e3f4" alt="">
                <span>${q.author} • ${q.time}</span>
                ${catPillHTML(q.category)}
            </div>
            <h2 class="detail-title">${q.want}</h2>
        </div>
        <div class="detail-exchange-box">
            <p class="detail-exchange-label">สิ่งที่ได้รับกลับมา 🤝</p>
            <p class="detail-exchange-value">${q.offer}</p>
        </div>
        <p class="detail-desc">${q.desc}</p>
        <div style="margin-bottom:20px">${durationHTML(q.duration)}</div>
        <div class="detail-footer">
            <button class="btn-secondary" id="detail-close-btn">ปิด</button>
            <button class="btn-confirm ${isAccepted?'accepted':''}" id="detail-accept-btn" ${isAccepted?'disabled':''}>
                ${isAccepted ? '✓ ส่งคำขอแล้ว' : '🚀 ขอแลกเปลี่ยน'}
            </button>
        </div>
    `;
    openPanel('detail-overlay');
    $('#detail-close-btn').addEventListener('click', () => closePanel('detail-overlay'));
    $('#detail-accept-btn').addEventListener('click', () => {
        acceptQuest(id, $('#detail-accept-btn'));
        renderFeed(); renderMyQuests();
    });
}

// ---- SCREEN NAVIGATION ----
function goScreen(name) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    const target = $(`#screen-${name}`);
    if (target) {
        target.classList.add('active');
        if (name === 'myquests') renderMyQuests();
    }
    $$('.nav-btn[data-screen]').forEach(b => b.classList.remove('active'));
    const btn = $(`.nav-btn[data-screen="${name}"]`);
    if (btn) btn.classList.add('active');
}

// ---- PANEL ----
function openPanel(id) { $(`#${id}`).classList.add('open'); }
function closePanel(id) { $(`#${id}`).classList.remove('open'); }

// ---- SEARCH & FILTER ----
function initSearchAndFilter() {
    $('#search-input').addEventListener('input', e => {
        state.searchTerm = e.target.value.toLowerCase();
        renderFeed();
    });

    $$('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            $$('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.filter = chip.dataset.cat;
            renderFeed();
        });
    });
}

// ---- POST FORM ----
function initPostForm() {
    $('#submit-post').addEventListener('click', () => {
        const want     = $('#f-want').value.trim();
        const offer    = $('#f-offer').value.trim();
        const desc     = $('#f-desc').value.trim();
        const category = $('#f-category').value;
        const duration = $('#f-duration').value;

        if (!want || !offer) {
            alert('กรอกข้อมูลให้ครบก่อนน้า! 🙏');
            return;
        }

        const newQuest = {
            id: 'user_' + Date.now(),
            want, offer, desc: desc || 'ไม่มีรายละเอียดเพิ่มเติม',
            category, duration,
            author: 'คุณ', avatarSeed: 'You',
            time: 'เพิ่งโพสต์',
        };
        state.quests.unshift(newQuest);
        state.postedCount++;
        $('#stat-posted').textContent = state.postedCount;
        closePanel('post-overlay');
        goScreen('feed');
        renderFeed();

        // Reset form
        ['#f-want','#f-offer','#f-desc'].forEach(sel => $(sel).value = '');
    });
}

// ---- INIT ----
function init() {
    state.quests = MOCK_QUESTS;

    // Nav buttons
    $$('.nav-btn[data-screen]').forEach(btn => {
        btn.addEventListener('click', () => {
            const scr = btn.dataset.screen;
            if (scr.includes('placeholder')) {
                goScreen('myquests'); // placeholder fallback
                return;
            }
            goScreen(scr);
        });
    });

    // FAB
    $('#fab-btn').addEventListener('click', () => openPanel('post-overlay'));
    $('#open-post').addEventListener('click', () => openPanel('post-overlay'));

    // Profile button
    $('#profile-btn').addEventListener('click', () => openPanel('profile-overlay'));
    $('#open-profile').addEventListener('click', () => openPanel('profile-overlay'));

    // Close overlays by clicking backdrop
    $$('.panel-overlay').forEach(ov => {
        ov.addEventListener('click', e => {
            if (e.target === ov) closePanel(ov.id);
        });
    });

    initSearchAndFilter();
    initPostForm();
    renderFeed();

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

document.addEventListener('DOMContentLoaded', init);
