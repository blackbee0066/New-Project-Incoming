// === Escape HTML Helper (must be defined before use) ===
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"'`=\/]/g, function(s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    })[s];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // your entire JavaScript code goes here

  const userProfile = document.getElementById('userProfile');
  const dropdownMenu = document.getElementById('dropdownMenu');

  // Toggle dropdown menu 
  document.querySelector('.profile-header').addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display ==='block' ? 'none' : 'block';
  });

  // click anywhere to close dropdown
  window.addEventListener('click', (e) => {

    if (!userProfile.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }

  });



  const partners =  JSON.parse(localStorage.getItem('people')) || [];  
  let expensesSummary = JSON.parse(localStorage.getItem('expensesSummary')) || [];


  /*========ADD PARTNER LOGIC========*/
  const nameInput = document.getElementById('nameInput');
  const addPartnerBtn = document.getElementById('addPartnerBtn');
  const peopleList = document.getElementById('peopleList');


  /*==========HELPERS=========*/
  function savePartners() {
    localStorage.setItem('people', JSON.stringify(partners));
  }


  function saveExpensesSummary() {
    localStorage.setItem('expensesSummary', JSON.stringify(expensesSummary));
  }

    

  /*==========CREATE PARTNER ELEMENT============*/

  function createPartnerElement(name, index) {
    const partnerItem = document.createElement('div');
    partnerItem.classList.add('partner-item');

    // Circle for first letter
    const circle = document.createElement('div');
    circle.classList.add('profile-circle');
    circle.textContent = name.split(' ')
      .map(w => w[0]?.toUpperCase()).join('');


    // Full name
    const fullName = document.createElement('span');
    fullName.textContent = name;

    // === ICON CONTAINER ===
    const actions = document.createElement('div');
    actions.classList.add('partner-actions');

    // ✏️ Edit (Boxicon)
    const editPartner = document.createElement('i');
    editPartner.className = 'bx bx-edit-alt edit-partner';
    editPartner.title = 'Edit Partner';

    // 🗑️ Delete (Boxicon)
    const deletePartner = document.createElement('i');
    deletePartner.className = 'bx bx-trash delete-partner';
    deletePartner.title = 'Delete Partner';

    // Append icons
    actions.appendChild(editPartner);
    actions.appendChild(deletePartner);

    // Append everything to the item
    partnerItem.appendChild(circle);
    partnerItem.appendChild(fullName);
    partnerItem.appendChild(actions);

    // === Edit Partner Handler ===
    editPartner.addEventListener('click',() => {
      const newName = prompt('Edit partner name:', name);
      if (newName && newName.trim() !== '') {
        partners[index] = newName.trim();
          savePartners();
          renderPartners();
        }
      });

    // === Delete Partner Handler ===
    deletePartner.addEventListener('click', () => {
      if (confirm(`Remove ${name}?`)) {
        partners.splice(index, 1);
        savePartners();
        renderPartners();
      }
    });

    return partnerItem;
  }


  /*==========RENDER SAVED PARTNERS============*/

  function renderPartners() {

    peopleList.innerHTML = '';

    partners.forEach((p, i) => {

      peopleList.appendChild(createPartnerElement(p, i)); 
    });

    calculateGroupBalances();
  }


    
    /*========ADD PARTNER BUTTON========*/
    addPartnerBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (name === "") return;

      // ✅ check if name already exists (case-insensitive)
      const exists = partners.some(p => {
        if (typeof p === 'string') {
          return p.toLowerCase() === name.toLowerCase();

        } else if (p.name) {
          return p.name.toLowerCase() === name.toLowerCase();
        }

          return false;

        });

        if (exists) {
          alert(`${name} is already added.`);
          nameInput.value = '';
          return;
        }
        // update memory and UI
        partners.push(name);
        savePartners();

        peopleList.appendChild(createPartnerElement(name));

        // clear input
        nameInput.value = '';
    });

    /*========ADD PARTNER WITH ENTER KEY========*/
    nameInput.addEventListener('keydown', (e) => {

      if (e.key === 'Enter') {
        addPartnerBtn.click(); 
      }

    });


  /*========ADD EXPENSES========*/

  const paidBy = document.getElementById('paidBy');

  function payerDropdown() {
    // Clear existing options except the placeholder
        
    paidBy.innerHTML = `<option class="paid-by-select" value="" disabled selected>Select Partner</option>`;

    // Add each partner as an option
    partners.forEach(partner => {
      const option = document.createElement('option');

      option.value = partner;
      option.textContent = partner;

      paidBy.appendChild(option);
            
    });

    // Add the final "Multiple people" option
    const multipleOptions = document.createElement('option');

    multipleOptions.value = 'multiple';
    multipleOptions.textContent = 'Multiple Options';

    paidBy.appendChild(multipleOptions);
        
  }

  // Call this whenever the partners list updates
  payerDropdown();

    

  // Function for the Modal
  const multipleOptionModal = document.getElementById('multipleOptionModal');
  const partnerContribution = document.getElementById('partnerContribution');
  const closeMultipleModalBtn = document.getElementById('closeMultipleModalBtn');

  function showMultipleOptionModal() {
    partnerContribution.innerHTML = "";

    partners.forEach(partner => {
      const row = document.createElement('div');
      row.className = 'partner-row';

      const label = document.createElement('label');
      label.textContent = partner;

      const input = document.createElement('input');
      input.type = 'number';
      input.dataset.partner = partner;
      input.placeholder = 'Amount (GHS)';

      const leftSide = document.createElement('div');
      leftSide.className = 'partner-info';
      leftSide.appendChild(label);

      row.appendChild(leftSide);
      row.appendChild(input);

      partnerContribution.appendChild(row);

    });

    multipleOptionModal.classList.add('show'); // show modal

  }

  function hideMultipleOptionModal() {
    multipleOptionModal.classList.remove('show'); // hide modal

    // Reset select so change will trigger again
    paidBy.value = ""; // or default option value

  }

  // Close button click
  closeMultipleModalBtn.addEventListener('click', hideMultipleOptionModal);

  // Trigger modal when "Multiple people" is selected
  paidBy.addEventListener('change', function() {
    if (this.value === 'multiple') {
      showMultipleOptionModal();
    } else {
      hideMultipleOptionModal();
    }
  });

  

  // ======= GLOBAL VARIABLES =======

  const addExpenseBtn = document.getElementById('addExpenseBtn');
  const summaryList = document.getElementById('summaryList');


  // ======= ADD EXPENSE =======
  addExpenseBtn.addEventListener('click', () => {
    const title = document.getElementById('expenseTitle').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value.trim());
    const paidBy = document.getElementById('paidBy').value;

    if (!title || !amount || !paidBy) {
      alert('Please fill all fields');
      return;
    }

    const today = new Date();
    const date = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });

    // Get contributions from modal inputs
    const contributionInputs = partnerContribution.querySelectorAll('input[type="number"]');
    let contributors = [];
    let totalContributed = 0;

    contributionInputs.forEach(input => {
      const value = parseFloat(input.value) || 0;
      const partner = input.dataset.partner;
      contributors.push({ partner, value });
      totalContributed += value;
    });

    // If not multiple people, single payer
    if (paidBy !== 'multiple') {
      contributors = [{ partner: paidBy, value: amount }];
      totalContributed = amount;
    }

    // Compute equal share
    const equalShare = totalContributed / contributors.length;

    const paid = [];
    const owed = [];
    let paidCount = 0;
    let owedCount = 0;

    contributors.forEach(contribute => {
      const diff = contribute.value - equalShare;

      if (contribute.value > 0) paidCount++;

      if (diff > 0.01) {
        paid.push(`${contribute.partner} paid GHS ${contribute.value.toFixed(2)} and is owed GHS ${diff.toFixed(2)}`);

      } else if (diff < -0.01) {
        owed.push(`${contribute.partner} paid GHS ${contribute.value.toFixed(2)} and owes GHS ${Math.abs(diff).toFixed(2)}`);
        owedCount++;

      } else if (contribute.value > 0) {
        paid.push(`${contribute.partner} paid GHS ${contribute.value.toFixed(2)} and is settled`);
      }
    });

    // Build the expense object
    const expense = {
      id: Date.now(),
      date,
      title,
      amount,
      paidCount,
      owedCount,
      paid,
      owed,
      contributions: contributors
    };

    // Save to main array + localStorage
    expensesSummary.push(expense);
    localStorage.setItem('expensesSummary', JSON.stringify(expensesSummary));
    
    saveExpensesSummary();
    renderSummary(expensesSummary);
    calculateGroupBalances();

    


    // Clear fields
    document.getElementById('expenseTitle').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('paidBy').selectedIndex = 0;
    hideMultipleOptionModal();
  });


  // ======= RENDER SUMMARY =======
  function renderSummary(list) {
    summaryList.innerHTML = '';

    if (list.length === 0) {
      summaryList.innerHTML = `<p style="text-align:center;color:#666;">No expenses added yet.</p>`;
      return;
    }

    list.forEach((expense, index) => {
      const paid = Array.isArray(expense.paid) ? expense.paid : [];
      const owed = Array.isArray(expense.owed) ? expense.owed : [];

      const summaryRow = document.createElement('div');
      summaryRow.classList.add('summary-row');
      summaryRow.dataset.id = expense.id; 

      summaryRow.innerHTML = `
        <div class="summary-main">
          <div class="summary-left">
            <span class="summary-date">${expense.date || ''}</span>
            <span class="summary-item">${expense.title || ''}</span>
          </div>

          <div class="summary-right">
            <div class="summary-stats">
              <span class="summary-amount"><strong>GHS ${expense.amount || 0}</strong></span>

              <span class="summary-paid"><strong>${expense.paidCount || 0}</strong> ${(expense.paidCount === 1) ? 'person paid' : 'people paid'}</span>

              <span class="summary-owed"><strong>${expense.owedCount || 0}</strong> ${(expense.owedCount === 1) ? 'person owes' : 'people owe'}</span>
            </div>

            <div class="summary-actions">

              <i class="bx bx-edit-alt edit-summary-row" style="color: #273c27"></i>
              <i class="bx bx-trash delete-summary-row" style="color: red"></i>

            </div>
          </div>
        </div>

        <div class="summary-breakdown hidden">

          <div class="breakdown-paid">
            <h4>Paid & Settled</h4>
            ${paid.map(p => `<p class="paid-detail">${p}</p>`).join('')}
          </div>

          <div class="breakdown-owed">
            <h4>Owes</h4>
            ${owed.map(o => `<p class="owed-detail">${o}</p>`).join('')}
          </div>

        </div>
      `;

      summaryList.appendChild(summaryRow);

      // ===== DELETE LOGIC =====
      const deleteSummaryRow = summaryRow.querySelector('.delete-summary-row');
      deleteSummaryRow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`This will delete the entire row`)) {
          expensesSummary.splice(index, 1);
          localStorage.setItem('expensesSummary', JSON.stringify(expensesSummary));
          renderSummary(expensesSummary);
        }
      });

      // ===== TOGGLE BREAKDOWN =====
      summaryRow.addEventListener('click', (e) => {

        if (e.target.closest('.summary-actions')) return;
        const breakdown = summaryRow.querySelector('.summary-breakdown');
        breakdown.classList.toggle('hidden');

      });

    });

  } 


  // ===== EDIT LOGIC (outside renderSummary) =====

  const editOptionModal = document.getElementById('editOptionModal');
  const editedPartnerContribution = document.getElementById('editedPartnerContribution'); 

  const saveEditBtn = document.getElementById('saveEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  document.addEventListener('click', (e) => {
    const editIcon = e.target.closest('.edit-summary-row');
    if (!editIcon) return;

    e.stopPropagation();

    // Get the clicked row’s expense
    const summaryRow = editIcon.closest('.summary-row');
    const expenseId = summaryRow.dataset.id;

    const expense = expensesSummary.find(x => x.id == expenseId);
    if (!expense) return alert("Expense not found");


    // ✅ Prefill the new title and total fields
    document.getElementById('editExpenseTitle').value = expense.title || '';
    document.getElementById('editExpenseTotal').value = expense.amount || '';

    // Show modal
    editOptionModal.classList.remove('hidden');
    editedPartnerContribution.innerHTML = '';

  
    // Use all known partners, but pull saved amounts from this expense
    editedPartnerContribution.innerHTML = '';

    partners.forEach(name => {
      const existing = (expense.contributions || []).find(c => c.partner === name);
      const amount = existing ? existing.value : 0;

      const div = document.createElement('div');
      div.classList.add('partner-edit-row');

      const label = document.createElement('label');
      label.textContent = name;

      const input = document.createElement('input');
      input.type = 'number';
      input.dataset.partner = name;
      input.placeholder = 'Amount (GHS)';
      input.value = amount;
      input.classList.add('partner-contribution-amount');

      div.appendChild(label);
      div.appendChild(input);
      editedPartnerContribution.appendChild(div);

    });


    saveEditBtn.onclick = () => {
      const inputs = editedPartnerContribution.querySelectorAll('.partner-contribution-amount');
      const updatedContributions = [];
      let hasChanges = false;

      // Gather updated values and check if anything changed
      inputs.forEach(input => {
        const partner = input.dataset.partner;
        const value = parseFloat(input.value.trim()) || 0;
        updatedContributions.push({ partner, value });

        const existing = (expense.contributions || []).find(c => c.partner === partner);
        if (!existing || existing.value !== value) hasChanges = true;
      });

      // ✅ If nothing was changed, just close the modal and return
      if (!hasChanges) {
        editOptionModal.classList.add('hidden');
        return;
      }

      // Continue with calculations if there was a change
      const totalContributed = updatedContributions.reduce((sum, c) => sum + c.value, 0);
      const nonZeroContributors = updatedContributions.filter(c => c.value > 0);

      const paid = [];
      const owed = [];
      let paidCount = 0;
      let owedCount = 0;

      // ✅ CASE 1: Only one person paid — treat as settled, no debts
      if (nonZeroContributors.length === 1) {
        const payer = nonZeroContributors[0];
        paid.push(`${payer.partner} paid GHS ${payer.value.toFixed(2)} and is settled`);
        paidCount = 1;
        owedCount = 0;

      } else {
        // ✅ CASE 2: Normal shared-expense logic
        const equalShare = totalContributed / updatedContributions.length;

        updatedContributions.forEach(contribute => {
          const diff = contribute.value - equalShare;

          if (contribute.value > 0) paidCount++;

          if (diff > 0.01) {
            paid.push(`${contribute.partner} paid GH₵ ${contribute.value.toFixed(2)} and is owed GH₵ ${diff.toFixed(2)}`);
          } else if (diff < -0.01) {
            owed.push(`${contribute.partner} paid GH₵ ${contribute.value.toFixed(2)} and owes GH ${Math.abs(diff).toFixed(2)}`);
            owed.push(`${contribute.partner} paid GH₵ ${contribute.value.toFixed(2)} and owes GH₵ ${Math.abs(diff).toFixed(2)}`);
            owedCount++;
          } else if (contribute.value > 0) {
            paid.push(`${contribute.partner} paid GH₵ ${contribute.value.toFixed(2)} and is settled`);
          }
        });
      }

      // ✅ Update expense object
      expense.title = document.getElementById('editExpenseTitle').value.trim() || expense.title;

      expense.amount = parseFloat(document.getElementById('editExpenseTotal').value.trim()) || totalContributed;

      expense.contributions = updatedContributions;
      expense.paid = paid;
      expense.owed = owed;
      expense.paidCount = paidCount;
      expense.owedCount = owedCount;

      // ✅ Save and refresh
      localStorage.setItem('expensesSummary', JSON.stringify(expensesSummary));
      renderSummary(expensesSummary);
      calculateGroupBalances();

      // ✅ Close modal
      editOptionModal.classList.add('hidden');
      
    };

    // Close modal when user clicks "Cancel"
    cancelEditBtn.addEventListener('click', () => {
      editOptionModal.classList.add('hidden');
    });

    //user clicks outside the modal
    window.addEventListener('click', (e) => {
        if (e.target === editOptionModal) {
          editOptionModal.classList.add('hidden');
      }
    });

  });


  // ===== INIT =====
  renderPartners();
  renderSummary(expensesSummary);
  calculateGroupBalances();

    
  
  // ===== GROUP BALANCE CALCULATION =====
  function calculateGroupBalances() {
    const balances = {}; 

    // Initialize every partner with balance 0
    partners.forEach(name => balances[name] = 0);

    const groupBalanceList = document.getElementById('groupBalanceList');
    groupBalanceList.innerHTML = "";

    // check for no expenses.
    if (!expensesSummary || expensesSummary.length === 0) {
      
      groupBalanceList.innerHTML = `<p>No expenses yet.</p>`;
      return;
    }

    // Loop through each expense entry
    expensesSummary.forEach((expense, index) => {

      const title = expense.title;
      const contributions = expense.contributions;

      if (!contributions || contributions.length === 0) return;

      // Calculate totals & equal shares
      const total = contributions.reduce((sum, c) => sum + c.value, 0);
      const equalShare = contributions.length > 1 ? total / contributions.length : total;

      // Create expense card and add a class
      const expenseDiv = document.createElement('div');
      expenseDiv.classList.add('group-balance-item');

      // Expense header (title at the top)
      const expenseHeader = `

        <div class="itemTitle"> ${title} at
          <span>₵ ${expense.amount.toFixed(2)}</span>

        </div>
      `;


      // Members + initials + contribution + balance status
      const memberList = contributions.map(c => {
        const diff = c.value - equalShare;

        // Get initials from partner full name
        const initials = c.partner
          .split(' ')
          .map(w => w[0]?.toUpperCase())
          .join('')
          .slice(0, 2);

        let status;
        if (Math.abs(diff) < 0.01) status = "Settled ✅";
        else if (diff > 0) status = `Gets back ₵ ${diff.toFixed(2)}`;
        else status = `Owes ₵ ${Math.abs(diff).toFixed(2)}`;
          
        return `
          <div class="expense-member">
            
            <span class="initials">${initials}</span>
            <span class="member-name">${c.partner}</span>
            <span class="member-status">${status}</span>

          </div>

          
        `;


      }).join('')
      // Buttons section (beneath the grid)
      const actions = `
        <div class="balance-actions">
          <button class="view-details-btn" data-index="${index}">View Details</button>
          <button class="clear-btn" data-index="${index}">Clear</button>
        </div>
      `;

      // Combine into one expense card
      expenseDiv.innerHTML = `
        ${expenseHeader}
        <div class="expense-members">${memberList}</div>
        ${actions}
      `;

      groupBalanceList.appendChild(expenseDiv);
    });


    // ===== Button Logic =====

    // Clear specific expense
    document.querySelectorAll('.clear-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {

        const index = e.target.dataset.index;

        if (confirm("Clear this expense from records?")) {
          expensesSummary.splice(index, 1);

          localStorage.setItem('expensesSummary', JSON.stringify(expensesSummary));

          calculateGroupBalances();
        }

      });

    });


    //===== View details
    document.querySelectorAll('.view-details-btn').forEach(btn => {

      btn.addEventListener('click', (e) => {

        const index = e.target.dataset.index;
        const exp = expensesSummary[index];
        
        const total = exp.contributions.reduce((sum, c) => sum + c.value, 0);
        const equalShare = exp.contributions.length > 1? total / exp.contributions.length : total;

        const contributorRows = exp.contributions.map(c => {
          const initials = c.partner
            .split(' ')
            .map(w => w[0]?.toUpperCase())
            .join('')
          .slice('0, 2');

          const diff = c.value - equalShare;
          let status;

          if (Math.abs(diff) < 0.01) status = 'Settled ✅';
          else if (diff > 0) status = `Gets back ₵ ${diff.toFixed(2)}`
          else status = `Owes ₵ ${Math.abs(diff).toFixed(2)}`;

          return `
            <div class="expense-member">
            <span class="initials">${initials}</span>
            <span class="member-name">${c.partner}</span>
            <span class="member-status">Paid: ₵ ${c.value.toFixed(2)} & ${status}</span>
          </div> `

        }).join('');

        //create Modal
        const modal = document.createElement('div');
        modal.classList.add('expense-view-details');

        const modalContent = document.createElement('div');
        modalContent.classList.add('expense-view-details-content');

        modalContent.innerHTML = `
          <h4 class="view-details-title">${exp.title} at <span>₵ ${exp.amount}</span></h4>
          ${contributorRows}
          <div class="view-details-actions">
            <button class="expense-modal-close">Close</button>
            <button class="expense-modal-settle" id="settleBtn">Settle</button>
          </div>
        `
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        //======Close modal
        modal.querySelector('.expense-modal-close').addEventListener('click', () => {
          document.body.removeChild(modal);
        });

        // Close when clicking outside content
        modal.addEventListener('click', (ev) => {

          if (ev.target === modal) {
            document.body.removeChild(modal);
          }

        });


        //======Settle modal
        const settleBtn = document.querySelector('.expense-modal-settle');

        settleBtn.addEventListener('click', async () => {
          
          // Show loading spinner first (important)
          settleBtn.innerHTML = `<span class="loader"></span> saving...`;
          settleBtn.disabled = true;

          // Recalculate equal share
          const total = exp.contributions.reduce((sum, c) => sum + c.value, 0);
          const equalShare = exp.contributions.length > 1
          ? total / exp.contributions.length
          : total;


          // Settle all balances
          exp.contributions = exp.contributions.map(c => ({
            ...c,
            value: equalShare
          }));

          // Recalculate paid/owed arrays and counts
          const paid = [];
          const owed = [];
          let paidCount = 0;
          let owedCount = 0;

          exp.contributions.forEach(c => {
            const diff = c.value - equalShare;

             if (diff > -0.01 && diff < 0.01) { // settled
              paid.push(`${c.partner} paid GHS ${c.value.toFixed(2)} and is settled`);
              paidCount++;
            } else if (diff > 0.01) { // overpaid
              paid.push(`${c.partner} paid GHS ${c.value.toFixed(2)} and is owed GHS ${diff.toFixed(2)}`);
              paidCount++;
            } else { // owes
              owed.push(`${c.partner} paid GHS ${c.value.toFixed(2)} and owes GHS ${Math.abs(diff).toFixed(2)}`);
              owedCount++;
            }
          });

          // Update expense summary fields
          exp.paid = paid;
          exp.owed = owed;
          exp.paidCount = paidCount;
          exp.owedCount = owedCount;

          // Save back into array
          expensesSummary[index] = exp;

          localStorage.setItem("expensesSummary", JSON.stringify(expensesSummary));

          // Fake delay for spinner animation
          await new Promise(res => setTimeout(res, 1200));

          // Close modal
          document.body.removeChild(modal);

          // Refresh UI if needed
          calculateGroupBalances();        
          renderSummary(expensesSummary); 
                  
        });

      });

    });
  }

  calculateGroupBalances();


   
   

  /*====TOOLTIP HOVER====*/
  const tooltip = document.getElementById('balanceTooltip');
  let hideTimeout = null;

  function attachDelegatedTooltip() {

    const container = document.getElementById('groupBalanceList');
    if (!container) return;

    if (container._hasTooltipListener) return; // already attached
    container._hasTooltipListener = true;

    container.addEventListener('mouseover', (ev) => {
      const member = ev.target.closest('.expense-member');
      if (!member || !container.contains(member)) return;

      // Avoid firing when entering child from same member
      const related = ev.relatedTarget;
      if (related && member.contains(related)) return;

      clearTimeout(hideTimeout);

      // Prefer structured data if available
      const partner = member.dataset.partner || member.querySelector('.member-name')?.textContent?.trim() || 'Unknown';

      const emailFromData = member.dataset.email && member.dataset.email.trim();

      const email = emailFromData || (partner !== 'Unknown' ? `${partner.split(' ')[0].toLowerCase()}@example.com` : 'unknown@example.com');

      const balanceText = member.querySelector('.member-status')?.textContent?.trim() || 'No balance info';

      const lower = balanceText.toLowerCase();
      let color = '#ccc';

      if (lower.includes('owes')) color = 'red';
      else if (lower.includes('gets back')) color = 'green';

      tooltip.innerHTML = `

        <div class="tooltip-content">
          <strong style="color:#ccc">${escapeHtml(partner)}</strong>

          <p style="margin:0;font-size:0.9rem;">Email: ${escapeHtml(email)}</p>
        </div>

        <p style="color:${color};font-weight:500;margin-top:6px;">Status: ${escapeHtml(balanceText)}</p>
      `;

      // show tooltip
      tooltip.classList.remove('hidden');
      tooltip.classList.add('show');

      // position after layout is computed
      requestAnimationFrame(() => {
        const rect = member.getBoundingClientRect();
        const ttRect = tooltip.getBoundingClientRect();

        tooltip.style.left = `${rect.left + window.scrollX - tooltip.offsetWidth - 15}px`;

        let left = rect.left + window.scrollX - ttRect.width - 12;
        if (left < 6) left = rect.right + window.scrollX + 12;

        let top = rect.top + window.scrollY + rect.height / 2 - ttRect.height / 2;
        top = Math.max(8, Math.min(top, window.scrollY + window.innerHeight - ttRect.height - 8));

        tooltip.style.left = `${Math.round(left)}px`;
        tooltip.style.top = `${Math.round(top)}px`;

      });
  

    });

    container.addEventListener('mouseout', (ev) => {
      const member = ev.target.closest('.expense-member');
      if (!member) return;

      const related = ev.relatedTarget;
      if (related && member.contains(related)) return;

      hideTimeout = setTimeout(() => {
        tooltip.classList.remove('show');
       
      }, 80);

    });

    // hide on scroll / resize so stale tooltip doesn't float
    window.addEventListener('scroll', () => {
      tooltip.classList.remove('show');
      tooltip.classList.add('hidden');
    }, { passive: true });

    window.addEventListener('resize', () => {
      tooltip.classList.remove('show');
      tooltip.classList.add('hidden');
    });
  }

  // Run once (place at end of file or inside DOMContentLoaded)
  attachDelegatedTooltip();



  //==========Settle All button
  const settleAllBtn = document.getElementById('settleAllBtn');

  settleAllBtn.addEventListener('click', () => {
    if (!expensesSummary || expensesSummary.length === 0) return;
    if (!confirm('Are you sure you want to settle all debts?')) return;

    // 1️⃣ Update all contributions to equal share
    expensesSummary = expensesSummary.map(exp => {
      const total = exp.contributions.reduce((sum, c) => sum + c.value, 0);

      const equalShare = exp.contributions.length > 1 ? total / exp.contributions.length : total;

      const newContributions = exp.contributions.map(c => ({
        ...c,
        value: equalShare // settle debt
      }));

      // Update status for display
      const paid = [];
      const owed = [];
      let paidCount = 0, owedCount = 0;

      newContributions.forEach(c => {
        const diff = c.value - equalShare;
        let statusText = '';

        if (Math.abs(diff) < 0.01) {
          statusText = `Settled ✅`;
          paid.push(`${c.partner} ${statusText}`);
          paidCount++;

        } else if (diff > 0.01) {
          statusText = `Gets back ₵ ${diff.toFixed(2)}`;
          paid.push(`${c.partner} ${statusText}`);
          paidCount++;

        } else {
          statusText = `Owes ₵ ${Math.abs(diff).toFixed(2)}`;
          owed.push(`${c.partner} ${statusText}`);
          owedCount++;
        }

        // Update member-status for display
        c.statusText = statusText;
      });

      return {
        ...exp, contributions: newContributions, paid, owed, paidCount, owedCount 
      };

    });

    // 2️⃣ Save changes
    localStorage.setItem('expensesSummary', JSON.stringify(expensesSummary));

    // 3️⃣ Re-render group balances and summary
    calculateGroupBalances();
    renderSummary(expensesSummary);

    balanceTooltip(); // or delegated tooltip handler
  });


 //==========Clear All expenses
  const cancelAllBtn = document.getElementById('cancelAllBtn');

  cancelAllBtn.addEventListener('click', () => {
    if (!expensesSummary || expensesSummary.length === 0) return;

    if (!confirm("Are you sure you want to clear all expenses?")) return;

    // Clear the array
    expensesSummary = [];

    // Remove from localStorage
    localStorage.removeItem('expensesSummary');

    // Re-render UI
    calculateGroupBalances();
    renderSummary(expensesSummary); // optional if you use it
  });


});
