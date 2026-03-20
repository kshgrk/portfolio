class PortfolioTerminal {
    constructor() {
        this.storageKey = "portfolio-mode";
        this.body = document.body;
        this.input = document.getElementById("commandInput");
        this.output = document.getElementById("output");
        this.modeButtons = Array.from(document.querySelectorAll("[data-mode-option]"));
        this.host = document.getElementById("terminalHost");
        this.overlay = document.getElementById("terminalOverlay");
        this.overlayContent = document.getElementById("terminalOverlayContent");
        this.commandHistory = [];
        this.historyIndex = -1;

        this.portfolioData = {
            name: "Kushagra Kaushal",
            firstName: "Kushagra",
            title: "Data Scientist & Engineer",
            location: "India",
            summary: "I design data systems, analytics workflows, and AI-enabled products that are reliable in production and useful to real teams.",
            experienceYears: "3+",
            focusAreas: ["Data Engineering", "Machine Learning", "Analytics", "Developer Tooling"],
            github: "https://github.com/kshgrk",
            linkedin: "https://linkedin.com/in/kshgrk",
            x: "https://x.com/kshgrk"
        };

        this.skillsData = {
            "Programming Languages": ["Python", "C++", "C", "SQL", "Bash"],
            "Machine Learning": ["Scikit-learn", "TensorFlow", "PyTorch", "Deep Learning", "Computer Vision", "NLP"],
            "Data Engineering": ["dbt", "Apache Airflow", "BigQuery", "Cloud SQL", "ETL Design"],
            "Cloud & Infrastructure": ["GCP", "AWS", "Kubernetes", "Docker", "Devtron CI/CD"],
            "Analytics & BI": ["Looker Studio", "Plotly", "Dash", "Experiment Analysis"],
            "Backend & Apps": ["FastAPI", "Flask", "Django", "Linux", "MySQL"]
        };

        this.projectsData = [
            {
                title: "Obelisk",
                date: "Ongoing",
                category: "AI Application Infrastructure",
                link: "https://github.com/kshgrk/obelisk",
                summary: "A real-time chat application built around Temporal workflows and modern model routing, designed for resilience and extensibility.",
                bullets: [
                    "Built a FastAPI backend and vanilla JavaScript frontend around multi-session chat workflows.",
                    "Added SQLite-backed persistence, retries, and concurrent session support.",
                    "Created an extensible registry for tools, models, and workflow orchestration."
                ]
            },
            {
                title: "IntelliCodebase",
                date: "June 2025",
                category: "Developer Tooling",
                link: "https://github.com/kshgrk/IntelliCodebase.git",
                summary: "LLM-powered codebase analysis and modernization tooling for large repositories with selective file targeting and caching.",
                bullets: [
                    "Combined Bash and Python automation to inspect repositories and focus changes where they matter.",
                    "Improved iteration speed with caching for repeated analysis on large codebases.",
                    "Supported targeted fixes, refactors, and lint-driven cleanup."
                ]
            },
            {
                title: "LSMTree-AVL",
                date: "November 2024",
                category: "Storage Systems",
                link: "https://github.com/kshgrk/LSMTree-AVL.git",
                summary: "A Python implementation of an LSM tree backed by an AVL in-memory index to explore storage-engine fundamentals.",
                bullets: [
                    "Implemented write-ahead logging, SSTables, compaction, and bloom filters.",
                    "Focused on predictable writes and efficient lookup behavior.",
                    "Used the project as a practical study of database internals."
                ]
            }
        ];

        this.experienceData = [
            {
                role: "Data Scientist",
                company: "New Engen",
                location: "Seattle, US (Remote)",
                dates: "November 2022 - Present",
                link: "https://www.newengen.com/",
                bullets: [
                    "Architected AI-powered chatbot systems using Claude and Gemini to deliver actionable marketing insights.",
                    "Designed and maintained ETL pipelines with Adverity, Python, dbt, BigQuery, and Cloud SQL on Kubernetes.",
                    "Analyzed roughly 5 TB of marketing data to surface decision-critical performance metrics.",
                    "Built dashboards in Looker Studio and contributed to the LIFT SaaS platform.",
                    "Developed forecasting and recommendation systems for pacing, budgeting, and operational efficiency."
                ]
            },
            {
                role: "Data Science Consultant",
                company: "Kauriink Pvt. Ltd.",
                location: "New Delhi, India (Remote)",
                dates: "August 2022 - November 2022",
                link: "https://www.techatplay.ai/",
                bullets: [
                    "Developed deep learning models for player performance analysis using computer vision.",
                    "Reached 87% accuracy for posture classification and 92% accuracy for shot type classification.",
                    "Applied color segmentation, sliding windows, and transfer learning to sports video analysis."
                ]
            }
        ];

        this.educationData = [
            {
                school: "Indian Institute of Information Technology, Bhopal",
                degree: "B.Tech in Information Technology"
            }
        ];

        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            skills: this.showSkills.bind(this),
            projects: this.showProjects.bind(this),
            experience: this.showExperience.bind(this),
            education: this.showEducation.bind(this),
            contact: this.showContact.bind(this),
            resume: this.showResume.bind(this),
            github: this.openGithub.bind(this),
            linkedin: this.openLinkedIn.bind(this),
            x: this.openX.bind(this),
            clear: this.clearTerminal.bind(this),
            date: this.showDate.bind(this),
            whoami: this.whoami.bind(this),
            ls: this.listFiles.bind(this),
            cat: this.catFile.bind(this),
            pwd: this.showPwd.bind(this),
            echo: this.echo.bind(this),
            theme: this.changeTheme.bind(this),
            kitty: this.showKitty.bind(this),
            mode: this.showModeHelp.bind(this)
        };

        this.init();
    }

    init() {
        this.applyStoredMode();
        this.renderSectionsFromData();
        this.renderHeroMetrics();
        this.renderSpotlight();
        this.bindEvents();
        this.updateCursorPosition();
        requestAnimationFrame(() => {
            this.body.classList.add("is-ready");
        });
    }

    bindEvents() {
        if (this.input) {
            this.input.addEventListener("keydown", this.handleKeyDown.bind(this));
            this.input.addEventListener("input", this.updateCursorPosition.bind(this));
        }

        document.addEventListener("click", (event) => {
            if (this.overlay && this.overlay.classList.contains("active")) {
                return;
            }

            const interactive = event.target.closest("a, button, input, iframe");
            if (!interactive && this.input) {
                this.input.focus();
            }
        });

        this.modeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.setMode(button.dataset.modeOption);
            });
        });

        const fsToggle = document.getElementById("terminalFullscreenToggle");
        const backdrop = document.getElementById("terminalOverlayBackdrop");
        const closeBtn = document.getElementById("terminalOverlayClose");

        if (fsToggle) {
            this.fsToggle = fsToggle;
            fsToggle.addEventListener("click", () => this.handleFullscreenToggle());
        }

        if (backdrop) {
            backdrop.addEventListener("click", () => this.exitFullscreen());
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.exitFullscreen());
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && this.overlay && this.overlay.classList.contains("active")) {
                this.exitFullscreen();
            }
        });
    }

    applyStoredMode() {
        const stored = localStorage.getItem(this.storageKey);
        const mode = stored === "tech" ? "tech" : "normal";
        this.setMode(mode, false);
    }

    setMode(mode, persist = true) {
        this.body.dataset.mode = mode;
        this.modeButtons.forEach((button) => {
            const active = button.dataset.modeOption === mode;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", active ? "true" : "false");
        });
        if (persist) {
            localStorage.setItem(this.storageKey, mode);
        }
    }

    renderHeroMetrics() {
        const metrics = [
            { value: this.portfolioData.experienceYears, label: "years in production data and ML work" },
            { value: "5 TB", label: "marketing data analyzed at scale" },
            { value: "4", label: "focus areas across data, ML, analytics, and tooling" }
        ];

        const metricsEl = document.getElementById("heroMetrics");
        if (!metricsEl) {
            return;
        }

        metricsEl.innerHTML = metrics.map((metric) => `
            <article class="metric-card">
                <span class="metric-value">${metric.value}</span>
                <span class="metric-label">${metric.label}</span>
            </article>
        `).join("");
    }

    renderSpotlight() {
        const spotlight = document.getElementById("normalSpotlight");
        if (!spotlight) {
            return;
        }

        spotlight.innerHTML = `
            <div class="spotlight-grid">
                <article class="spotlight-hero">
                    <div class="eyebrow">Selected Focus</div>
                    <h3>Building systems that turn messy data into useful decisions.</h3>
                    <p>${this.portfolioData.summary}</p>
                    <div class="spotlight-pills">
                        ${this.portfolioData.focusAreas.map((item) => `<span class="pill">${item}</span>`).join("")}
                    </div>
                </article>
                <article class="spotlight-card spotlight-stat">
                    <div class="eyebrow">Scale</div>
                    <h3>5 TB+</h3>
                    <p>Worked across large marketing datasets, production pipelines, analytics reporting, and model-driven workflows.</p>
                </article>
                <article class="spotlight-card spotlight-mini">
                    <div class="eyebrow">Mode Aware</div>
                    <p>Normal mode is cleaner for recruiters and clients. Tech mode keeps the terminal front and center for technical visitors.</p>
                    <ul class="spotlight-list">
                        <li>Command-driven exploration</li>
                        <li>Full project and experience detail</li>
                        <li>Same content, two interaction styles</li>
                    </ul>
                </article>
            </div>
        `;
    }

    renderSectionsFromData() {
        const heroTitle = document.getElementById("heroTitle");
        const heroSubtitle = document.getElementById("heroSubtitle");
        if (heroTitle) {
            heroTitle.textContent = `${this.portfolioData.firstName} builds production-grade data and AI systems.`;
        }
        if (heroSubtitle) {
            heroSubtitle.textContent = `${this.portfolioData.title} based in ${this.portfolioData.location}. ${this.portfolioData.summary}`;
        }

        const aboutEl = document.getElementById("aboutSectionContent");
        const projectsEl = document.getElementById("projectsSectionContent");
        const experienceEl = document.getElementById("experienceSectionContent");
        const skillsEl = document.getElementById("skillsSectionContent");
        const contactEl = document.getElementById("contactSectionContent");

        if (aboutEl) {
            aboutEl.innerHTML = this.renderAboutSectionHTML();
        }
        if (projectsEl) {
            projectsEl.innerHTML = this.renderProjectsSectionHTML();
        }
        if (experienceEl) {
            experienceEl.innerHTML = this.renderExperienceSectionHTML();
        }
        if (skillsEl) {
            skillsEl.innerHTML = this.renderSkillsSectionHTML();
        }
        if (contactEl) {
            contactEl.innerHTML = this.renderContactSectionHTML();
        }
    }

    renderAboutSectionHTML() {
        return `
            <div class="about-grid">
                <article class="card">
                    <p class="lede">${this.portfolioData.summary}</p>
                </article>
                <article class="card">
                    <div class="detail-list">
                        <div class="detail-item"><strong>Name</strong><br>${this.portfolioData.name}</div>
                        <div class="detail-item"><strong>Role</strong><br>${this.portfolioData.title}</div>
                        <div class="detail-item"><strong>Location</strong><br>${this.portfolioData.location}</div>
                        <div class="detail-item"><strong>Focus Areas</strong><br>${this.portfolioData.focusAreas.join(", ")}</div>
                    </div>
                </article>
            </div>
        `;
    }

    renderProjectsSectionHTML() {
        return `
            <div class="project-grid">
                ${this.projectsData.map((project) => `
                    <article class="project-card">
                        <div class="eyebrow">${project.category}</div>
                        <h3>${project.title}</h3>
                        <div class="project-meta">
                            <span>${project.date}</span>
                            <a href="${project.link}" target="_blank" rel="noreferrer">Repository</a>
                        </div>
                        <p class="lede">${project.summary}</p>
                        <ul class="bullet-list">
                            ${project.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
                        </ul>
                    </article>
                `).join("")}
            </div>
        `;
    }

    renderExperienceSectionHTML() {
        return `
            <div class="experience-grid">
                ${this.experienceData.map((item) => `
                    <article class="timeline-card">
                        <div class="eyebrow">${item.company}</div>
                        <h3>${item.role}</h3>
                        <div class="timeline-meta">
                            <span>${item.dates}</span>
                            <span>${item.location}</span>
                            <a href="${item.link}" target="_blank" rel="noreferrer">Company Site</a>
                        </div>
                        <ul class="bullet-list">
                            ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
                        </ul>
                    </article>
                `).join("")}
                ${this.educationData.map((edu) => `
                    <article class="timeline-card">
                        <div class="eyebrow">Education</div>
                        <h3>${edu.school}</h3>
                        <p class="meta-line"><strong>Degree</strong><br>${edu.degree}</p>
                    </article>
                `).join("")}
            </div>
        `;
    }

    renderSkillsSectionHTML() {
        return `
            <div class="skills-grid">
                ${Object.entries(this.skillsData).map(([label, items]) => `
                    <article class="skill-card">
                        <h3>${label}</h3>
                        <div class="skill-tags">
                            ${items.map((item) => `<span class="pill">${item}</span>`).join("")}
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }

    renderContactSectionHTML() {
        return `
            <div class="contact-grid">
                <article class="contact-card">
                    <div class="eyebrow">Reach Out</div>
                    <h3>Start a conversation</h3>
                    <div class="contact-links">
                        <a href="${this.portfolioData.linkedin}" target="_blank" rel="noreferrer">LinkedIn Messages</a>
                        <a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a>
                    </div>
                </article>
                <article class="contact-card">
                    <div class="eyebrow">Profiles</div>
                    <h3>Find me online</h3>
                    <div class="contact-links">
                        <a href="${this.portfolioData.github}" target="_blank" rel="noreferrer">GitHub</a>
                        <a href="${this.portfolioData.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
                        <a href="${this.portfolioData.x}" target="_blank" rel="noreferrer">X</a>
                    </div>
                </article>
            </div>
        `;
    }

    isFullscreenActive() {
        return this.overlay && this.overlay.classList.contains("active");
    }

    handleFullscreenToggle() {
        if (this.isFullscreenActive()) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    enterFullscreen() {
        if (!this.overlay || !this.overlayContent || this.isFullscreenActive()) {
            return;
        }

        const terminal = this.host.querySelector(".terminal-container");
        this.placeholder = document.createElement("div");
        this.placeholder.style.display = "contents";
        this.host.insertBefore(this.placeholder, terminal);
        this.overlayContent.innerHTML = "";
        this.overlayContent.appendChild(terminal);
        this.overlay.classList.add("active");

        if (this.fsToggle) {
            this.fsToggle.textContent = "✕";
            this.fsToggle.title = "Close";
        }

        if (this.input) {
            this.input.focus();
        }
    }

    exitFullscreen() {
        if (!this.overlay || !this.overlayContent || !this.placeholder || !this.isFullscreenActive()) {
            return;
        }

        const terminal = this.overlayContent.querySelector(".terminal-container");
        this.host.insertBefore(terminal, this.placeholder);
        this.placeholder.remove();
        this.overlay.classList.remove("active");

        if (this.fsToggle) {
            this.fsToggle.textContent = "⛶";
            this.fsToggle.title = "Fullscreen";
        }

        if (this.input) {
            this.input.focus();
        }
    }

    handleKeyDown(event) {
        switch (event.key) {
            case "Enter":
                this.executeCommand();
                break;
            case "ArrowUp":
                event.preventDefault();
                this.navigateHistory(-1);
                break;
            case "ArrowDown":
                event.preventDefault();
                this.navigateHistory(1);
                break;
            case "Tab":
                event.preventDefault();
                this.autoComplete();
                break;
            default:
                break;
        }
    }

    executeCommand() {
        const command = this.input.value.trim();
        if (!command) {
            return;
        }

        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;

        this.addToOutput(`
            <div class="command-line">
                <span class="command-prompt">-&gt; kushagra@portfolio:~$</span>
                <span class="command-text">${command}</span>
            </div>
        `);

        const [cmd, ...args] = command.split(" ");
        const cmdLower = cmd.toLowerCase();

        if (this.commands[cmdLower]) {
            this.commands[cmdLower](args);
        } else {
            this.addToOutput(`<div class="detail-line-terminal">command not found: ${cmd}. type 'help' for available commands.</div>`);
        }

        this.input.value = "";
        this.updateCursorPosition();
        this.scrollToBottom();
    }

    navigateHistory(direction) {
        if (!this.commandHistory.length) {
            return;
        }

        this.historyIndex += direction;
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = "";
            this.updateCursorPosition();
            return;
        }

        this.input.value = this.commandHistory[this.historyIndex] || "";
        this.updateCursorPosition();
    }

    autoComplete() {
        const partial = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter((cmd) => cmd.startsWith(partial));

        if (matches.length === 1) {
            this.input.value = matches[0];
            this.updateCursorPosition();
        } else if (matches.length > 1) {
            this.addToOutput(`<div class="detail-line-terminal">available commands: ${matches.join(", ")}</div>`);
            this.scrollToBottom();
        }
    }

    addToOutput(content) {
        this.output.innerHTML += `<div class="command-output">${content}</div>`;
    }

    scrollToBottom() {
        const terminalBody = document.querySelector(".terminal-body");
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    updateCursorPosition() {
        const cursor = document.querySelector(".cursor");
        const prompt = document.querySelector(".prompt");
        if (!cursor || !prompt || !this.input) {
            return;
        }

        const charWidth = 8.1;
        const promptWidth = prompt.offsetWidth;
        const textWidth = this.input.value.length * charWidth;
        cursor.style.left = `${promptWidth + textWidth + 2}px`;
    }

    clearTerminal() {
        this.output.innerHTML = "";
    }

    showHelp() {
        this.addToOutput(`
            <div class="detail-line-terminal">portfolio commands</div>
            <div class="detail-line-terminal">about, skills, projects, experience, education, contact, resume</div>
            <div class="detail-line-terminal">external links</div>
            <div class="detail-line-terminal">github, linkedin, x</div>
            <div class="detail-line-terminal">system commands</div>
            <div class="detail-line-terminal">help, clear, date, whoami, pwd, ls, cat [file], echo [text], theme [name], mode, kitty</div>
            <div class="detail-line-terminal">themes</div>
            <div class="detail-line-terminal">matrix, cyberpunk, retro</div>
        `);
    }

    showAbout() {
        this.addToOutput(`
            <div class="detail-line-terminal">${this.portfolioData.name}</div>
            <div class="detail-line-terminal">${this.portfolioData.title}</div>
            <div class="detail-line-terminal">location: ${this.portfolioData.location}</div>
            <div class="detail-line-terminal">focus: ${this.portfolioData.focusAreas.join(", ")}</div>
            <div class="detail-line-terminal">${this.portfolioData.summary}</div>
        `);
    }

    showSkills() {
        const lines = Object.entries(this.skillsData)
            .map(([label, items]) => `<div class="skill-category-terminal">${label}: ${items.join(", ")}</div>`)
            .join("");
        this.addToOutput(lines);
    }

    showProjects() {
        const html = this.projectsData.map((project) => `
            <div class="terminal-projects">
                ${project.title} | ${project.date}<br>
                <a href="${project.link}" target="_blank" rel="noreferrer">${project.link}</a><br>
                ${project.bullets.map((bullet) => `• ${bullet}`).join("<br>")}
            </div>
        `).join("");
        this.addToOutput(html);
    }

    showExperience() {
        const html = this.experienceData.map((item) => `
            <div class="terminal-projects">
                ${item.role} | ${item.company}<br>
                ${item.dates} | ${item.location}<br>
                <a href="${item.link}" target="_blank" rel="noreferrer">${item.link}</a><br>
                ${item.bullets.map((bullet) => `• ${bullet}`).join("<br>")}
            </div>
        `).join("");
        this.addToOutput(html);
    }

    showEducation() {
        const html = this.educationData.map((edu) => `
            <div class="terminal-projects">
                ${edu.school}<br>
                ${edu.degree}
            </div>
        `).join("");
        this.addToOutput(html);
    }

    showContact() {
        this.addToOutput(`
            <div class="detail-line-terminal">github: <a href="${this.portfolioData.github}" target="_blank" rel="noreferrer">${this.portfolioData.github}</a></div>
            <div class="detail-line-terminal">linkedin: <a href="${this.portfolioData.linkedin}" target="_blank" rel="noreferrer">${this.portfolioData.linkedin}</a></div>
            <div class="detail-line-terminal">x: <a href="${this.portfolioData.x}" target="_blank" rel="noreferrer">${this.portfolioData.x}</a></div>
            <div class="detail-line-terminal">resume: <a href="resume.pdf" target="_blank" rel="noreferrer">resume.pdf</a></div>
        `);
    }

    showResume() {
        this.addToOutput(`
            <div class="detail-line-terminal">opening resume viewer...</div>
            <div class="detail-line-terminal"><a href="resume.pdf" target="_blank" rel="noreferrer">resume.pdf</a></div>
        `);
        this.createPDFViewer();
    }

    createPDFViewer() {
        const existingPopup = document.querySelector(".pdf-popup");
        if (existingPopup) {
            existingPopup.remove();
        }

        const overlay = document.createElement("div");
        overlay.className = "pdf-popup";
        overlay.innerHTML = `
            <div class="pdf-popup-content">
                <div class="pdf-header">
                    <h3>Kushagra Kaushal Resume</h3>
                    <div class="pdf-controls">
                        <a href="resume.pdf" download>Download</a>
                        <button type="button" class="print-btn">Print</button>
                        <button type="button" class="close-btn">Close</button>
                    </div>
                </div>
                <div class="pdf-viewer">
                    <iframe src="resume.pdf#toolbar=1&navpanes=0&scrollbar=1" width="100%" height="100%" frameborder="0"></iframe>
                </div>
            </div>
        `;

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });

        overlay.querySelector(".close-btn").addEventListener("click", () => {
            overlay.remove();
        });

        overlay.querySelector(".print-btn").addEventListener("click", () => {
            const frame = overlay.querySelector("iframe");
            if (frame && frame.contentWindow) {
                frame.contentWindow.print();
            } else {
                window.open("resume.pdf", "_blank", "noopener");
            }
        });

        document.body.appendChild(overlay);
    }

    openGithub() {
        this.addToOutput(`<div class="detail-line-terminal">opening github: <a href="${this.portfolioData.github}" target="_blank" rel="noreferrer">${this.portfolioData.github}</a></div>`);
        setTimeout(() => window.open(this.portfolioData.github, "_blank", "noopener"), 300);
    }

    openLinkedIn() {
        this.addToOutput(`<div class="detail-line-terminal">opening linkedin: <a href="${this.portfolioData.linkedin}" target="_blank" rel="noreferrer">${this.portfolioData.linkedin}</a></div>`);
        setTimeout(() => window.open(this.portfolioData.linkedin, "_blank", "noopener"), 300);
    }

    openX() {
        this.addToOutput(`<div class="detail-line-terminal">opening x: <a href="${this.portfolioData.x}" target="_blank" rel="noreferrer">${this.portfolioData.x}</a></div>`);
        setTimeout(() => window.open(this.portfolioData.x, "_blank", "noopener"), 300);
    }

    showDate() {
        this.addToOutput(`<div class="detail-line-terminal">${new Date().toLocaleString()}</div>`);
    }

    whoami() {
        this.addToOutput(`<div class="detail-line-terminal">${this.portfolioData.name} - ${this.portfolioData.title}</div>`);
    }

    listFiles() {
        this.addToOutput(`
            <div class="detail-line-terminal">about.txt</div>
            <div class="detail-line-terminal">skills.txt</div>
            <div class="detail-line-terminal">projects.txt</div>
            <div class="detail-line-terminal">experience.txt</div>
            <div class="detail-line-terminal">education.txt</div>
            <div class="detail-line-terminal">contact.txt</div>
            <div class="detail-line-terminal">resume.pdf</div>
        `);
    }

    catFile(args) {
        if (!args.length) {
            this.addToOutput(`<div class="detail-line-terminal">usage: cat [filename]</div>`);
            return;
        }

        const fileMap = {
            "about.txt": () => this.showAbout(),
            "skills.txt": () => this.showSkills(),
            "projects.txt": () => this.showProjects(),
            "experience.txt": () => this.showExperience(),
            "education.txt": () => this.showEducation(),
            "contact.txt": () => this.showContact()
        };

        const filename = args[0].toLowerCase();
        if (fileMap[filename]) {
            fileMap[filename]();
        } else {
            this.addToOutput(`<div class="detail-line-terminal">cat: ${filename}: no such file or directory</div>`);
        }
    }

    showPwd() {
        this.addToOutput(`<div class="detail-line-terminal">/home/kushagra/portfolio</div>`);
    }

    echo(args) {
        this.addToOutput(`<div class="detail-line-terminal">${args.join(" ")}</div>`);
    }

    showModeHelp() {
        const mode = this.body.dataset.mode;
        this.addToOutput(`<div class="detail-line-terminal">current mode: ${mode}. use the top switch to move between normal and tech views.</div>`);
    }

    changeTheme(args) {
        if (!args.length) {
            this.addToOutput(`<div class="detail-line-terminal">available themes: matrix, cyberpunk, retro</div>`);
            return;
        }

        const theme = args[0].toLowerCase();
        const root = document.documentElement;
        const terminal = document.querySelector(".terminal-container");
        const setTerminalBg = (value) => {
            if (terminal) {
                terminal.style.background = value;
            }
        };

        switch (theme) {
            case "matrix":
                root.style.setProperty("--accent", "#57ff87");
                root.style.setProperty("--accent-strong", "#bbffd3");
                this.addToOutput(`<div class="detail-line-terminal">theme changed to matrix</div>`);
                setTerminalBg("rgba(9, 17, 11, 0.95)");
                break;
            case "cyberpunk":
                root.style.setProperty("--accent", "#ff4db8");
                root.style.setProperty("--accent-strong", "#7ef9ff");
                this.addToOutput(`<div class="detail-line-terminal">theme changed to cyberpunk</div>`);
                setTerminalBg("rgba(15, 8, 18, 0.95)");
                break;
            case "retro":
                root.style.setProperty("--accent", "#ffb347");
                root.style.setProperty("--accent-strong", "#ffe39b");
                this.addToOutput(`<div class="detail-line-terminal">theme changed to retro</div>`);
                setTerminalBg("rgba(24, 15, 7, 0.95)");
                break;
            default:
                this.addToOutput(`<div class="detail-line-terminal">theme not found. available: matrix, cyberpunk, retro</div>`);
        }
    }

    showKitty() {
        fetch("ascii_art_simple.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("failed to load ascii_art_simple.json");
                }
                return response.json();
            })
            .then((data) => {
                if (!data.pieces || !data.pieces.length) {
                    throw new Error("ascii collection is empty");
                }
                const item = data.pieces[Math.floor(Math.random() * data.pieces.length)];
                const decoded = atob(item.base64_encoded);
                this.addToOutput(`
                    <div class="detail-line-terminal">kitty #${item.id}</div>
                    <pre class="ascii-art">${decoded}</pre>
                `);
                this.scrollToBottom();
            })
            .catch((error) => {
                this.addToOutput(`<div class="detail-line-terminal">${error.message}</div>`);
            });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PortfolioTerminal();
});
