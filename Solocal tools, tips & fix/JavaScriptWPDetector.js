javascript:(function(){
    const jsDetector = {
        createInterface: function() {
            if (document.getElementById('js-detector-panel')) return;
            
            const panel = document.createElement('div');
            panel.id = 'js-detector-panel';
            panel.innerHTML = `
                <div style='position:fixed;top:10px;right:10px;width:400px;max-height:80vh;background:white;border:2px solid #007cba;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:999999;font-family:Arial,sans-serif;overflow:hidden;'>
                    <div style='background:#007cba;color:white;padding:10px;font-weight:bold;display:flex;justify-content:space-between;align-items:center;'>
                        <span>🔍 JavaScript Détecté</span>
                        <button onclick='document.getElementById("js-detector-panel").remove()' style='background:transparent;border:none;color:white;font-size:18px;cursor:pointer;'>&times;</button>
                    </div>
                    <div id='js-detector-content' style='padding:15px;max-height:60vh;overflow-y:auto;'></div>
                    <div style='padding:10px;background:#f8f9fa;border-top:1px solid #dee2e6;font-size:12px;color:#666;'>
                        Cliquez sur les éléments pour voir le code
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            this.makeDraggable(panel);
            return document.getElementById('js-detector-content');
        },
        
        makeDraggable: function(element) {
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
        
        extractContentBetweenComments: function(html, startComment, endComment) {
            const startIndex = html.indexOf(startComment);
            const endIndex = html.indexOf(endComment || startComment, startIndex + startComment.length);
            
            if (startIndex === -1 || endIndex === -1) return null;
            
            return html.substring(startIndex + startComment.length, endIndex);
        },
        
        detectWordPressHooks: function() {
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
        
        detectCustomHTML: function() {
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
        
        detectDidomiScripts: function() {
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
        
        detectSEOScripts: function() {
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
        
        detectInlineScripts: function() {
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
        
        displayResults: function(results) {
            const container = this.createInterface();
            
            if (!results.length) {
                container.innerHTML = '<div style="text-align:center;color:#28a745;padding:20px;">✅ Aucun JavaScript personnalisé détecté</div>';
                return;
            }
            
            let html = '<div style="margin-bottom:10px;font-weight:bold;color:#333;">' + results.length + ' élément(s) détecté(s):</div>';
            
            results.forEach((result, index) => {
                const preview = result.content.substring(0, 100) + '...';
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
        
        escapeHtml: function(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },
        
        run: function() {
            const allResults = [];
            allResults.push(...this.detectWordPressHooks());
            allResults.push(...this.detectCustomHTML());
            allResults.push(...this.detectDidomiScripts());
            allResults.push(...this.detectSEOScripts());
            allResults.push(...this.detectInlineScripts());
            
            this.displayResults(allResults);
            console.log('Analyse terminée:', allResults.length, 'éléments détectés');
        }
    };
    
    jsDetector.run();
})();
