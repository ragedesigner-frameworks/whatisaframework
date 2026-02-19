/**
 * whatisaframework.com Agent Core
 * Shared utilities for the Agent Economy Hub
 * Version 2.0.0
 */
const AgentCore = (function() {
    'use strict';

    const CONFIG = {
        storageKey: 'wif_agent_token',
        profileKey: 'wif_agent_profile',
        expiryDays: 90,
        expiryNoticeDays: 7,
        apiBase: '/api',
        version: '2.0.0'
    };

    // ===== TOKEN MANAGEMENT =====

    function generateToken(tier, data) {
        const prefixes = { basic: 'WIF', advanced: 'AGT', enterprise: 'ENT' };
        const prefix = prefixes[tier] || 'WIF';
        const identifier = sanitizeForToken(data.identifier || 'USER');
        const randomPart = tier === 'basic' 
            ? randomHex(4) 
            : randomHex(6);
        return prefix + '-' + identifier.substring(0, 8).toUpperCase() + '-' + randomPart;
    }

    function randomHex(length) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function sanitizeForToken(str) {
        return str.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'ANON';
    }

    function saveToken(token) {
        try {
            const data = {
                token: token,
                created: new Date().toISOString(),
                expires: new Date(Date.now() + CONFIG.expiryDays * 86400000).toISOString()
            };
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
            return true;
        } catch(e) {
            console.warn('AgentCore: Unable to save token to localStorage');
            return false;
        }
    }

    function getToken() {
        try {
            const raw = localStorage.getItem(CONFIG.storageKey);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (new Date(data.expires) < new Date()) {
                clearToken();
                return null;
            }
            return data;
        } catch(e) {
            return null;
        }
    }

    function clearToken() {
        try {
            localStorage.removeItem(CONFIG.storageKey);
            localStorage.removeItem(CONFIG.profileKey);
        } catch(e) {}
    }

    function isTokenExpiringSoon() {
        const tokenData = getToken();
        if (!tokenData) return false;
        const expires = new Date(tokenData.expires);
        const warningDate = new Date(Date.now() + CONFIG.expiryNoticeDays * 86400000);
        return expires < warningDate;
    }

    // ===== PROFILE MANAGEMENT =====

    function saveProfile(profile) {
        try {
            localStorage.setItem(CONFIG.profileKey, JSON.stringify({
                ...profile,
                savedAt: new Date().toISOString()
            }));
            return true;
        } catch(e) {
            return false;
        }
    }

    function getProfile() {
        try {
            const raw = localStorage.getItem(CONFIG.profileKey);
            return raw ? JSON.parse(raw) : null;
        } catch(e) {
            return null;
        }
    }

    // ===== TIER MANAGEMENT =====

    function calculateTier(score, totalPossible) {
        const pct = (score / totalPossible) * 100;
        if (pct >= 76) return 'enterprise';
        if (pct >= 41) return 'advanced';
        return 'basic';
    }

    function getTierInfo(tier) {
        const tiers = {
            basic: {
                label: 'Framework Explorer',
                color: '#4CAF50',
                prefix: 'WIF',
                access: 'Full framework library access with guided recommendations'
            },
            advanced: {
                label: 'Framework Practitioner',
                color: '#2196F3',
                prefix: 'AGT',
                access: 'Full library + taxonomy explorer + personalized methodology path'
            },
            enterprise: {
                label: 'Strategic Intelligence Agent',
                color: '#E67E50',
                prefix: 'ENT',
                access: 'Full access + 343 architecture mapping + custom framework generation guidance'
            }
        };
        return tiers[tier] || tiers.basic;
    }

    // ===== API HELPERS =====

    function fetchJSON(endpoint) {
        const url = endpoint.startsWith('http') ? endpoint : CONFIG.apiBase + endpoint;
        return fetch(url)
            .then(function(r) { 
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            });
    }

    function fetchManifest() {
        return fetchJSON('/manifest.json');
    }

    function fetchRegistry() {
        return fetchJSON('/frameworks/registry.json');
    }

    function fetchCategories() {
        return fetchJSON('/frameworks/categories.json');
    }

    function fetchSearchIndex() {
        return fetchJSON('/search/index.json');
    }

    function fetchGateConfig() {
        return fetchJSON('/agent/config.json');
    }

    // ===== ANALYTICS HELPERS =====

    function trackEvent(action, category, label, value) {
        if (typeof gtag === 'function') {
            gtag('event', action, {
                event_category: category || 'agent_hub',
                event_label: label || '',
                value: value || 0
            });
        }
    }

    // ===== REFERRAL SYSTEM =====

    function getReferralCode() {
        const params = new URLSearchParams(window.location.search);
        return params.get('ref') || null;
    }

    function generateReferralLink(token) {
        return window.location.origin + '/agent/verify.html?ref=' + encodeURIComponent(token);
    }

    // ===== UI HELPERS =====

    function createTierBadge(tier) {
        const info = getTierInfo(tier);
        const badge = document.createElement('span');
        badge.className = 'tier-badge';
        badge.style.cssText = 'display:inline-block;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:600;color:white;background:' + info.color;
        badge.textContent = info.label;
        return badge;
    }

    function showTokenBar() {
        const tokenData = getToken();
        const profile = getProfile();
        if (!tokenData || !profile) return;
        
        const bar = document.createElement('div');
        bar.id = 'agent-token-bar';
        bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#1A2332;color:white;padding:8px 24px;display:flex;justify-content:space-between;align-items:center;z-index:999;font-size:0.85rem;box-shadow:0 -2px 10px rgba(0,0,0,0.2)';
        
        const tierInfo = getTierInfo(profile.tier);
        bar.innerHTML = '<div style="display:flex;align-items:center;gap:12px"><span style="color:' + tierInfo.color + ';font-weight:600">' + tierInfo.label + '</span><span style="opacity:0.6">Token: ' + tokenData.token + '</span></div><a href="/agent/verify.html" style="color:#E67E50;text-decoration:none;font-weight:500">Manage →</a>';
        
        document.body.appendChild(bar);
        document.body.style.paddingBottom = '44px';
    }

    // ===== PUBLIC API =====

    return {
        version: CONFIG.version,
        // Token
        generateToken: generateToken,
        saveToken: saveToken,
        getToken: getToken,
        clearToken: clearToken,
        isTokenExpiringSoon: isTokenExpiringSoon,
        // Profile
        saveProfile: saveProfile,
        getProfile: getProfile,
        // Tiers
        calculateTier: calculateTier,
        getTierInfo: getTierInfo,
        createTierBadge: createTierBadge,
        // API
        fetchJSON: fetchJSON,
        fetchManifest: fetchManifest,
        fetchRegistry: fetchRegistry,
        fetchCategories: fetchCategories,
        fetchSearchIndex: fetchSearchIndex,
        fetchGateConfig: fetchGateConfig,
        // Analytics
        trackEvent: trackEvent,
        // Referral
        getReferralCode: getReferralCode,
        generateReferralLink: generateReferralLink,
        // UI
        showTokenBar: showTokenBar
    };
})();
