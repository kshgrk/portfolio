class PortfolioTerminal {
    constructor() {
        this.input = document.getElementById('commandInput');
        this.output = document.getElementById('output');
        this.commandHistory = [];
        this.historyIndex = -1;
        
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
            kitty: this.showKitty.bind(this)
        };
        
        this.portfolioData = {
            name: "Kushagra Kaushal",
            title: "Data Scientist & Engineer",
            location: "New Delhi, India",
            github: "https://github.com/kshgrk",
            linkedin: "https://linkedin.com/in/kshgrk",
            website: "https://kushagrakaushal.dev",
            x: "https://x.com/kshgrk"
        };
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.input.addEventListener('input', this.updateCursorPosition.bind(this));
        this.input.focus();
        
        // Keep input focused
        document.addEventListener('click', () => {
            this.input.focus();
        });
        
        // Initialize cursor position
        this.updateCursorPosition();
    }
    
    handleKeyDown(event) {
        switch(event.key) {
            case 'Enter':
                this.executeCommand();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                event.preventDefault();
                this.autoComplete();
                break;
        }
    }
    
    executeCommand() {
        const command = this.input.value.trim();
        if (!command) return;
        
        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Display command
        this.addToOutput(`<div class="command-line">
            <span class="command-prompt">kushagra@portfolio:~$</span>
            <span class="command-text">${command}</span>
        </div>`);
        
        // Parse and execute
        const [cmd, ...args] = command.split(' ');
        const cmdLower = cmd.toLowerCase();
        
        if (this.commands[cmdLower]) {
            this.commands[cmdLower](args);
        } else {
            this.addToOutput(`<div class="error">Command not found: ${cmd}. Type 'help' for available commands.</div>`);
        }
        
        // Clear input
        this.input.value = '';
        this.updateCursorPosition();
        this.scrollToBottom();
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        
        this.input.value = this.commandHistory[this.historyIndex] || '';
        this.updateCursorPosition();
    }
    
    autoComplete() {
        const partial = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
            this.updateCursorPosition();
        } else if (matches.length > 1) {
            this.addToOutput(`<div class="info">Available commands: ${matches.join(', ')}</div>`);
        }
    }
    
    addToOutput(content) {
        this.output.innerHTML += `<div class="command-output">${content}</div>`;
    }
    
    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    updateCursorPosition() {
        const cursor = document.querySelector('.cursor');
        const prompt = document.querySelector('.prompt');
        const inputValue = this.input.value;
        
        // Calculate cursor position based on input text length
        const charWidth = 8.4; // Approximate character width in monospace font
        const promptWidth = prompt.offsetWidth;
        const textWidth = inputValue.length * charWidth;
        
        // Position cursor after the text, not on top of it
        cursor.style.left = (promptWidth + textWidth + 2) + 'px';
    }
    
    clearTerminal() {
        this.output.innerHTML = '';
    }
    
    showHelp() {
        const helpText = `
            <div class="info">Command Manual (man)</div>
            <br>
            <div class="help-section">
                <div class="help-title">Portfolio Commands</div>
                <div class="detail-line"><span class="success">about</span> - Display personal information and background</div>
                <div class="detail-line"><span class="success">skills</span> - Show technical skills and expertise</div>
                <div class="detail-line"><span class="success">projects</span> - List featured projects and repositories</div>
                <div class="detail-line"><span class="success">experience</span> - Display work experience and roles</div>
                <div class="detail-line"><span class="success">education</span> - Show educational background and certifications</div>
                <div class="detail-line"><span class="success">contact</span> - Display contact information and social links</div>
                <div class="detail-line"><span class="success">resume</span> - Open resume PDF viewer in popup</div>
                <div class="detail-line"><span class="success">github</span> - Open GitHub profile in new tab</div>
                <div class="detail-line"><span class="success">linkedin</span> - Open LinkedIn profile in new tab</div>
                <div class="detail-line"><span class="success">x</span> - Open X profile in new tab</div>
                <div class="detail-line"><span class="success">kitty</span> - Display random ASCII art</div>
            </div>
            <br>
            <div class="help-section">
                <div class="help-title">System Commands</div>
                <div class="detail-line"><span class="success">help</span> - Display this command manual</div>
                <div class="detail-line"><span class="success">clear</span> - Clear terminal output</div>
                <div class="detail-line"><span class="success">date</span> - Show current date and time</div>
                <div class="detail-line"><span class="success">whoami</span> - Display current user identity</div>
                <div class="detail-line"><span class="success">pwd</span> - Show current working directory</div>
                <div class="detail-line"><span class="success">ls</span> - List available files and commands</div>
                <div class="detail-line"><span class="success">cat [file]</span> - Display contents of specified file</div>
                <div class="detail-line"><span class="success">echo [text]</span> - Output specified text</div>
                <div class="detail-line"><span class="success">theme [name]</span> - Change terminal color theme</div>
            </div>
            <br>
            <div class="help-section">
                <div class="help-title">Navigation & Usage</div>
                <div class="detail-line"><span class="success">↑/↓</span> - Navigate command history</div>
                <div class="detail-line"><span class="success">Tab</span> - Auto-complete commands</div>
                <div class="detail-line"><span class="success">Enter</span> - Execute command</div>
            </div>
            <br>
            <div class="help-section">
                <div class="help-title">Available Themes</div>
                <div class="detail-line"><span class="success">matrix</span> - Default green terminal theme</div>
                <div class="detail-line"><span class="success">cyberpunk</span> - Pink and cyan color scheme</div>
                <div class="detail-line"><span class="success">retro</span> - Orange and yellow retro theme</div>
            </div>
        `;
        this.addToOutput(helpText);
    }
    
    showAbout() {
        const aboutText = `
            <div class="info">About ${this.portfolioData.name}</div>
            <br>
            <div class="about-details">
                <div class="detail-line"><span class="success">Name:</span> ${this.portfolioData.name}</div>
                <div class="detail-line"><span class="success">Title:</span> ${this.portfolioData.title}</div>
                <div class="detail-line"><span class="success">Location:</span> ${this.portfolioData.location}</div>
                <div class="detail-line"><span class="success">Experience:</span> 3+ years in Data Science & Engineering</div>
                <div class="detail-line"><span class="success">Focus Areas:</span> Data Engineering, ML, Analytics, Applied Research</div>
            </div>
        `;
        this.addToOutput(aboutText);
    }
    
    showSkills() {
        const skillsText = `
            <div class="info">Technical Skills</div>
            <br>
            <div class="skills-list">
                <div class="skill-category">
                    <span class="skill-header">Programming Languages:</span> Python, C++, C
                </div>
                <div class="skill-category">
                    <span class="skill-header">Machine Learning Frameworks:</span> Scikit-learn, TensorFlow, PyTorch, Deep Learning, Computer Vision, Natural Language Processing
                </div>
                <div class="skill-category">
                    <span class="skill-header">Data Engineering Technologies:</span> dbt, Apache Airflow, Google BigQuery, Cloud SQL
                </div>
                <div class="skill-category">
                    <span class="skill-header">Cloud Platforms:</span> Google Cloud Platform, Amazon Web Services
                </div>
                <div class="skill-category">
                    <span class="skill-header">Data Visualization & Reporting Tools:</span> Looker Studio, Plotly, Dash
                </div>
                <div class="skill-category">
                    <span class="skill-header">DevOps & MLOps Technologies:</span> Kubernetes, Docker, Devtron CI/CD
                </div>
                <div class="skill-category">
                    <span class="skill-header">Additional Technologies:</span> Linux, MySQL, Bash Scripting, FastAPI, Flask, Django
                </div>
            </div>
        `;
        this.addToOutput(skillsText);
    }
    
    showProjects() {
        const projectsText = `
            <div class="info">Projects</div>
            <pre class="terminal-projects">
<span class="project-title">Obelisk</span>                                   <span class="project-date">Ongoing</span>
<a href="https://github.com/kshgrk/obelisk" target="_blank" class="project-link">https://github.com/kshgrk/obelisk</a>
  • Developed Obelisk, a real-time chat application leveraging Temporal workflows for fault-tolerant orchestration and OpenRouter's free AI models (e.g., DeepSeek, Mistral, Llama), enabling dynamic model switching and multi-conversation without context loss.
  • Architected a multi-tiered system using FastAPI for proxy and backend services, Vanilla JavaScript frontend, and SQLite database, facilitating session management, real-time notifications, and persistent chat history.
  • Implemented an extensible registry for dynamic tool calling, model management, and integration with external APIs and weather/AI models.
  • Ensured robustness through Temporal's retry mechanisms and workflow orchestration, supporting concurrent user sessions and graceful error handling.

<span class="project-title">IntelliCodebase</span>                          <span class="project-date">Jun 2025</span>
<a href="https://github.com/kshgrk/IntelliCodebase.git" target="_blank" class="project-link">https://github.com/kshgrk/IntelliCodebase.git</a>
  • Architected an advanced LLM-powered system (utilizing Gemini) for comprehensive codebase analysis and modernization.
  • Built interactive tooling with Bash and Python to execute system-level refactoring, including file extraction, linting, and script execution.
  • Designed intelligent commit and caching mechanisms to enhance performance during analysis of large-scale repositories.
  • Enabled functionality to identify codebase issues and propose targeted fixes, with selective file analysis capability.

<span class="project-title">LSMTree-AVL</span>                              <span class="project-date">Nov 2024</span>
<a href="https://github.com/kshgrk/LSMTree-AVL.git" target="_blank" class="project-link">https://github.com/kshgrk/LSMTree-AVL.git</a>
  • Engineered a Python-based LSM-tree database utilizing AVL trees for efficient in-memory and disk management, optimizing storage and retrieval operations.
  • Incorporated a Bloom filter for rapid key presence verification, automatic flushing to SSTables, and multi-threaded compaction strategies.
  • Developed a write-ahead log mechanism to ensure data durability and robust recovery processes.
            </pre>
        `;
        this.addToOutput(projectsText);
    }
    
    showExperience() {
        const experienceText = `
<div class="info">Work Experience</div>
<pre class="terminal-projects">
<span class="project-title">Data Scientist <span style="font-weight: normal;">New Engen - Seattle, US (Remote)</span></span>                                   <span class="project-date">November 2022 - Present</span>
<a href="https://www.newengen.com/" target="_blank" class="project-link">https://www.newengen.com/</a>
  • Architected and deployed advanced AI-powered chatbot systems utilizing multiple large language models (Claude, Gemini) to perform sophisticated reasoning and deliver actionable marketing insights through function calling and optimized content caching.
  • Designed and maintained robust data pipelines leveraging Adverity, custom Python scripts, dbt, BigQuery, and Cloud SQL on Kubernetes, implementing ETL workflows that enhanced real-time analytics efficiency by approximately 60%.
  • Conducted comprehensive data analysis on 5 terabytes of marketing data in BigQuery, deriving critical KPIs including spend, revenue, ROAS, CPC, and AOV to inform strategic decision-making.
  • Developed dynamic and scalable reporting dashboards in Looker Studio, integrating data from diverse sources (GA4, Meta, Google, etc.) to support data-driven decisions, contributing to the <a href="#" onclick="return false;" style="text-decoration: underline;">LIFT</a> SaaS platform.
  • Engineered machine learning solutions, including a pacing and budgeting forecast system and a recommendation engine, utilizing real-time data analysis to enhance operational efficiency.

<span class="project-title">Data Science Consultant <span style="font-weight: normal;">Kauriink Pvt. Ltd. - New Delhi, India (Remote)</span></span>                                   <span class="project-date">August 2022 - November 2022</span>
<a href="https://www.techatplay.ai/" target="_blank" class="project-link">https://www.techatplay.ai/</a>
  • Developed and validated deep learning models for automated player performance analysis using computer vision, achieving 87% accuracy in posture classification (6 classes) and 92% accuracy in shot type classification (8 classes).
  • Implemented advanced color segmentation and sliding window techniques to optimize object tracking in video data.
  • Collaborated on the integration of transfer learning models (Mediapipe, YOLO) to accurately detect player posture, movement, ball trajectory, and shot type.
  • Exhibited exceptional problem-solving and analytical capabilities, applying technical expertise and innovative approaches to deliver high-impact solutions.
</pre>
        `;
        this.addToOutput(experienceText);
    }
    
    showEducation() {
        const educationText = `
           <div class="info">Education</div>
           <pre class="terminal-projects">
           <span class="project-title">Indian Institute of Information Technology</span>                                   <span class="project-date">Bhopal (India)</span>
           <span style="display: block; margin-left: 2em;">B.Tech Information Technology</span>
           </pre>
        `;
        this.addToOutput(educationText);
    }
    
    showContact() {
        const contactText = `
            <div class="info">Get In Touch</div>
            <br>
            <div class="contact-list">
                <div class="detail-line">
                    <span class="contact-label">Location:</span> ${this.portfolioData.location}
                </div>
                <div class="detail-line">
                    <span class="contact-label">Website:</span> <a href="${this.portfolioData.website}" target="_blank" class="contact-link">${this.portfolioData.website}</a>
                </div>
                <div class="detail-line">
                    <span class="contact-label">LinkedIn:</span> <a href="${this.portfolioData.linkedin}" target="_blank" class="contact-link">${this.portfolioData.linkedin}</a>
                </div>
                <div class="detail-line">
                    <span class="contact-label">GitHub:</span> <a href="${this.portfolioData.github}" target="_blank" class="contact-link">${this.portfolioData.github}</a>
                </div>
                <div class="detail-line">
                    <span class="contact-label">X:</span> <a href="${this.portfolioData.x}" target="_blank" class="contact-link">${this.portfolioData.x}</a>
                </div>
            </div>
            <br>
            <div class="success">Let's connect! I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.</div>
        `;
        this.addToOutput(contactText);
    }
    
    showResume() {
        const resumeText = `
            <div class="info">📄 Resume</div>
            <br>
            <div class="success">Opening resume viewer...</div>
            <div>Click anywhere outside the popup to close it</div>
        `;
        this.addToOutput(resumeText);
        
        // Create and show PDF viewer popup
        this.createPDFViewer();
    }
    
    createPDFViewer() {
        // Remove existing popup if any
        const existingPopup = document.querySelector('.pdf-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'pdf-popup';
        overlay.innerHTML = `
            <div class="pdf-popup-content">
                <div class="pdf-header">
                    <h3>📄 Kushagra Kaushal - Resume</h3>
                    <div class="pdf-controls">
                        <a href="resume.pdf" download class="download-btn">⬇️ Download</a>
                        <button class="print-btn">🖨️ Print</button>
                        <button class="close-btn">✕</button>
                    </div>
                </div>
                <div class="pdf-viewer">
                    <iframe src="resume.pdf#toolbar=1&navpanes=1&scrollbar=1&view=FitH&zoom=page-fit&pagemode=none"
                            width="100%"
                            height="100%"
                            frameborder="0"
                            style="border: none; background: #f5f5f5;">
                        <div style="padding: 20px; text-align: center; font-family: 'Times New Roman', Times, serif;">
                            <h3>📄 PDF Viewer</h3>
                            <p>Your browser doesn't support inline PDF viewing.</p>
                            <p>Click the download button above or <a href="resume.pdf" target="_blank" style="color: #00ff00; text-decoration: none;">open the PDF directly</a></p>
                            <p style="font-size: 14px; color: #888; margin-top: 10px;">
                                For best viewing experience, ensure your browser has Times New Roman font installed.<br>
                                The viewer automatically loads Google Fonts if the local font is unavailable.
                            </p>
                        </div>
                    </iframe>
                </div>
            </div>
        `;

        // Add event listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        overlay.querySelector('.close-btn').addEventListener('click', () => {
            overlay.remove();
        });

        // Add print functionality
        const printBtn = overlay.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                const iframe = overlay.querySelector('iframe');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.print();
                } else {
                    // Fallback: open in new window for printing
                    window.open('resume.pdf', '_blank');
                }
            });
        }

        // Enhance PDF viewer with better font support
        this.enhancePDFViewer(overlay);

        // Add to page
        document.body.appendChild(overlay);

        // Focus the input after a short delay
        setTimeout(() => {
            this.input.focus();
        }, 100);
    }

    enhancePDFViewer(overlay) {
        const iframe = overlay.querySelector('iframe');

        // Add CSS for better font rendering
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Times New Roman';
                src: local('Times New Roman'), local('Times'), local('serif');
                font-display: swap;
            }

            .pdf-viewer iframe {
                font-synthesis: none;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-feature-settings: "liga" 1, "kern" 1;
                font-variant-ligatures: common-ligatures;
            }

            /* Force font rendering for Times */
            .pdf-viewer * {
                font-family: 'Times New Roman', Times, serif !important;
                font-synthesis: none !important;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                font-feature-settings: "liga" 1, "kern" 1 !important;
            }
        `;
        document.head.appendChild(style);

        // Add font loading detection
        if ('fonts' in document) {
            document.fonts.load('16px "Times New Roman"').then(() => {
                console.log('Times New Roman font loaded successfully');
            }).catch(() => {
                console.warn('Times New Roman font not available, loading from Google Fonts');
                // Load Times New Roman from Google Fonts as fallback
                const googleFont = document.createElement('link');
                googleFont.rel = 'stylesheet';
                googleFont.href = 'https://fonts.googleapis.com/css2?family=Times+New+Roman:ital,wght@0,400;0,700;1,400;1,700&display=swap';
                document.head.appendChild(googleFont);
            });
        }

        // Add better iframe parameters for font rendering
        if (iframe) {
            iframe.onload = () => {
                try {
                    // Attempt to enhance the iframe content for better font rendering
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        const fontStyle = iframeDoc.createElement('style');
                        fontStyle.textContent = `
                            * {
                                font-family: 'Times New Roman', Times, serif !important;
                                font-synthesis: none !important;
                                text-rendering: optimizeLegibility !important;
                                -webkit-font-smoothing: antialiased !important;
                                -moz-osx-font-smoothing: grayscale !important;
                            }

                            body {
                                font-family: 'Times New Roman', Times, serif !important;
                            }
                        `;
                        iframeDoc.head.appendChild(fontStyle);
                    }
                } catch (e) {
                    // Cross-origin restrictions may prevent iframe manipulation
                    console.log('Could not enhance iframe font rendering due to cross-origin restrictions');
                }
            };
        }
    }
    
    openGithub() {
        const githubText = `
            <div class="info">🐙 Opening GitHub Profile...</div>
            <div>Redirecting to: <a href="${this.portfolioData.github}" target="_blank">${this.portfolioData.github}</a></div>
        `;
        this.addToOutput(githubText);
        
        // Open GitHub in new tab
        setTimeout(() => {
            window.open(this.portfolioData.github, '_blank');
        }, 1000);
    }
    
    openLinkedIn() {
        const linkedinText = `
            <div class="info">💼 Opening LinkedIn Profile...</div>
            <div>Redirecting to: <a href="${this.portfolioData.linkedin}" target="_blank">${this.portfolioData.linkedin}</a></div>
        `;
        this.addToOutput(linkedinText);
        
        // Open LinkedIn in new tab
        setTimeout(() => {
            window.open(this.portfolioData.linkedin, '_blank');
        }, 1000);
    }

    openX() {
        const xText = `
            <div class="info">🐦 Opening X Profile...</div>
            <div>Redirecting to: <a href="${this.portfolioData.x}" target="_blank">${this.portfolioData.x}</a></div>
        `;
        this.addToOutput(xText);

        // Open X in new tab
        setTimeout(() => {
            window.open(this.portfolioData.x, '_blank');
        }, 1000);
    }
    
    showDate() {
        const now = new Date();
        const dateText = `<div class="info">${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>`;
        this.addToOutput(dateText);
    }
    
    whoami() {
        this.addToOutput(`<div class="success">${this.portfolioData.name} - ${this.portfolioData.title}</div>`);
    }
    
    listFiles() {
        const filesText = `
            <div class="info">Directory listing:</div>
            <div>-rw-r--r--  about.txt</div>
            <div>-rw-r--r--  skills.txt</div>
            <div>-rw-r--r--  projects.txt</div>
            <div>-rw-r--r--  experience.txt</div>
            <div>-rw-r--r--  education.txt</div>
            <div>-rw-r--r--  contact.txt</div>
            <div>-rw-r--r--  resume.pdf</div>
        `;
        this.addToOutput(filesText);
    }
    
    catFile(args) {
        if (args.length === 0) {
            this.addToOutput('<div class="error">Usage: cat [filename]</div>');
            return;
        }
        
        const filename = args[0].toLowerCase();
        const fileMap = {
            'about.txt': () => this.showAbout(),
            'skills.txt': () => this.showSkills(),
            'projects.txt': () => this.showProjects(),
            'experience.txt': () => this.showExperience(),
            'education.txt': () => this.showEducation(),
            'contact.txt': () => this.showContact()
        };
        
        if (fileMap[filename]) {
            fileMap[filename]();
        } else {
            this.addToOutput(`<div class="error">cat: ${filename}: No such file or directory</div>`);
        }
    }
    
    showPwd() {
        this.addToOutput('<div class="info">/home/kushagra/portfolio</div>');
    }
    
    echo(args) {
        const text = args.join(' ');
        this.addToOutput(`<div>${text}</div>`);
    }
    
    changeTheme(args) {
        if (args.length === 0) {
            this.addToOutput('<div class="info">Available themes: matrix (default), cyberpunk, retro</div>');
            return;
        }
        
        const theme = args[0].toLowerCase();
        const root = document.documentElement;
        
        switch(theme) {
            case 'matrix':
                root.style.setProperty('--primary-color', '#00ff00');
                root.style.setProperty('--secondary-color', '#00cc00');
                root.style.setProperty('--accent-color', '#00ffff');
                root.style.setProperty('--text-color', '#00ff00');
                root.style.setProperty('--primary-color-rgb', '0, 255, 0');
                root.style.setProperty('--bg-gradient-1', '#0D180A');
                root.style.setProperty('--bg-gradient-2', '#0D180A');
                // Force update body background
                document.body.style.background = 'linear-gradient(45deg, #0D180A, #0D180A)';
                // Update terminal container background
                document.querySelector('.terminal-container').style.background = 'rgba(13, 24, 10, 0.95)';
                this.addToOutput('<div class="success">Theme changed to Matrix (Green)</div>');
                break;
            case 'cyberpunk':
                root.style.setProperty('--primary-color', '#ff0080');
                root.style.setProperty('--secondary-color', '#ff0080');
                root.style.setProperty('--accent-color', '#00ffff');
                root.style.setProperty('--text-color', '#ff0080');
                root.style.setProperty('--primary-color-rgb', '255, 0, 128');
                root.style.setProperty('--bg-gradient-1', '#0a0a14');
                root.style.setProperty('--bg-gradient-2', '#0a0a14');
                // Force update body background
                document.body.style.background = 'linear-gradient(45deg, #0a0a14, #0a0a14)';
                // Update terminal container background
                document.querySelector('.terminal-container').style.background = 'rgba(10, 10, 20, 0.95)';
                this.addToOutput('<div class="success">Theme changed to Cyberpunk (Pink)</div>');
                break;
            case 'retro':
                root.style.setProperty('--primary-color', '#ffaa00');
                root.style.setProperty('--secondary-color', '#ff6600');
                root.style.setProperty('--accent-color', '#ffff00');
                root.style.setProperty('--text-color', '#ffaa00');
                root.style.setProperty('--primary-color-rgb', '255, 120, 0');
                root.style.setProperty('--bg-gradient-1', '#1a0f00');
                root.style.setProperty('--bg-gradient-2', '#1a0f00');
                // Force update body background
                document.body.style.background = 'linear-gradient(45deg, #1a0f00, #1a0f00)';
                // Update terminal container background
                document.querySelector('.terminal-container').style.background = 'rgba(26, 15, 0, 0.95)';
                this.addToOutput('<div class="success">Theme changed to Retro (Orange)</div>');
                break;
            default:
                this.addToOutput('<div class="error">Theme not found. Available: matrix, cyberpunk, retro</div>');
        }
    }

    showKitty() {
        // Fetch ASCII art collection
        fetch('ascii_art_simple.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load ASCII art collection');
                }
                return response.json();
            })
            .then(data => {
                const pieces = data.pieces;
                if (pieces.length === 0) {
                    this.addToOutput('<div class="error">🐱 No ASCII art pieces found!</div>');
                    return;
                }

                // Select random piece
                const randomIndex = Math.floor(Math.random() * pieces.length);
                const randomPiece = pieces[randomIndex];

                // Decode base64
                try {
                    const decodedArt = atob(randomPiece.base64_encoded);

                    // Display the ASCII art
                    const artDisplay = `
                        <div class="info">🐱 Random ASCII Art (Piece #${randomPiece.id}/${pieces.length})</div>
                        <br>
                        <div class="ascii-art">
                            <pre>${decodedArt}</pre>
                        </div>
                        <br>
                        <div class="success">Meow! Type 'kitty' again for another cute ASCII art! 🐾</div>
                    `;

                    this.addToOutput(artDisplay);
                } catch (error) {
                    this.addToOutput(`<div class="error">🐱 Oops! Error decoding ASCII art: ${error.message}</div>`);
                }
            })
            .catch(error => {
                this.addToOutput(`<div class="error">🐱 Failed to load ASCII art collection: ${error.message}</div>`);
                this.addToOutput('<div>Make sure ascii_art_simple.json is in the same directory as the HTML file.</div>');
            });
    }
}

// Initialize the terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioTerminal();
});
