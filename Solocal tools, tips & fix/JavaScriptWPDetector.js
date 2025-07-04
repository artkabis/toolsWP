javascript: (function () {
    const jsDetector = {
        createInterface: function () {
            if (document.getElementById('js-detector-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'js-detector-panel';
            panel.innerHTML = `
                <div style='position:fixed;top:10px;right:10px;width:450px;max-height:80vh;background:white;border:2px solid #007cba;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:999999;font-family:Arial,sans-serif;overflow:hidden;'>
                    <div style='background:#007cba;color:white;padding:10px;font-weight:bold;display:flex;justify-content:space-between;align-items:center;'>
                        <span>🔍 Analyseur WordPress</span>
                        <button onclick='document.getElementById("js-detector-panel").remove()' style='background:transparent;border:none;color:white;font-size:18px;cursor:pointer;'>&times;</button>
                    </div>
                    <div style='display:flex;background:#f8f9fa;border-bottom:1px solid #dee2e6;'>
                        <button id='tab-js' onclick='jsDetector.switchTab("js")' style='flex:1;padding:10px;border:none;background:#007cba;color:white;cursor:pointer;font-size:12px;font-weight:bold;'>JS Détecté</button>
                        <button id='tab-extensions' onclick='jsDetector.switchTab("extensions")' style='flex:1;padding:10px;border:none;background:#6c757d;color:white;cursor:pointer;font-size:12px;'>Extensions</button>
                    </div>
                    <div id='js-detector-content' style='padding:15px;max-height:55vh;overflow-y:auto;'></div>
                    <div style='padding:10px;background:#f8f9fa;border-top:1px solid #dee2e6;font-size:12px;color:#666;'>
                        Cliquez sur les éléments pour voir le code
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.makeDraggable(panel);
            this.currentTab = 'js';
            return document.getElementById('js-detector-content');
        },

        switchTab: function (tabName) {
            document.getElementById('tab-js').style.background = tabName === 'js' ? '#007cba' : '#6c757d';
            document.getElementById('tab-extensions').style.background = tabName === 'extensions' ? '#007cba' : '#6c757d';

            this.currentTab = tabName;

            if (tabName === 'js') {
                this.displayJSResults();
            } else if (tabName === 'extensions') {
                this.displayExtensions();
            }
        },

        makeDraggable: function (element) {
            let isDragging = false;
            let currentX, currentY, initialX, initialY;
            let xOffset = 0, yOffset = 0;

            const header = element.querySelector('div[style*="background:#007cba"]');
            header.style.cursor = 'move';

            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            }

            function dragEnd(e) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }
        },

        extractContentBetweenComments: function (html, startComment, endComment) {
            const startIndex = html.indexOf(startComment);
            const endIndex = html.indexOf(endComment || startComment, startIndex + startComment.length);

            if (startIndex === -1 || endIndex === -1) return null;

            return html.substring(startIndex + startComment.length, endIndex);
        },

        detectWordPressHooks: function () {
            const html = document.documentElement.innerHTML;
            const hooks = [
                { tag: '<!-- mfn_hook_content_before -->', name: 'Hook Content Before', color: '#007cba' },
                { tag: '<!-- mfn_hook_content_after -->', name: 'Hook Content After', color: '#28a745' },
                { tag: '<!-- mfn_hook_top -->', name: 'Hook Top', color: '#6f42c1' },
                { tag: '<!-- mfn_hook_bottom -->', name: 'Hook Bottom', color: '#fd7e14' }
            ];

            const results = [];
            hooks.forEach(hook => {
                const content = this.extractContentBetweenComments(html, hook.tag);
                if (content && content.trim()) {
                    const hasJS = /<script[^>]*>([\s\S]*?)<\/script>/gi.test(content) || /javascript:/gi.test(content);
                    if (hasJS) {
                        results.push({
                            type: 'WordPress Hook',
                            name: hook.name,
                            content: content.trim(),
                            color: hook.color,
                            hasJS: true
                        });
                    }
                }
            });

            return results;
        },

        detectCustomHTML: function () {
            const elements = document.querySelectorAll('.wpb_raw_code, .wpb_raw_html, .wpb_raw_js');
            const results = [];

            elements.forEach((element, index) => {
                const content = element.innerHTML;
                const hasJS = /<script[^>]*>([\s\S]*?)<\/script>/gi.test(content) || /javascript:/gi.test(content);

                if (hasJS) {
                    const isRawJS = element.classList.contains('wpb_raw_js');
                    results.push({
                        type: 'Custom HTML/JS',
                        name: `Composant ${isRawJS ? 'JS' : 'HTML'} #${index + 1}`,
                        content: content,
                        color: isRawJS ? '#dc3545' : '#17a2b8',
                        hasJS: true,
                        element: element
                    });
                }
            });

            return results;
        },

        detectDidomiScripts: function () {
            const scripts = document.querySelectorAll('script[type="didomi/javascript"]');
            const results = [];

            scripts.forEach((script, index) => {
                const vendor = script.getAttribute('data-vendor') || 'Unknown';
                const content = script.innerHTML || script.textContent;

                if (content && content.trim()) {
                    results.push({
                        type: 'Didomi Script',
                        name: `Didomi - ${vendor}`,
                        content: content.trim(),
                        color: '#e83e8c',
                        hasJS: true,
                        element: script
                    });
                }
            });

            return results;
        },

        detectSEOScripts: function () {
            const seoSelectors = [
                'meta[name*="javascript"]',
                'script[data-seo]',
                '[data-betheme-seo]'
            ];

            const results = [];
            seoSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    const content = element.innerHTML || element.textContent || element.getAttribute('content');
                    if (content && (/<script[^>]*>([\s\S]*?)<\/script>/gi.test(content) || /javascript:/gi.test(content))) {
                        results.push({
                            type: 'SEO Script',
                            name: `SEO Element #${index + 1}`,
                            content: content,
                            color: '#6c757d',
                            hasJS: true,
                            element: element
                        });
                    }
                });
            });

            return results;
        },

        detectInlineScripts: function () {
            const scripts = document.querySelectorAll('script:not([src])');
            const results = [];

            scripts.forEach((script, index) => {
                const content = script.innerHTML || script.textContent;
                if (content && content.trim() && !script.getAttribute('type')?.includes('application/ld+json')) {
                    const isCustom = !content.includes('wp-') || content.includes('jQuery') || content.includes('$');
                    if (isCustom) {
                        results.push({
                            type: 'Script Inline',
                            name: `Script #${index + 1}`,
                            content: content.trim(),
                            color: '#ffc107',
                            hasJS: true,
                            element: script
                        });
                    }
                }
            });

            return results;
        },

        detectExtensions: function () {
            const extensions = [];
            const revSlider = document.querySelector('.mfn-main-slider#mfn-rev-slider, #mfn-rev-slider');
            if (revSlider) {
                extensions.push({
                    name: 'Slider Revolution',
                    status: 'Détecté',
                    color: '#28a745',
                    icon: '🎠',
                    details: 'Widget Slider Revolution présent',
                    element: revSlider
                });
            }
            if (document.querySelector('.woocommerce, body.woocommerce')) {
                extensions.push({
                    name: 'WooCommerce',
                    status: 'Détecté',
                    color: '#96588a',
                    icon: '🛒',
                    details: 'Extension e-commerce WooCommerce active'
                });
            }
            if (document.querySelector('.gform_wrapper')) {
                const hasSteps = document.querySelector('.gf_progressbar_wrapper, .gf_progressbar');
                const hasConditionalLogic = document.documentElement.innerHTML.includes('gf_form_conditional_logic') &&
                    document.documentElement.innerHTML.includes('logic:');

                let details = 'Plugin de formulaire Gravity Forms actif';
                let features = [];

                if (hasSteps) {
                    features.push('Multi-étapes');
                }
                if (hasConditionalLogic) {
                    features.push('Logique conditionnelle');
                }

                if (features.length > 0) {
                    details += ' (' + features.join(', ') + ')';
                }

                extensions.push({
                    name: 'Gravity Forms',
                    status: 'Détecté',
                    color: '#0073aa',
                    icon: '📧',
                    details: details
                });
            }
            return extensions;
        },

        displayJSResults: function () {
            const container = document.getElementById('js-detector-content');
            if (!this.jsResults) {
                this.jsResults = [];
                this.jsResults.push(...this.detectWordPressHooks());
                this.jsResults.push(...this.detectCustomHTML());
                this.jsResults.push(...this.detectDidomiScripts());
                this.jsResults.push(...this.detectSEOScripts());
                this.jsResults.push(...this.detectInlineScripts());
            }

            if (!this.jsResults.length) {
                container.innerHTML = '<div style="text-align:center;color:#28a745;padding:20px;">✅ Aucun JavaScript personnalisé détecté</div>';
                return;
            }

            let html = '<div style="margin-bottom:10px;font-weight:bold;color:#333;">' + this.jsResults.length + ' élément(s) détecté(s):</div>';

            this.jsResults.forEach((result, index) => {
                html += `
                    <div style='margin-bottom:10px;border:1px solid #dee2e6;border-radius:4px;overflow:hidden;'>
                        <div style='background:${result.color};color:white;padding:8px;font-size:12px;font-weight:bold;cursor:pointer;' onclick='this.nextElementSibling.style.display=this.nextElementSibling.style.display==="none"?"block":"none"'>
                            ${result.type}: ${result.name}
                        </div>
                        <div style='padding:10px;background:#f8f9fa;font-size:11px;font-family:monospace;white-space:pre-wrap;display:none;max-height:200px;overflow-y:auto;'>
                            ${this.escapeHtml(result.content)}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        },

        displayExtensions: function () {
            const container = document.getElementById('js-detector-content');
            const extensions = this.detectExtensions();

            if (!extensions.length) {
                container.innerHTML = '<div style="text-align:center;color:#6c757d;padding:20px;">❌ Aucune extension détectée</div>';
                return;
            }

            let html = '<div style="margin-bottom:10px;font-weight:bold;color:#333;">' + extensions.length + ' extension(s) détectée(s):</div>';

            extensions.forEach((ext, index) => {
                html += `
                    <div style='margin-bottom:10px;border:1px solid #dee2e6;border-radius:4px;overflow:hidden;'>
                        <div style='background:${ext.color};color:white;padding:12px;font-size:14px;font-weight:bold;display:flex;align-items:center;gap:8px;'>
                            <span>${ext.icon}</span>
                            <span>${ext.name}</span>
                            <span style='margin-left:auto;font-size:11px;background:rgba(255,255,255,0.2);padding:2px 6px;border-radius:3px;'>${ext.status}</span>
                        </div>
                        <div style='padding:10px;background:#f8f9fa;font-size:12px;color:#666;'>
                            ${ext.details}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        },

        escapeHtml: function (text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        run: function () {
            this.createInterface();
            this.displayJSResults();
            console.log('Analyse terminée');
        }
    };

    window.jsDetector = jsDetector;
    jsDetector.run();
})();
