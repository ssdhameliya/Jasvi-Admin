/**
 * UniversalLinkageService.js - Two-Way Audit Linkage & Cross-Workspace Traversal
 * Jasvi ERP Unified Web Admin Parity
 * Enables 2-way deep linking across Bank Statements, Bank Entries, Sales Invoices,
 * Purchase Bills, Operating Expenses, and Purchase Recon records.
 */
(function() {
  'use strict';

  function formatMoney(amount) {
    if (amount == null || isNaN(amount)) return '₹ 0.00';
    return '₹ ' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDate(d) {
    if (!d) return '-';
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
      return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (_) {
      return String(d);
    }
  }

  window.UniversalLinkageService = {
    activeDoc: null,

    async showLinkage(type, id, docNo, transactionId = null, financeId = null) {
      this.activeDoc = { type, id, docNo, transactionId, financeId };
      const modal = document.getElementById('modal-document-linkage');
      if (!modal) {
        console.warn('[UniversalLinkageService] #modal-document-linkage not found in DOM.');
        return;
      }

      // Set header details
      const titleEl = document.getElementById('mdl-title');
      const subEl = document.getElementById('mdl-subtitle');
      if (titleEl) titleEl.innerText = `Reconciliation & Bank Linkage: ${docNo || type || 'Record'}`;
      if (subEl) subEl.innerText = `Inspecting 2-way audit linkage across Bank Statement, Bank Entry, and ERP documents.`;

      // Reset KPIs & table to loading state
      this.setKpi('mdl-kpi-type', type || 'DOCUMENT');
      this.setKpi('mdl-kpi-count', 'Loading...');
      this.setKpi('mdl-kpi-amount', 'Loading...');
      this.setKpi('mdl-kpi-status', 'Querying...');

      const tbody = document.getElementById('mdl-tbody');
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <span style="font-size: 1.5rem; animation: spin 1s linear infinite;">⏳</span>
                <span>Querying authoritative financial allocations...</span>
              </div>
            </td>
          </tr>
        `;
      }

      modal.style.display = 'flex';

      try {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (id) params.append('id', id);
        if (docNo) params.append('docNo', docNo);
        if (transactionId) params.append('transactionId', transactionId);
        if (financeId) params.append('financeId', financeId);

        let data = null;
        if (window.ApiService && typeof window.ApiService.get === 'function') {
          data = await window.ApiService.get(`/api/bank-statements/linkage?${params.toString()}`);
        } else {
          const res = await fetch(`/api/bank-statements/linkage?${params.toString()}`);
          data = await res.json();
        }

        this.renderLinkageResults(data);
      } catch (err) {
        console.error('[UniversalLinkageService] Failed to load linkage:', err);
        if (tbody) {
          tbody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; padding: 24px; color: var(--red);">
                Failed to retrieve reconciliation linkage: ${err.message || err}
              </td>
            </tr>
          `;
        }
        this.setKpi('mdl-kpi-status', 'Error');
      }
    },

    setKpi(id, val) {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    },

    renderLinkageResults(data) {
      const items = (data && data.items) || [];
      const isLinked = data && data.linked && items.length > 0;

      let totalAlloc = 0;
      items.forEach(it => { totalAlloc += Number(it.allocatedAmount || 0); });

      this.setKpi('mdl-kpi-type', (data && data.queryType) || (this.activeDoc && this.activeDoc.type) || 'DOCUMENT');
      this.setKpi('mdl-kpi-count', `${items.length} Linked Record${items.length === 1 ? '' : 's'}`);
      this.setKpi('mdl-kpi-amount', formatMoney(totalAlloc));
      this.setKpi('mdl-kpi-status', isLinked ? '🟢 Reconciled' : '⚪ Unlinked');

      const tbody = document.getElementById('mdl-tbody');
      if (!tbody) return;

      if (!isLinked) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 36px 20px; color: var(--text-dim);">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <span style="font-size: 2.2rem; opacity: 0.6;">🔗</span>
                <span style="font-weight: 700; color: #fff; font-size: 0.95rem;">No Bank Statement or Bank Entry Linked Yet</span>
                <span style="font-size: 0.78rem; max-width: 440px; line-height: 1.4; color: var(--text-muted);">
                  This document has not been matched or allocated against any bank statement transaction or bank entry voucher.
                </span>
                <button type="button" class="btn btn-primary btn-sm" onclick="window.UniversalLinkageService.navigateToBankStatement()" style="margin-top: 6px; font-weight: 600;">
                  <span>📑</span> Open Bank Reconciliation
                </button>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = items.map(it => {
        const stmtRef = it.statementReference || 'BST-RECORD';
        const bankVoucher = it.voucherNo || (it.financeId ? `VCH #${it.financeId}` : '-');
        const docRef = it.documentNo || '-';
        const isCredit = (it.credit || 0) > 0;
        const txAmt = isCredit ? it.credit : (it.debit || 0);

        return `
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="white-space: nowrap;">
              <span class="pill-badge pill-cyan clickable" onclick="window.UniversalLinkageService.openStatementTx(${it.transactionId})" title="Click to view Bank Statement" style="cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-weight: 700;">
                <span>📑</span> ${stmtRef}
              </span>
            </td>
            <td style="white-space: nowrap;">
              ${it.financeId ? `
                <span class="pill-badge pill-purple clickable" onclick="window.UniversalLinkageService.openFinanceEntry(${it.financeId}, '${it.voucherNo || ''}')" title="Click to view Bank Entry Voucher" style="cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-weight: 700;">
                  <span>🏦</span> ${bankVoucher}
                </span>
              ` : '<span style="color: var(--text-dim);">-</span>'}
            </td>
            <td style="white-space: nowrap;">
              <span class="pill-badge pill-neutral clickable" onclick="window.UniversalLinkageService.openDocument('${it.targetType}', ${it.targetId}, '${docRef}')" title="Click to navigate to document" style="cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-weight: 600;">
                <span>📄</span> ${docRef}
              </span>
            </td>
            <td style="white-space: nowrap; font-size: 0.78rem;">
              ${formatDate(it.transactionDate)}
            </td>
            <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.78rem; color: var(--text-muted);" title="${it.narration || it.bankReference || ''}">
              ${it.bankReference ? `<strong>${it.bankReference}</strong> • ` : ''}${it.narration || '-'}
            </td>
            <td style="text-align: right; white-space: nowrap; font-weight: 700; color: ${isCredit ? 'var(--green)' : 'var(--red)'};">
              ${isCredit ? '+ ' : '- '}${formatMoney(txAmt)}
            </td>
            <td style="text-align: right; white-space: nowrap; font-weight: 800; color: #38bdf8;">
              ${formatMoney(it.allocatedAmount)}
            </td>
          </tr>
        `;
      }).join('');
    },

    closeModal() {
      const modal = document.getElementById('modal-document-linkage');
      if (modal) modal.style.display = 'none';
    },

    navigateToBankStatement() {
      this.closeModal();
      if (window.NavigationRouter && typeof window.NavigationRouter.selectNav === 'function') {
        window.NavigationRouter.selectNav('view-bank-statement');
      }
    },

    openStatementTx(txId) {
      this.closeModal();
      if (window.NavigationRouter && typeof window.NavigationRouter.selectNav === 'function') {
        window.NavigationRouter.selectNav('view-bank-statement');
      }
      if (window.BankStatementController && typeof window.BankStatementController.highlightTxnRow === 'function') {
        setTimeout(() => window.BankStatementController.highlightTxnRow(txId), 300);
      }
    },

    openFinanceEntry(financeId, voucherNo) {
      this.closeModal();
      if (window.BankStatementController && typeof window.BankStatementController.openLinkedDocument === 'function') {
        window.BankStatementController.openLinkedDocument(voucherNo || `VCH#${financeId}`, 'BANK_ENTRY', null, financeId);
      } else if (window.NavigationRouter && typeof window.NavigationRouter.selectNav === 'function') {
        window.NavigationRouter.selectNav('view-finance-register');
      }
    },

    openDocument(type, id, docNo) {
      this.closeModal();
      if (window.BankStatementController && typeof window.BankStatementController.openLinkedDocument === 'function') {
        window.BankStatementController.openLinkedDocument(docNo, type, id, null);
      }
    }
  };
})();
