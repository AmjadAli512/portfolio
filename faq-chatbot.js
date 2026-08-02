(function () {
    const embeddedFallback = {
        bot_name: "Amjad Ali Portfolio FAQ",
        fallback: "I'm not sure about that. Try asking about my education, projects, skills, experience, or contact details.",
        data: [
            {
                id: "about_overview",
                keywords: ["about", "who are you", "who is amjad ali", "your summary"],
                answer: "Amjad Ali is a Software Engineering student at NUML University, Islamabad, focused on practical web, mobile, and automation solutions."
            },
            {
                id: "education",
                keywords: ["education", "degree", "university", "study", "qualification"],
                answer: "I am a Software Engineering student at NUML University, Islamabad."
            },
            {
                id: "skills_core_knowledge",
                keywords: ["skills", "technical skills", "what skills do you have", "expertise"],
                answer: "My core skills include full stack web development, Flutter mobile development, API integration, and database management."
            },
            {
                id: "projects_overview",
                keywords: ["projects", "portfolio", "what have you built"],
                answer: "My projects include weather forecasting, hostel management, smart home UI/UX, ride-hailing concept, and AI e-commerce automation."
            },
            {
                id: "experience_technical_development",
                keywords: ["experience", "technical development", "company collaborator", "sales representative"],
                answer: "I have experience in IT collaboration, client communication, data verification, and hands-on web/mobile development."
            },
            {
                id: "contact",
                keywords: ["contact", "email", "phone", "call"],
                answer: "Email: amjadanjum05@gmail.com | Phone: 03489929137"
            }
        ]
    };

    const state = {
        faq: embeddedFallback,
        history: [],
        isOpen: false,
        isDragging: false,
        isMinimized: false,
        isMaximized: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        pointerId: null,
        frame: null,
        pendingX: 0,
        pendingY: 0,
        normalRect: null
    };

    let launcher;
    let panel;
    let titleBar;
    let body;
    let input;

    function normalize(text) {
        return (text || "")
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function tokenize(text) {
        const normalized = normalize(text);
        return normalized ? normalized.split(" ") : [];
    }

    function levenshtein(a, b) {
        if (!a) return b.length;
        if (!b) return a.length;

        const rows = b.length + 1;
        const cols = a.length + 1;
        const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

        for (let c = 0; c < cols; c += 1) matrix[0][c] = c;
        for (let r = 0; r < rows; r += 1) matrix[r][0] = r;

        for (let r = 1; r < rows; r += 1) {
            for (let c = 1; c < cols; c += 1) {
                const cost = a[c - 1] === b[r - 1] ? 0 : 1;
                matrix[r][c] = Math.min(
                    matrix[r - 1][c] + 1,
                    matrix[r][c - 1] + 1,
                    matrix[r - 1][c - 1] + cost
                );
            }
        }

        return matrix[b.length][a.length];
    }

    function scoreKeywordMatch(query, keyword) {
        const q = normalize(query);
        const k = normalize(keyword);
        if (!q || !k) return 0;

        if (q.length < 3) return 0;
        if (["no", "yes", "ok", "okay", "hi", "yo"].includes(q)) return 0;

        if (q === k) return 1;
        if (q.includes(k) || k.includes(q)) return 0.9;

        const queryTokens = tokenize(q);
        const keywordTokens = tokenize(k);
        const tokenOverlap = keywordTokens.filter((token) => queryTokens.includes(token)).length;
        const overlapScore = tokenOverlap / Math.max(keywordTokens.length, 1);

        let fuzzyTokenHits = 0;
        queryTokens.forEach((qToken) => {
            const fuzzyHit = keywordTokens.some((kToken) => {
                if (qToken === kToken) return true;
                const maxLen = Math.max(qToken.length, kToken.length);
                if (maxLen === 0) return false;
                const ratio = 1 - (levenshtein(qToken, kToken) / maxLen);
                return ratio >= 0.8;
            });

            if (fuzzyHit) fuzzyTokenHits += 1;
        });

        const fuzzyTokenScore = fuzzyTokenHits / Math.max(queryTokens.length, 1);

        const maxLen = Math.max(q.length, k.length);
        const editRatio = 1 - (levenshtein(q, k) / Math.max(maxLen, 1));

        return Math.max(overlapScore * 0.9, fuzzyTokenScore * 0.85, editRatio * 0.58);
    }

    function getEntryById(id) {
        const list = Array.isArray(state.faq.data) ? state.faq.data : [];
        return list.find((item) => normalize(item.id) === normalize(id)) || null;
    }

    function pickByIntent(query) {
        const q = normalize(query);

        const intentRules = [
            {
                test: /(hi|hello|hey|assalam|salam)/,
                response: "Hi. Ask me about education, projects, skills, experience, or contact details."
            },
            {
                test: /(what you offering|what are you offering|what services do you offer|which services are you offering|what do you offer|services|service|offer|offerings)/,
                ids: ["services_offered"]
            },
            {
                test: /(do you know apis|api integration|api|apis|rest api|connect api|use api)/,
                ids: ["api_capability"]
            },
            {
                test: /(can you connect database|connect database|database integration|mysql|oracle sql|sql|database backend)/,
                ids: ["database_capability"]
            },
            {
                test: /(worked with clients|client work|client experience|international clients|u\.s\. clients|us clients|customer interaction)/,
                ids: ["client_experience"]
            },
            {
                test: /(can you collaborate with me|can we collaborate|collaborate|work with me|work together|partner|partnership|team up|freelance work|available for work|open for work|hire you)/,
                ids: ["hiring_availability", "collaboration_offer", "availability_work"]
            },
            {
                test: /(how much cost|how much do you charge|how much will it cost|price|pricing|cost|budget|project cost|flutter project cost|web project cost)/,
                ids: ["pricing_discussion"]
            },
            {
                test: /(qualification|education|degree|university|study)/,
                ids: ["education"]
            },
            {
                test: /(do you know flutter|flutter|mobile apps|build mobile apps|can you build mobile apps|app development|android app|ios app)/,
                ids: ["flutter_capability"]
            },
            {
                test: /(do you do web development|web developer|i need web developer|web development|frontend|backend|full stack|website|web app|responsive websites|make website|build a website)/,
                ids: ["responsive_websites", "web_capability"]
            },
            {
                test: /(github link|source code|live demo|demo|show demo|portfolio link|show me your work|github)/,
                ids: ["demo_request"]
            },
            {
                test: /(skills|skill|expertise|specialize|technical)/,
                ids: ["capability_summary", "about_technical_focus", "skills_core_knowledge", "skills_web_mobile", "skills_languages"]
            },
            {
                test: /(project|portfolio|built|make|develop|what projects have you made|what projects have you done|what is your weather app|ai projects|any projects|what u built|any live project)/,
                ids: ["projects_overview", "project_weather_app", "project_hostel_management", "project_smart_home", "project_ride_hailing", "project_ai_ecommerce"]
            },
            {
                test: /(experience|collaborator|sales representative|data entry|office tools|how many experience|real world experience|role in your company|company role|do u have experience|fresher or experienced|internship ki hai)/,
                ids: ["experience_summary", "company_role", "experience_it_company_collaborator", "experience_sales_representative", "experience_data_entry", "experience_technical_development"]
            },
            {
                test: /(about|who is amjad ali|who is amjad|your summary|profile|tell me about yourself|introduce yourself|what makes you different|why did you choose software engineering|why flutter|what are you learning now)/,
                ids: ["about_overview", "hero_title"]
            },
            {
                test: /(goal|vision|future|entrepreneur|future plans|what are your goals)/,
                ids: ["vision"]
            },
            {
                test: /(phone|email|contact|location|call|can i call you|how can i contact you|are you in pakistan|available globally)/,
                ids: ["contact_email", "contact_phone", "contact_location"]
            }
        ];

        for (const rule of intentRules) {
            if (!rule.test.test(q)) continue;

            if (rule.response) {
                return { answer: rule.response };
            }

            if (Array.isArray(rule.ids)) {
                for (const id of rule.ids) {
                    const found = getEntryById(id);
                    if (found) return found;
                }
            }
        }

        return null;
    }

    function findBestMatch(query) {
        const list = Array.isArray(state.faq.data) ? state.faq.data : [];
        let best = null;
        let bestScore = 0;

        const normalizedQuery = normalize(query);
        const directId = list.find((item) => normalize(item.id) === normalizedQuery.replace(/\s+/g, "_"));
        if (directId) return directId;

        for (const item of list) {
            if (!Array.isArray(item.keywords)) continue;

            for (const kw of item.keywords) {
                const score = scoreKeywordMatch(query, kw);
                if (score > bestScore) {
                    bestScore = score;
                    best = item;
                }
            }
        }

        return bestScore >= 0.42 ? best : null;
    }

    function findTopMatches(query, limit = 3) {
        const list = Array.isArray(state.faq.data) ? state.faq.data : [];
        const scored = [];

        for (const item of list) {
            if (!Array.isArray(item.keywords)) continue;

            let itemScore = 0;
            for (const kw of item.keywords) {
                const score = scoreKeywordMatch(query, kw);
                if (score > itemScore) itemScore = score;
            }

            if (itemScore >= 0.3) {
                scored.push({ item, score: itemScore });
            }
        }

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, limit);
    }

    function firstSentence(text) {
        if (!text) return "";
        const idx = text.indexOf(".");
        if (idx === -1) return text.trim();
        return text.slice(0, idx + 1).trim();
    }

    function findById(id) {
        const list = Array.isArray(state.faq.data) ? state.faq.data : [];
        return list.find((entry) => entry.id === id) || null;
    }

    function buildGenerativeResponse(query, primaryEntry, topMatches) {
        const q = normalize(query);

        if (/(collaborate|hire|work together|work with me|freelance|available for work)/.test(q)) {
            return "Yes, I’m open to collaboration. Let’s connect and discuss your project requirements.";
        }

        if (/(cost|price|pricing|charge|budget)/.test(q)) {
            return "I’d be happy to discuss cost. Pricing depends on your required features, complexity, and timeline. Share your project details and I can provide a clear estimate.";
        }

        if (/(api|database|sql|flutter|mobile app|web development|full stack|responsive)/.test(q)) {
            const technicalIds = [
                "about_technical_focus",
                "skills_web_mobile",
                "api_capability",
                "database_capability",
                "skills_tools_platforms"
            ];

            const picked = technicalIds
                .map((id) => findById(id))
                .filter(Boolean)
                .slice(0, 2)
                .map((entry) => firstSentence(entry.answer));

            const technicalSummary = picked.length > 0
                ? picked.join(" ")
                : (primaryEntry ? firstSentence(primaryEntry.answer) : "I can help with modern web and mobile development workflows.");

            return `Great question. ${technicalSummary} If you share your use case, I can suggest the best implementation approach.`;
        }

        if (/(project|demo|github|work)/.test(q)) {
            const projects = findById("projects_overview");
            const base = projects ? projects.answer : (primaryEntry ? primaryEntry.answer : state.faq.fallback);
            return `${base} You can also explore the Projects section for demos and source links.`;
        }

        const topSentences = topMatches
            .slice(0, 2)
            .map((match) => firstSentence(match.item.answer))
            .filter(Boolean);

        if (topSentences.length > 1) {
            return `Thanks for asking. ${topSentences.join(" ")} Let me know if you want details for a specific project or skill.`;
        }

        if (primaryEntry?.answer) {
            return `Thanks for asking. ${primaryEntry.answer}`;
        }

        return state.faq.fallback;
    }

    function buildClarifyingQuestion(query) {
        const q = normalize(query);

        if (/(collaborate|hire|work|project)/.test(q)) {
            return "I can help. Are you asking about collaboration, project pricing, or the services I offer?";
        }

        if (/(api|database|flutter|web|full stack|responsive|technical)/.test(q)) {
            return "Can you clarify your technical need: Flutter app, web app, API integration, or database connection?";
        }

        if (/(experience|student|internship|clients|role)/.test(q)) {
            return "Do you want to know about my company role, real-world client experience, or technical project experience?";
        }

        if (/(contact|email|phone|location|pakistan)/.test(q)) {
            return "Do you want my email, phone number, or location details?";
        }

        if (/(project|demo|github|portfolio)/.test(q)) {
            return "Are you looking for project overview, live demos, or GitHub/source links?";
        }

        return "I want to answer accurately. Are you asking about services, skills, projects, experience, or contact details?";
    }

    function shouldAskClarifyingQuestion(topMatches) {
        if (!Array.isArray(topMatches) || topMatches.length === 0) {
            return true;
        }

        const topScore = topMatches[0]?.score || 0;
        const secondScore = topMatches[1]?.score || 0;

        const lowConfidence = topScore < 0.44;
        const ambiguous = topScore < 0.62 && Math.abs(topScore - secondScore) < 0.05;

        return lowConfidence || ambiguous;
    }

    function getAnswerForQuery(query) {
        const intentHit = pickByIntent(query);
        if (intentHit?.answer) return intentHit.answer;

        const matched = intentHit || findBestMatch(query);
        const topMatches = findTopMatches(query, 3);

        if (shouldAskClarifyingQuestion(topMatches)) {
            return buildClarifyingQuestion(query);
        }

        return buildGenerativeResponse(query, matched, topMatches);
    }

    function addMessage(role, text) {
        const msg = document.createElement("div");
        msg.className = `faq-chatbot-msg ${role}`;
        msg.textContent = text;
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
        state.history.push({ role, text });
    }

    function clearConversation() {
        state.history = [];
        body.innerHTML = "";
        input.value = "";
        addMessage("bot", `Hi, I am ${state.faq.bot_name}. Ask me anything about this portfolio.`);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function setPanelPosition(left, top) {
        const maxLeft = Math.max(window.innerWidth - panel.offsetWidth - 6, 6);
        const maxTop = Math.max(window.innerHeight - panel.offsetHeight - 6, 6);
        const boundedLeft = clamp(left, 6, maxLeft);
        const boundedTop = clamp(top, 6, maxTop);

        panel.style.left = `${boundedLeft}px`;
        panel.style.top = `${boundedTop}px`;
        panel.style.right = "auto";
        panel.style.bottom = "auto";
    }

    function setNormalSizeFromRect() {
        if (!state.normalRect) return;

        panel.style.width = `${Math.round(state.normalRect.width)}px`;
        panel.style.height = `${Math.round(state.normalRect.height)}px`;
        setPanelPosition(state.normalRect.left, state.normalRect.top);
    }

    function rememberNormalRect() {
        if (state.isMaximized) return;
        const rect = panel.getBoundingClientRect();
        state.normalRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        };
    }

    function openPanel() {
        state.isOpen = true;
        panel.classList.add("open");
        launcher.style.display = "none";
        input.focus();
    }

    function closePanelHardReset() {
        state.isOpen = false;
        state.isDragging = false;
        state.pointerId = null;
        state.isMinimized = false;
        state.isMaximized = false;

        panel.classList.remove("open", "minimized", "maximized");
        panel.removeAttribute("style");
        launcher.style.display = "grid";

        state.normalRect = null;
        clearConversation();
    }

    function toggleMinimize() {
        if (!state.isOpen) return;
        if (state.isMaximized) return;

        state.isMinimized = !state.isMinimized;
        panel.classList.toggle("minimized", state.isMinimized);
    }

    function toggleMaximize() {
        if (!state.isOpen) return;

        if (!state.isMaximized) {
            rememberNormalRect();
            state.isMaximized = true;
            state.isMinimized = false;
            panel.classList.remove("minimized");
            panel.classList.add("maximized");
            return;
        }

        state.isMaximized = false;
        panel.classList.remove("maximized");
        setNormalSizeFromRect();
    }

    function onSend(event) {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        addMessage("user", text);
        input.value = "";

        const answer = getAnswerForQuery(text);
        addMessage("bot", answer);
    }

    function onPointerMove(event) {
        if (!state.isDragging || event.pointerId !== state.pointerId) return;

        state.pendingX = event.clientX - state.dragOffsetX;
        state.pendingY = event.clientY - state.dragOffsetY;

        if (state.frame) return;
        state.frame = requestAnimationFrame(() => {
            setPanelPosition(state.pendingX, state.pendingY);
            state.frame = null;
        });
    }

    function stopDrag() {
        if (!state.isDragging) return;

        state.isDragging = false;
        titleBar.style.cursor = "grab";
        if (state.pointerId !== null) {
            try {
                titleBar.releasePointerCapture(state.pointerId);
            } catch (error) {
                // Pointer capture may already be released.
            }
        }

        state.pointerId = null;
        rememberNormalRect();
    }

    function onPointerDown(event) {
        if (state.isMaximized) return;
        if (event.button !== 0) return;

        state.isDragging = true;
        state.pointerId = event.pointerId;

        const rect = panel.getBoundingClientRect();
        state.dragOffsetX = event.clientX - rect.left;
        state.dragOffsetY = event.clientY - rect.top;

        titleBar.style.cursor = "grabbing";
        titleBar.setPointerCapture(event.pointerId);
    }

    async function loadFaqData() {
        if (window.portfolioFaqData && Array.isArray(window.portfolioFaqData.data)) {
            state.faq = window.portfolioFaqData;
            return;
        }

        try {
            const res = await fetch("faq-data.json");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const payload = await res.json();
            if (!payload || !Array.isArray(payload.data)) throw new Error("Invalid FAQ JSON format");
            state.faq = payload;
        } catch (error) {
            state.faq = embeddedFallback;
            console.warn("FAQ data load fallback used:", error.message);
        }
    }

    function wireEvents() {
        launcher.addEventListener("click", openPanel);

        document.getElementById("faq-chatbot-close").addEventListener("click", closePanelHardReset);
        document.getElementById("faq-chatbot-min").addEventListener("click", toggleMinimize);
        document.getElementById("faq-chatbot-max").addEventListener("click", toggleMaximize);
        document.getElementById("faq-chatbot-form").addEventListener("submit", onSend);

        titleBar.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", stopDrag);
        window.addEventListener("pointercancel", stopDrag);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && state.isOpen) {
                closePanelHardReset();
            }
        });

        window.addEventListener("resize", () => {
            if (!state.isOpen || state.isMaximized) return;
            const rect = panel.getBoundingClientRect();
            setPanelPosition(rect.left, rect.top);
            rememberNormalRect();
        });
    }

    function init() {
        launcher = document.getElementById("faq-chatbot-launcher");
        panel = document.getElementById("faq-chatbot-window");
        titleBar = document.getElementById("faq-chatbot-title");
        body = document.getElementById("faq-chatbot-body");
        input = document.getElementById("faq-chatbot-input");

        if (!launcher || !panel || !titleBar || !body || !input) return;

        loadFaqData().finally(() => {
            clearConversation();
            wireEvents();
        });
    }

    document.addEventListener("DOMContentLoaded", init);
})();
