/**
 * ORSIF - Hierarchy Page JavaScript
 */

(function() {
    'use strict';

    let hierarchyData = null;

    // Color mapping for hierarchy levels
    const levelColors = {
        federal: '#c0392b',
        state: '#2980b9',
        accreditation: '#8e44ad',
        professional: '#27ae60',
        institutional: '#f39c12',
        individual: '#1abc9c'
    };

    /**
     * Initialize the hierarchy page
     */
    async function init() {
        // Load hierarchy data
        hierarchyData = await ORSIF.loadData('hierarchy.json');

        if (!hierarchyData) {
            showError('Failed to load hierarchy data. Please refresh the page.');
            return;
        }

        // Render the hierarchy tree
        renderHierarchy();

        // Check for hash in URL to auto-expand section
        if (window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            setTimeout(() => {
                expandSection(sectionId);
                ORSIF.scrollToElement(sectionId);
            }, 100);
        }
    }

    /**
     * Render the full hierarchy tree
     */
    function renderHierarchy() {
        const container = document.getElementById('hierarchy-tree');
        if (!container || !hierarchyData.levels) return;

        let html = '';

        hierarchyData.levels.forEach(level => {
            html += renderLevel(level);
        });

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.hierarchy-header').forEach(header => {
            header.addEventListener('click', handleSectionClick);
        });
    }

    /**
     * Render a single hierarchy level
     */
    function renderLevel(level) {
        const color = levelColors[level.id] || '#333';

        let contentHtml = '';

        // Federal level - has agencies
        if (level.agencies) {
            contentHtml = renderAgencies(level.agencies);
        }

        // State level - has overview content
        if (level.content) {
            contentHtml = renderStateContent(level.content);
        }

        // Accreditation level - has organizations
        if (level.organizations) {
            contentHtml = renderAccreditationOrgs(level.organizations);
        }

        // Professional level - has organizations and international orgs
        if (level.id === 'professional') {
            contentHtml = renderProfessionalOrgs(level);
        }

        // Institutional level - has components
        if (level.components && level.id === 'institutional') {
            contentHtml = renderInstitutionalComponents(level);
        }

        // Individual level - has components
        if (level.components && level.id === 'individual') {
            contentHtml = renderIndividualComponents(level);
        }

        return `
            <div class="hierarchy-section" id="${level.id}" data-level="${level.id}">
                <div class="hierarchy-header" style="border-left: 5px solid ${color};">
                    <div class="level-icon" style="background-color: ${color};">${level.order}</div>
                    <div class="header-text">
                        <h3>${level.name}</h3>
                        <p class="level-description">${level.description}</p>
                    </div>
                    <span class="expand-icon">&#9660;</span>
                </div>
                <div class="hierarchy-content">
                    ${contentHtml}
                </div>
            </div>
        `;
    }

    /**
     * Render federal agencies
     */
    function renderAgencies(agencies) {
        return agencies.map(agency => `
            <div class="agency-card">
                <h4>${agency.name}</h4>
                <p class="agency-fullname">${agency.fullName}</p>
                ${agency.regulation ? `<span class="regulation-tag">${agency.regulation}</span>` : ''}
                <p class="agency-role">${agency.role}</p>
                ${agency.keyPoints ? `
                    <ul class="key-points">
                        ${agency.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                ` : ''}
                ${agency.links ? `
                    <div class="agency-links">
                        <strong>Resources:</strong>
                        <ul class="link-list">
                            ${agency.links.map(link => `
                                <li><a href="${link.url}" target="_blank">${link.label}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    /**
     * Render state level content
     */
    function renderStateContent(content) {
        let html = `<p>${content.overview}</p>`;

        if (content.keyResources) {
            html += `
                <div class="state-resources">
                    <h4>Key Resources for Finding State Regulations</h4>
                    <div class="resource-cards">
                        ${content.keyResources.map(res => `
                            <a href="${res.url}" target="_blank" class="resource-card-mini">
                                <strong>${res.label}</strong>
                                <p>${res.description}</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (content.variations) {
            html += `
                <div class="variations-note">
                    <h4>How States Vary</h4>
                    <ul>
                        ${content.variations.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        html += `
            <div class="mt-2">
                <a href="states.html" class="btn btn-primary">Find Your State's Regulations</a>
            </div>
        `;

        return html;
    }

    /**
     * Render accreditation organizations
     */
    function renderAccreditationOrgs(organizations) {
        return organizations.map(org => `
            <div class="org-card">
                <h4>${org.name}</h4>
                <p class="org-fullname">${org.fullName}</p>
                <p class="org-role">${org.role}</p>
                ${org.keyPoints ? `
                    <ul class="key-points">
                        ${org.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                ` : ''}
                ${org.effectiveDate ? `<p class="effective-date"><small>Effective: ${org.effectiveDate}</small></p>` : ''}
                ${org.links ? `
                    <div class="org-links">
                        <ul class="link-list">
                            ${org.links.map(link => `
                                <li><a href="${link.url}" target="_blank">${link.label}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    /**
     * Render professional organizations
     */
    function renderProfessionalOrgs(level) {
        let html = '';

        if (level.organizations) {
            html += `<h4>US Professional Organizations</h4>`;
            html += `<div class="org-grid">`;
            html += level.organizations.map(org => `
                <div class="org-card compact">
                    <h5>${org.name}</h5>
                    <p class="org-fullname">${org.fullName}</p>
                    <p class="org-role">${org.role}</p>
                    ${org.keyDocuments ? `
                        <div class="key-docs">
                            <strong>Key Documents:</strong>
                            <ul>
                                ${org.keyDocuments.map(doc => `<li>${doc}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${org.links ? `
                        <ul class="link-list compact">
                            ${org.links.slice(0, 2).map(link => `
                                <li><a href="${link.url}" target="_blank">${link.label}</a></li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('');
            html += `</div>`;
        }

        if (level.internationalOrganizations) {
            html += `<h4 class="mt-2">International Guidance Organizations</h4>`;
            html += `<div class="org-grid">`;
            html += level.internationalOrganizations.map(org => `
                <div class="org-card compact international">
                    <h5>${org.name}</h5>
                    <p class="org-fullname">${org.fullName}</p>
                    <p class="org-role">${org.role}</p>
                    ${org.keyDocument ? `<p class="key-doc"><strong>Key:</strong> ${org.keyDocument}</p>` : ''}
                    ${org.note ? `<p class="org-note"><small>${org.note}</small></p>` : ''}
                    ${org.links ? `
                        <ul class="link-list compact">
                            ${org.links.map(link => `
                                <li><a href="${link.url}" target="_blank">${link.label}</a></li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('');
            html += `</div>`;
        }

        return html;
    }

    /**
     * Render institutional components
     */
    function renderInstitutionalComponents(level) {
        let html = '';

        if (level.components) {
            html += level.components.map(comp => `
                <div class="component-card">
                    <h4>${comp.name}</h4>
                    ${comp.requirements ? `
                        <div class="requirements">
                            <strong>Requirements:</strong>
                            <ul>
                                ${comp.requirements.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${comp.requiredMembers ? `
                        <div class="requirements">
                            <strong>Required Members:</strong>
                            <ul>
                                ${comp.requiredMembers.map(mem => `<li>${mem}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${comp.responsibilities ? `
                        <div class="responsibilities">
                            <strong>Responsibilities:</strong>
                            <ul>
                                ${comp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${comp.links ? `
                        <ul class="link-list">
                            ${comp.links.map(link => `
                                <li><a href="${link.url}" target="_blank">${link.label}</a></li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('');
        }

        if (level.exampleManuals) {
            html += `
                <div class="example-manuals">
                    <h4>Example Hospital Radiation Safety Manuals</h4>
                    <ul class="link-list">
                        ${level.exampleManuals.map(manual => `
                            <li><a href="${manual.url}" target="_blank">${manual.institution}</a></li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        return html;
    }

    /**
     * Render individual worker components
     */
    function renderIndividualComponents(level) {
        return level.components.map(comp => `
            <div class="component-card">
                <h4>${comp.name}</h4>
                ${comp.whoNeedsMonitoring ? `
                    <div class="monitoring-info">
                        <strong>Who Needs Monitoring:</strong>
                        <ul>
                            ${comp.whoNeedsMonitoring.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${comp.badgeTypes ? `
                    <div class="badge-types">
                        <strong>Badge Types:</strong>
                        <ul>
                            ${comp.badgeTypes.map(badge => `<li>${badge}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${comp.requirements ? `
                    <div class="requirements">
                        <strong>Requirements:</strong>
                        <ul>
                            ${comp.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${comp.effectiveness ? `<p class="effectiveness"><strong>Effectiveness:</strong> ${comp.effectiveness}</p>` : ''}
                ${comp.typical ? `
                    <div class="typical-requirements">
                        <strong>Typical Requirements:</strong>
                        <ul>
                            ${comp.typical.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${comp.links ? `
                    <ul class="link-list">
                        ${comp.links.map(link => `
                            <li><a href="${link.url}" target="_blank">${link.label}</a></li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>
        `).join('');
    }

    /**
     * Handle section header click
     */
    function handleSectionClick(event) {
        const header = event.currentTarget;
        const section = header.closest('.hierarchy-section');

        if (section) {
            section.classList.toggle('expanded');

            // Update URL hash
            if (section.classList.contains('expanded')) {
                history.replaceState(null, null, `#${section.id}`);
            }
        }
    }

    /**
     * Expand a specific section by ID
     */
    function expandSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('expanded');
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        const container = document.getElementById('hierarchy-tree');
        if (container) {
            container.innerHTML = `
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
