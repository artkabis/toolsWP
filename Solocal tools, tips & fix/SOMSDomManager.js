/* ================================================================================================== */
/* ======================= SOMS DOM MANAGER - Architecture Orientée Objet ========================== */
/* ================================================================================================== */

/**
 * Classe principale SOMS pour la gestion modulaire du DOM
 * Utilise un pattern Fluent API pour chaîner les méthodes
 */
class SOMSDomManager {
    constructor(config = {}) {
        this.config = {
            debug: false,
            autoObserve: true,
            debounce: 0,
            ...config
        };
        
        this.observers = [];
        this.operations = [];
        
        if (this.config.debug) {
            console.log('🚀 SOMS DOM Manager initialisé', this.config);
        }
    }

    /* ========================================================================================== */
    /* ============================= MÉTHODES DE STYLE CSS ===================================== */
    /* ========================================================================================== */

    /**
     * Sous-classe pour la gestion des styles CSS
     */
    static StyleManager = class {
        /**
         * Copie les styles d'un élément source vers une cible
         */
        static copy(sourceElement, targetElement, options = {}) {
            const {
                mode = 'safe',              // 'all' | 'safe' | 'inline' | 'computed' | Array
                exclude = [],               // Propriétés à exclure
                include = null,             // Propriétés spécifiques à inclure (prioritaire)
                additional = {},            // Styles supplémentaires
                compare = true              // Comparer avec défaut navigateur
            } = options;

            const computedStyles = window.getComputedStyle(sourceElement);
            let propertiesToCopy = [];

            // Déterminer les propriétés à copier
            if (include && Array.isArray(include)) {
                // Priorité à include si défini
                propertiesToCopy = include;
            } else if (Array.isArray(mode)) {
                // Mode array custom
                propertiesToCopy = mode;
            } else {
                // Modes prédéfinis
                propertiesToCopy = this.getPropertiesByMode(mode, sourceElement, compare);
            }

            // Propriétés dangereuses à toujours exclure
            const defaultExclude = [
                'position', 'top', 'left', 'right', 'bottom',
                'width', 'height', 'display', 'float', 'zIndex'
            ];

            const allExclusions = [...defaultExclude, ...exclude];

            // Copier les styles
            let copiedCount = 0;
            propertiesToCopy.forEach(prop => {
                if (!allExclusions.includes(prop) && computedStyles[prop]) {
                    try {
                        targetElement.style[prop] = computedStyles[prop];
                        copiedCount++;
                    } catch (e) {
                        console.warn(`Impossible de copier: ${prop}`, e);
                    }
                }
            });

            // Appliquer les styles additionnels
            Object.assign(targetElement.style, additional);

            return copiedCount;
        }

        /**
         * Récupère les propriétés selon le mode
         */
        static getPropertiesByMode(mode, element, compare) {
            switch (mode) {
                case 'inline':
                    return Array.from(element.style);

                case 'safe':
                    return [
                        'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
                        'color', 'backgroundColor', 'textAlign', 'textDecoration',
                        'lineHeight', 'letterSpacing', 'textTransform',
                        'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
                        'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
                        'border', 'borderRadius', 'boxShadow', 'textShadow'
                    ];

                case 'computed':
                    if (compare) {
                        return this.getAppliedProperties(element);
                    }
                    return Array.from(window.getComputedStyle(element));

                case 'all':
                default:
                    return Array.from(window.getComputedStyle(element));
            }
        }

        /**
         * Récupère uniquement les propriétés appliquées (vs défaut navigateur)
         */
        static getAppliedProperties(element) {
            const computedStyles = window.getComputedStyle(element);
            const tempElement = document.createElement(element.tagName);
            document.body.appendChild(tempElement);
            const defaultStyles = window.getComputedStyle(tempElement);
            
            const appliedProps = [];
            Array.from(computedStyles).forEach(prop => {
                if (computedStyles[prop] !== defaultStyles[prop]) {
                    appliedProps.push(prop);
                }
            });
            
            document.body.removeChild(tempElement);
            return appliedProps;
        }

        /**
         * Présets de styles courants
         */
        static presets = {
            typography: ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'color', 'lineHeight', 'letterSpacing', 'textAlign'],
            spacing: ['margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
            borders: ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'borderRadius', 'borderColor', 'borderStyle', 'borderWidth'],
            colors: ['color', 'backgroundColor', 'borderColor'],
            effects: ['boxShadow', 'textShadow', 'opacity', 'filter']
        };
    }

    /* ========================================================================================== */
    /* ============================= MÉTHODES DE TEXTE ========================================== */
    /* ========================================================================================== */

    /**
     * Sous-classe pour la gestion du texte
     */
    static TextManager = class {
        /**
         * Remplace du texte dans un élément
         */
        static replace(element, options = {}) {
            const {
                search,                     // String ou RegExp
                replacement,                // String ou Function
                allOccurrences = true,      // Remplacer toutes les occurrences
                caseSensitive = true,       // Sensible à la casse
                wholeWord = false          // Mot entier uniquement
            } = options;

            if (!search) {
                console.warn('TextManager.replace: search est requis');
                return 0;
            }

            let currentText = element.textContent;
            let replacementCount = 0;

            if (search instanceof RegExp) {
                // Remplacement avec regex
                const matches = currentText.match(search);
                replacementCount = matches ? matches.length : 0;
                
                if (typeof replacement === 'function') {
                    element.textContent = currentText.replace(search, replacement);
                } else {
                    element.textContent = currentText.replace(search, replacement);
                }
            } else {
                // Remplacement simple
                let searchPattern = search;
                
                // Construire la regex selon les options
                if (wholeWord) {
                    searchPattern = `\\b${this.escapeRegex(search)}\\b`;
                } else {
                    searchPattern = this.escapeRegex(search);
                }
                
                const flags = caseSensitive ? 'g' : 'gi';
                const regex = new RegExp(searchPattern, allOccurrences ? flags : flags.replace('g', ''));
                
                const matches = currentText.match(regex);
                replacementCount = matches ? matches.length : 0;
                
                element.textContent = currentText.replace(regex, replacement);
            }

            return replacementCount;
        }

        /**
         * Supprime du texte dans un élément
         */
        static remove(element, options = {}) {
            return this.replace(element, { ...options, replacement: '' });
        }

        /**
         * Transforme le texte (uppercase, lowercase, capitalize, etc.)
         */
        static transform(element, transformType) {
            const text = element.textContent;
            
            const transforms = {
                uppercase: text.toUpperCase(),
                lowercase: text.toLowerCase(),
                capitalize: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
                title: text.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' '),
                reverse: text.split('').reverse().join(''),
                trim: text.trim(),
                removeSpaces: text.replace(/\s+/g, ' ').trim()
            };

            if (transforms[transformType]) {
                element.textContent = transforms[transformType];
                return true;
            }
            
            return false;
        }

        /**
         * Échappe les caractères spéciaux pour regex
         */
        static escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        /**
         * Présets de remplacement courants
         */
        static presets = {
            maskEmail: {
                search: /[\w.-]+@[\w.-]+\.\w+/g,
                replacement: '[Email protégé]'
            },
            maskPhone: {
                search: /(\+33|0)[1-9](\d{2}){4}/g,
                replacement: '[Téléphone masqué]'
            },
            removeFrance: {
                search: /,?\s*France\s*$/gi,
                replacement: ''
            },
            formatPrice: {
                search: /(\d+)€/g,
                replacement: '$1,00 €'
            }
        };
    }

    /* ========================================================================================== */
    /* ============================= MÉTHODES DE NŒUDS DOM ===================================== */
    /* ========================================================================================== */

    /**
     * Sous-classe pour la manipulation des nœuds DOM
     */
    static NodeManager = class {
        /**
         * Remplace un nœud par un autre
         */
        static replace(sourceNode, options = {}) {
            const {
                newTag,                     // Nouveau tag HTML
                preserveContent = true,     // Préserver le contenu
                preserveAttributes = true,  // Préserver les attributs
                preserveChildren = false,   // Préserver les enfants HTML
                newContent = null,          // Nouveau contenu
                addClass = null,            // Classes à ajouter
                removeClass = null          // Classes à supprimer
            } = options;

            // Créer le nouveau nœud
            const newNode = newTag 
                ? document.createElement(newTag)
                : sourceNode.cloneNode(true);

            // Gérer le contenu
            if (newContent !== null) {
                newNode.textContent = newContent;
            } else if (preserveChildren) {
                newNode.innerHTML = sourceNode.innerHTML;
            } else if (preserveContent) {
                newNode.textContent = sourceNode.textContent;
            }

            // Préserver les attributs
            if (preserveAttributes) {
                Array.from(sourceNode.attributes).forEach(attr => {
                    if (!['class', 'style'].includes(attr.name)) {
                        newNode.setAttribute(attr.name, attr.value);
                    }
                });
            }

            // Gérer les classes
            if (preserveAttributes || addClass || removeClass) {
                newNode.className = sourceNode.className;
            }
            
            if (addClass) {
                const classes = Array.isArray(addClass) ? addClass : [addClass];
                newNode.classList.add(...classes);
            }
            
            if (removeClass) {
                const classes = Array.isArray(removeClass) ? removeClass : [removeClass];
                newNode.classList.remove(...classes);
            }

            // Remplacer
            sourceNode.replaceWith(newNode);
            return newNode;
        }

        /**
         * Supprime un nœud
         */
        static remove(node) {
            node.remove();
            return true;
        }

        /**
         * Clone un nœud avec options
         */
        static clone(node, options = {}) {
            const {
                deep = true,
                stripClasses = [],
                stripAttributes = []
            } = options;

            const cloned = node.cloneNode(deep);

            // Supprimer les classes spécifiées
            stripClasses.forEach(cls => cloned.classList.remove(cls));

            // Supprimer les attributs spécifiés
            stripAttributes.forEach(attr => cloned.removeAttribute(attr));

            return cloned;
        }
    }

    /* ========================================================================================== */
    /* ============================= MÉTHODES D'OPÉRATION ======================================= */
    /* ========================================================================================== */

    /**
     * Enregistre une opération à exécuter
     */
    operation(config) {
        const operation = {
            id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            targetSelector: config.targetSelector,
            targetChild: config.targetChild || null,
            action: config.action,
            options: config.options || {},
            autoObserve: config.autoObserve !== undefined ? config.autoObserve : this.config.autoObserve,
            debounce: config.debounce || this.config.debounce
        };

        this.operations.push(operation);

        if (this.config.debug) {
            console.log('📝 Opération enregistrée:', operation.id);
        }

        return this;
    }

    /**
     * Remplace des nœuds
     */
    replaceNodes(config) {
        return this.operation({
            ...config,
            action: (elements) => {
                elements.forEach(element => {
                    const newNode = SOMSDomManager.NodeManager.replace(element, config.nodeOptions || {});
                    
                    // Appliquer les styles si demandé
                    if (config.styleOptions) {
                        SOMSDomManager.StyleManager.copy(element, newNode, config.styleOptions);
                    }
                    
                    // Appliquer le remplacement de texte si demandé
                    if (config.textOptions) {
                        SOMSDomManager.TextManager.replace(newNode, config.textOptions);
                    }
                });
            }
        });
    }

    /**
     * Remplace du texte dans des éléments
     */
    replaceText(config) {
        return this.operation({
            ...config,
            action: (elements) => {
                elements.forEach(element => {
                    SOMSDomManager.TextManager.replace(element, config.textOptions || {});
                    
                    // Appliquer les styles si demandé
                    if (config.styleOptions) {
                        SOMSDomManager.StyleManager.copy(element, element, config.styleOptions);
                    }
                    
                    // Ajouter des classes si demandé
                    if (config.addClass) {
                        const classes = Array.isArray(config.addClass) ? config.addClass : [config.addClass];
                        element.classList.add(...classes);
                    }
                });
            }
        });
    }

    /**
     * Supprime du texte dans des éléments
     */
    removeText(config) {
        return this.replaceText({
            ...config,
            textOptions: {
                ...config.textOptions,
                replacement: ''
            }
        });
    }

    /**
     * Supprime des nœuds
     */
    removeNodes(config) {
        return this.operation({
            ...config,
            action: (elements) => {
                elements.forEach(element => {
                    SOMSDomManager.NodeManager.remove(element);
                });
            }
        });
    }

    /**
     * Copie des styles sur des éléments
     */
    copyStyles(config) {
        return this.operation({
            ...config,
            action: (elements) => {
                elements.forEach(element => {
                    if (config.sourceSelector) {
                        const source = document.querySelector(config.sourceSelector);
                        if (source) {
                            SOMSDomManager.StyleManager.copy(source, element, config.styleOptions || {});
                        }
                    }
                });
            }
        });
    }

    /* ========================================================================================== */
    /* ============================= EXÉCUTION ET OBSERVATION =================================== */
    /* ========================================================================================== */

    /**
     * Exécute une opération sur les éléments actuels
     */
    executeOperation(operation) {
        const { targetSelector, targetChild, action } = operation;
        
        document.querySelectorAll(targetSelector).forEach(parent => {
            const elements = targetChild 
                ? Array.from(parent.querySelectorAll(targetChild))
                : [parent];
            
            action(elements);
        });

        if (this.config.debug) {
            console.log('✅ Opération exécutée:', operation.id);
        }
    }

    /**
     * Observe et exécute automatiquement sur les mutations
     */
    observeOperation(operation) {
        const { targetSelector, debounce } = operation;
        let timeoutId = null;

        const callback = (mutationsList) => {
            const execute = () => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const matches = node.matches(targetSelector)
                                    ? [node]
                                    : Array.from(node.querySelectorAll(targetSelector));
                                
                                if (matches.length > 0) {
                                    this.executeOperation(operation);
                                }
                            }
                        });
                    }
                }
            };

            if (debounce > 0) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(execute, debounce);
            } else {
                execute();
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true, subtree: true });
        
        this.observers.push({ operation: operation.id, observer });

        if (this.config.debug) {
            console.log('👁️ Observer créé pour:', operation.id);
        }
    }

    /**
     * Lance toutes les opérations enregistrées
     */
    run() {
        if (this.config.debug) {
            console.log('🏃 Exécution de', this.operations.length, 'opération(s)');
        }

        this.operations.forEach(operation => {
            // Exécution initiale
            this.executeOperation(operation);

            // Observer si activé
            if (operation.autoObserve) {
                this.observeOperation(operation);
            }
        });

        return this;
    }

    /**
     * Arrête tous les observers
     */
    stop() {
        this.observers.forEach(({ observer }) => observer.disconnect());
        this.observers = [];
        
        if (this.config.debug) {
            console.log('⏹️ Tous les observers arrêtés');
        }
        
        return this;
    }

    /**
     * Réinitialise toutes les opérations
     */
    reset() {
        this.stop();
        this.operations = [];
        
        if (this.config.debug) {
            console.log('🔄 Manager réinitialisé');
        }
        
        return this;
    }

    /* ========================================================================================== */
    /* ============================= MÉTHODES UTILITAIRES ======================================= */
    /* ========================================================================================== */

    /**
     * Utilise un preset de style
     */
    static useStylePreset(presetName) {
        return SOMSDomManager.StyleManager.presets[presetName] || [];
    }

    /**
     * Utilise un preset de texte
     */
    static useTextPreset(presetName) {
        return SOMSDomManager.TextManager.presets[presetName] || {};
    }
}

/* ================================================================================================== */
/* ====================================== EXEMPLES D'UTILISATION ==================================== */
/* ================================================================================================== */

// Initialiser le manager
const soms = new SOMSDomManager({ 
    debug: true,
    autoObserve: true 
});

// EXEMPLE 1 : Remplacement de nœuds avec copie de styles
soms.replaceNodes({
    targetSelector: '.widget-section',
    targetChild: 'h3',
    nodeOptions: {
        newTag: 'p',
        addClass: 'custom-title'
    },
    styleOptions: {
        mode: 'safe',
        additional: {
            borderLeft: '4px solid blue',
            paddingLeft: '10px'
        }
    }
});

// EXEMPLE 2 : Remplacement de texte avec preset
soms.replaceText({
    targetSelector: '.contact-info',
    textOptions: SOMSDomManager.useTextPreset('maskEmail'),
    addClass: 'email-masked'
});

// EXEMPLE 3 : Copie de styles avec preset typography
soms.copyStyles({
    targetSelector: '.custom-element',
    sourceSelector: '.template-element',
    styleOptions: {
        include: SOMSDomManager.useStylePreset('typography'),
        additional: {
            color: 'red'
        }
    }
});

// EXEMPLE 4 : Chaînage d'opérations
soms
    .replaceText({
        targetSelector: '.price',
        textOptions: SOMSDomManager.useTextPreset('formatPrice')
    })
    .removeText({
        targetSelector: '.address',
        textOptions: SOMSDomManager.useTextPreset('removeFrance')
    })
    .replaceNodes({
        targetSelector: '.carousel',
        targetChild: 'h3',
        nodeOptions: { newTag: 'p' },
        styleOptions: { mode: 'computed' }
    })
    .run(); // Exécuter toutes les opérations

// EXEMPLE 5 : Opération complexe combinant plusieurs méthodes
soms.replaceNodes({
    targetSelector: '.advanced-widget',
    targetChild: 'h2',
    nodeOptions: {
        newTag: 'div',
        addClass: ['title', 'styled'],
        preserveChildren: true
    },
    styleOptions: {
        mode: 'computed',
        exclude: ['margin', 'padding'],
        additional: {
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px'
        }
    },
    textOptions: {
        search: /(\d+)€/g,
        replacement: '$1,00 EUR'
    },
    debounce: 300
}).run();

/* ================================================================================================== */
/* ======================================= API DOCUMENTATION ======================================== */
/* ================================================================================================== */

/*
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ INITIALISATION                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ const soms = new SOMSDomManager({ debug: true, autoObserve: true, debounce: 0 });            │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MÉTHODES PRINCIPALES                                                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ .replaceNodes(config)      → Remplace des éléments DOM                                         │
│ .replaceText(config)       → Remplace du texte                                                  │
│ .removeText(config)        → Supprime du texte                                                  │
│ .removeNodes(config)       → Supprime des éléments                                              │
│ .copyStyles(config)        → Copie des styles CSS                                               │
│ .run()                     → Exécute toutes les opérations                                      │
│ .stop()                    → Arrête l'observation                                               │
│ .reset()                   → Réinitialise                                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SOUS-CLASSES STATIQUES (utilisables directement)                                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SOMSDomManager.StyleManager.copy(source, target, options)                                      │
│ SOMSDomManager.TextManager.replace(element, options)                                           │
│ SOMSDomManager.NodeManager.replace(node, options)                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PRESETS                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SOMSDomManager.useStylePreset('typography')  → Présets de styles                               │
│ SOMSDomManager.useTextPreset('maskEmail')    → Présets de remplacement texte                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

AVANTAGES DE CETTE ARCHITECTURE :
✅ Modulaire : Chaque méthode est indépendante
✅ Composable : On combine les méthodes selon les besoins
✅ Chaînable : Pattern Fluent API
✅ Réutilisable : Présets et sous-classes statiques
✅ Flexible : Options granulaires
✅ Performant : Debounce et observation intelligente
*/
