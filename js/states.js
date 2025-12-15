/**
 * ORSIF - State Finder Page JavaScript
 */

(function() {
    'use strict';

    let statesData = null;

    /**
     * Initialize the state finder page
     */
    async function init() {
        // Load states data
        statesData = await ORSIF.loadData('states.json');

        if (!statesData) {
            showError('Failed to load state data. Please refresh the page.');
            return;
        }

        // Set up event listeners
        const stateSelect = document.getElementById('state-select');
        if (stateSelect) {
            stateSelect.addEventListener('change', handleStateChange);
        }

        // Check for state in URL params
        const params = ORSIF.getUrlParams();
        const stateParam = params.get('state');
        if (stateParam && stateSelect) {
            stateSelect.value = stateParam.toUpperCase();
            handleStateChange();
        }
    }

    /**
     * Handle state selection change
     */
    function handleStateChange() {
        const stateSelect = document.getElementById('state-select');
        const stateCode = stateSelect.value;
        const stateInfo = document.getElementById('state-info');
        const stateDefault = document.getElementById('state-default');

        if (!stateCode) {
            // No state selected - show default
            stateInfo.style.display = 'none';
            stateInfo.classList.remove('active');
            stateDefault.style.display = 'block';
            ORSIF.updateUrlParams({ state: null });
            return;
        }

        // Update URL
        ORSIF.updateUrlParams({ state: stateCode });

        // Hide default, show info
        stateDefault.style.display = 'none';

        // Check if we have detailed data for this state
        if (statesData[stateCode]) {
            displayDetailedState(stateCode, statesData[stateCode]);
        } else {
            displayGenericState(stateCode);
        }
    }

    /**
     * Display detailed state information
     */
    function displayDetailedState(code, data) {
        const stateInfo = document.getElementById('state-info');
        const isAgreement = isAgreementState(code);

        let html = `
            <div class="state-header">
                <h2>${data.name}</h2>
                <span class="agreement-badge ${isAgreement ? 'yes' : 'no'}">
                    ${isAgreement ? 'Agreement State' : 'Non-Agreement State'}
                </span>
            </div>

            <div class="state-section">
                <h3>Regulatory Agency</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Agency</strong>
                        ${ORSIF.escapeHtml(data.agency)}
                    </div>
                    ${data.contact && data.contact.phone ? `
                    <div class="info-item">
                        <strong>Phone</strong>
                        <a href="tel:${data.contact.phone}">${ORSIF.formatPhone(data.contact.phone)}</a>
                    </div>
                    ` : ''}
                    ${data.contact && data.contact.website ? `
                    <div class="info-item">
                        <strong>Website</strong>
                        <a href="${data.contact.website}" target="_blank">Visit Website</a>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Key Features
        if (data.keyFeatures && data.keyFeatures.length > 0) {
            html += `
                <div class="state-section">
                    <h3>Key Features</h3>
                    <ul class="feature-list">
                        ${data.keyFeatures.map(f => `<li>${ORSIF.escapeHtml(f)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Links
        if (data.links && data.links.length > 0) {
            html += `
                <div class="state-section">
                    <h3>Official Resources</h3>
                    <ul class="link-list">
                        ${data.links.map(link => `
                            <li>
                                <a href="${link.url}" target="_blank">${ORSIF.escapeHtml(link.label)}</a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        // PDFs
        if (data.pdfs && data.pdfs.length > 0) {
            html += `
                <div class="state-section">
                    <h3>Available Documents</h3>
                    <div class="pdf-list">
                        ${data.pdfs.map(pdf => `
                            <div class="pdf-item">
                                <span class="pdf-icon">&#128196;</span>
                                <div class="pdf-info">
                                    <strong>${ORSIF.escapeHtml(pdf.name)}</strong>
                                    <div class="pdf-actions">
                                        <a href="pdfs/State_Regulations/${pdf.file}" class="btn btn-sm btn-primary" download>Download</a>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Agreement State Info
        html += `
            <div class="state-section">
                <h3>Agreement State Status</h3>
                <p>
                    ${isAgreement
                        ? `<strong>${data.name}</strong> is an <strong>Agreement State</strong>, meaning it has signed an agreement with the NRC to regulate certain radioactive materials. The state radiation control program implements both state and NRC-equivalent regulations.`
                        : `<strong>${data.name}</strong> is a <strong>Non-Agreement State</strong>, meaning the NRC directly regulates radioactive materials in this state. The state still regulates X-ray equipment and other radiation-producing machines.`
                    }
                </p>
            </div>
        `;

        // CRCPD Link
        html += `
            <div class="state-section">
                <h3>Additional Information</h3>
                <p>For the most current contact information and regulations:</p>
                <a href="https://www.crcpd.org/mpage/StateContactDirector" target="_blank" class="btn btn-secondary">
                    View on CRCPD Directory
                </a>
            </div>
        `;

        stateInfo.innerHTML = html;
        stateInfo.style.display = 'block';
        stateInfo.classList.add('active');
    }

    /**
     * Display generic state information (for states without detailed data)
     */
    function displayGenericState(code) {
        const stateInfo = document.getElementById('state-info');
        const stateName = getStateName(code);
        const isAgreement = isAgreementState(code);

        const html = `
            <div class="state-header">
                <h2>${stateName}</h2>
                <span class="agreement-badge ${isAgreement ? 'yes' : 'no'}">
                    ${isAgreement ? 'Agreement State' : 'Non-Agreement State'}
                </span>
            </div>

            <div class="state-section">
                <div class="info-box">
                    <h3>Detailed Information Coming Soon</h3>
                    <p>We don't yet have detailed information for ${stateName}. Please use the official resources below to find your state's radiation control program.</p>
                </div>
            </div>

            <div class="state-section">
                <h3>Find ${stateName} Regulations</h3>
                <div class="resource-buttons">
                    <a href="https://www.crcpd.org/mpage/StateContactDirector" target="_blank" class="btn btn-primary">
                        CRCPD State Directory
                    </a>
                    <a href="https://www.asrt.org/main/standards-and-regulations/legislation-regulations-and-advocacy/states-that-regulate" target="_blank" class="btn btn-secondary">
                        ASRT State Regulations
                    </a>
                </div>
            </div>

            <div class="state-section">
                <h3>Agreement State Status</h3>
                <p>
                    ${isAgreement
                        ? `<strong>${stateName}</strong> is an <strong>Agreement State</strong>, meaning it has signed an agreement with the NRC to regulate certain radioactive materials.`
                        : `<strong>${stateName}</strong> is a <strong>Non-Agreement State</strong>, meaning the NRC directly regulates radioactive materials in this state.`
                    }
                </p>
                <a href="https://scp.nrc.gov/asdirectory.html" target="_blank" class="btn btn-sm btn-secondary">
                    NRC Agreement State Directory
                </a>
            </div>

            <div class="state-section">
                <h3>Federal Requirements Apply</h3>
                <p>Regardless of state, federal OSHA regulations (29 CFR 1910.1096) apply to occupational radiation exposure. Key federal resources:</p>
                <ul class="link-list">
                    <li><a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1096" target="_blank">OSHA 29 CFR 1910.1096 - Ionizing Radiation</a></li>
                    <li><a href="https://www.nrc.gov/reading-rm/doc-collections/cfr/part020/" target="_blank">NRC 10 CFR Part 20 - Radiation Protection Standards</a></li>
                </ul>
            </div>
        `;

        stateInfo.innerHTML = html;
        stateInfo.style.display = 'block';
        stateInfo.classList.add('active');
    }

    /**
     * Show error message
     */
    function showError(message) {
        const stateInfo = document.getElementById('state-info');
        const stateDefault = document.getElementById('state-default');

        stateDefault.style.display = 'none';
        stateInfo.innerHTML = `
            <div class="error-message">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
        stateInfo.style.display = 'block';
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();
