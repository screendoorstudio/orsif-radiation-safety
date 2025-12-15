/**
 * ORSIF - Occupational Radiation Safety Information Framework
 * Main Application JavaScript
 */

// ===================================
// Data Loading Utilities
// ===================================

const ORSIF = {
    data: {},
    basePath: '',

    /**
     * Initialize the application
     */
    init: function() {
        this.setupNavigation();
        this.detectBasePath();
    },

    /**
     * Detect the base path for data files
     */
    detectBasePath: function() {
        // Handle both local and hosted environments
        const path = window.location.pathname;
        if (path.includes('/orsif-radiation-safety/')) {
            this.basePath = '/orsif-radiation-safety/';
        } else {
            this.basePath = '';
        }
    },

    /**
     * Load JSON data file
     * @param {string} filename - Name of the JSON file (without path)
     * @returns {Promise} - Promise resolving to parsed JSON data
     */
    loadData: async function(filename) {
        try {
            const response = await fetch(`${this.basePath}data/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status}`);
            }
            const data = await response.json();
            this.data[filename.replace('.json', '')] = data;
            return data;
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    },

    /**
     * Load multiple data files
     * @param {string[]} filenames - Array of JSON filenames
     * @returns {Promise} - Promise resolving when all files are loaded
     */
    loadMultiple: async function(filenames) {
        const promises = filenames.map(f => this.loadData(f));
        return Promise.all(promises);
    },

    // ===================================
    // Navigation
    // ===================================

    /**
     * Setup mobile navigation toggle
     */
    setupNavigation: function() {
        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelector('.nav-links');

        if (toggle && links) {
            toggle.addEventListener('click', function() {
                links.classList.toggle('active');
                toggle.classList.toggle('active');
            });

            // Close menu when clicking a link
            links.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    links.classList.remove('active');
                    toggle.classList.remove('active');
                });
            });
        }

        // Highlight current page in navigation
        this.highlightCurrentPage();
    },

    /**
     * Highlight the current page in navigation
     */
    highlightCurrentPage: function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    // ===================================
    // UI Utilities
    // ===================================

    /**
     * Create an element with optional classes and content
     * @param {string} tag - HTML tag name
     * @param {object} options - Options: classes, text, html, attrs
     * @returns {HTMLElement}
     */
    createElement: function(tag, options = {}) {
        const el = document.createElement(tag);

        if (options.classes) {
            if (Array.isArray(options.classes)) {
                el.classList.add(...options.classes);
            } else {
                el.classList.add(options.classes);
            }
        }

        if (options.text) {
            el.textContent = options.text;
        }

        if (options.html) {
            el.innerHTML = options.html;
        }

        if (options.attrs) {
            Object.entries(options.attrs).forEach(([key, value]) => {
                el.setAttribute(key, value);
            });
        }

        return el;
    },

    /**
     * Show a loading spinner in a container
     * @param {HTMLElement} container - Container element
     */
    showLoading: function(container) {
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    },

    /**
     * Show an error message in a container
     * @param {HTMLElement} container - Container element
     * @param {string} message - Error message
     */
    showError: function(container, message) {
        container.innerHTML = `
            <div class="error-message">
                <p>Error: ${message}</p>
                <p>Please try refreshing the page.</p>
            </div>
        `;
    },

    /**
     * Debounce function for search inputs
     * @param {function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {function}
     */
    debounce: function(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // ===================================
    // Formatting Utilities
    // ===================================

    /**
     * Format a phone number for display
     * @param {string} phone - Phone number
     * @returns {string}
     */
    formatPhone: function(phone) {
        if (!phone) return '';
        // Remove non-digits
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 10) {
            return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
        }
        return phone;
    },

    /**
     * Create a safe ID from a string
     * @param {string} str - String to convert
     * @returns {string}
     */
    toSafeId: function(str) {
        return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} str - String to escape
     * @returns {string}
     */
    escapeHtml: function(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // ===================================
    // URL Utilities
    // ===================================

    /**
     * Get URL parameters
     * @returns {URLSearchParams}
     */
    getUrlParams: function() {
        return new URLSearchParams(window.location.search);
    },

    /**
     * Update URL parameters without page reload
     * @param {object} params - Parameters to set
     */
    updateUrlParams: function(params) {
        const url = new URL(window.location);
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState({}, '', url);
    },

    /**
     * Scroll to element with offset for fixed header
     * @param {string} id - Element ID
     */
    scrollToElement: function(id) {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// ===================================
// State Abbreviation Mappings
// ===================================

const STATE_NAMES = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia',
    'PR': 'Puerto Rico', 'VI': 'Virgin Islands', 'GU': 'Guam'
};

// NRC Agreement States (as of 2024)
const AGREEMENT_STATES = [
    'AL', 'AZ', 'AR', 'CA', 'CO', 'FL', 'GA', 'HI', 'ID', 'IL', 'IA', 'KS',
    'KY', 'LA', 'ME', 'MD', 'MA', 'MN', 'MS', 'NE', 'NV', 'NH', 'NJ', 'NM',
    'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VA', 'WA', 'WI'
];

/**
 * Check if a state is an NRC Agreement State
 * @param {string} abbrev - State abbreviation
 * @returns {boolean}
 */
function isAgreementState(abbrev) {
    return AGREEMENT_STATES.includes(abbrev.toUpperCase());
}

/**
 * Get full state name from abbreviation
 * @param {string} abbrev - State abbreviation
 * @returns {string}
 */
function getStateName(abbrev) {
    return STATE_NAMES[abbrev.toUpperCase()] || abbrev;
}

// ===================================
// Initialize on DOM Ready
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    ORSIF.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ORSIF, STATE_NAMES, AGREEMENT_STATES, isAgreementState, getStateName };
}
