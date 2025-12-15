/**
 * ORSIF - Resources Page JavaScript
 */

(function() {
    'use strict';

    let resourcesData = null;
    let allResources = [];

    // Category colors
    const categoryColors = {
        federal: '#c0392b',
        state: '#2980b9',
        hospital: '#8e44ad',
        training: '#27ae60',
        epa: '#f39c12',
        ssrcr: '#1abc9c'
    };

    /**
     * Initialize the resources page
     */
    async function init() {
        // Load resources data
        resourcesData = await ORSIF.loadData('resources.json');

        if (!resourcesData) {
            showError('Failed to load resources data. Please refresh the page.');
            return;
        }

        allResources = resourcesData.resources || [];

        // Set up event listeners
        setupFilters();

        // Initial render
        renderResources(allResources);

        // Check for URL params
        applyUrlFilters();
    }

    /**
     * Set up filter event listeners
     */
    function setupFilters() {
        const categoryFilter = document.getElementById('filter-category');
        const stateFilter = document.getElementById('filter-state');
        const searchInput = document.getElementById('filter-search');
        const clearBtn = document.getElementById('clear-filters');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', applyFilters);
        }

        if (stateFilter) {
            stateFilter.addEventListener('change', applyFilters);
        }

        if (searchInput) {
            searchInput.addEventListener('input', ORSIF.debounce(applyFilters, 300));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', clearFilters);
        }
    }

    /**
     * Apply filters and re-render
     */
    function applyFilters() {
        const category = document.getElementById('filter-category').value;
        const state = document.getElementById('filter-state').value;
        const search = document.getElementById('filter-search').value.toLowerCase().trim();

        let filtered = allResources;

        // Filter by category
        if (category) {
            filtered = filtered.filter(r => r.category === category);
        }

        // Filter by state
        if (state) {
            filtered = filtered.filter(r => r.state === state);
        }

        // Filter by search term
        if (search) {
            filtered = filtered.filter(r => {
                const searchFields = [
                    r.title,
                    r.description,
                    r.organization,
                    ...(r.tags || [])
                ].join(' ').toLowerCase();

                return searchFields.includes(search);
            });
        }

        // Update URL params
        ORSIF.updateUrlParams({
            category: category || null,
            state: state || null,
            search: search || null
        });

        renderResources(filtered);
    }

    /**
     * Apply filters from URL parameters
     */
    function applyUrlFilters() {
        const params = ORSIF.getUrlParams();

        const category = params.get('category');
        const state = params.get('state');
        const search = params.get('search');

        if (category) {
            document.getElementById('filter-category').value = category;
        }
        if (state) {
            document.getElementById('filter-state').value = state;
        }
        if (search) {
            document.getElementById('filter-search').value = search;
        }

        if (category || state || search) {
            applyFilters();
        }
    }

    /**
     * Clear all filters
     */
    function clearFilters() {
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-state').value = '';
        document.getElementById('filter-search').value = '';

        ORSIF.updateUrlParams({
            category: null,
            state: null,
            search: null
        });

        renderResources(allResources);
    }

    /**
     * Render resource cards
     */
    function renderResources(resources) {
        const grid = document.getElementById('resource-grid');
        const noResults = document.getElementById('no-results');
        const resultsCount = document.getElementById('results-count');

        if (!grid) return;

        // Update count
        resultsCount.textContent = `Showing ${resources.length} of ${allResources.length} resources`;

        // Handle no results
        if (resources.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        noResults.style.display = 'none';

        // Render cards
        grid.innerHTML = resources.map(resource => renderResourceCard(resource)).join('');
    }

    /**
     * Render a single resource card
     */
    function renderResourceCard(resource) {
        const color = categoryColors[resource.category] || '#333';
        const categoryName = getCategoryName(resource.category);

        return `
            <div class="resource-card" data-category="${resource.category}">
                <div class="resource-card-header" style="background-color: ${color};">
                    <h4>${ORSIF.escapeHtml(resource.title)}</h4>
                </div>
                <div class="resource-card-body">
                    <div class="resource-meta">
                        <span class="resource-tag">${categoryName}</span>
                        ${resource.state ? `<span class="resource-tag">${getStateName(resource.state)}</span>` : ''}
                        <span class="resource-tag">${ORSIF.escapeHtml(resource.organization)}</span>
                    </div>
                    <p class="resource-description">${ORSIF.escapeHtml(resource.description)}</p>
                    ${resource.note ? `<p class="resource-note"><small>${ORSIF.escapeHtml(resource.note)}</small></p>` : ''}
                    <div class="resource-actions">
                        ${resource.file ? `
                            <a href="pdfs/${resource.file}" class="btn btn-sm btn-primary" download>
                                Download PDF
                            </a>
                        ` : ''}
                        ${resource.externalUrl ? `
                            <a href="${resource.externalUrl}" target="_blank" class="btn btn-sm btn-secondary">
                                View Source
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get category display name
     */
    function getCategoryName(categoryId) {
        const categories = {
            federal: 'Federal/National',
            state: 'State Regulation',
            hospital: 'Hospital/University',
            training: 'Training/Educational',
            epa: 'EPA',
            ssrcr: 'SSRCR'
        };
        return categories[categoryId] || categoryId;
    }

    /**
     * Show error message
     */
    function showError(message) {
        const grid = document.getElementById('resource-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message">
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();
