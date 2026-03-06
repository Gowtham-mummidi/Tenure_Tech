// ===========================
// Tenure Tech — Global JS
// ===========================

// --- Toast Notification System ---
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    const icons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'
    };

    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span><span class="toast-msg">' + message + '</span>';
    document.body.appendChild(toast);

    // Trigger entrance
    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    // Auto-dismiss
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


// --- Mobile Hamburger Menu ---
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar .container');
    const navLinks = document.querySelector('.nav-links');

    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    navbar.appendChild(hamburger);

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('nav-open');
        hamburger.classList.toggle('hamburger-active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('nav-open');
            hamburger.classList.remove('hamburger-active');
        });
    });
});


// --- Animated Number Counters ---
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const prefix = el.getAttribute('data-prefix') || '';
                const duration = 1600;
                const start = performance.now();

                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(target * eased);
                    el.textContent = prefix + current.toLocaleString('en-IN') + suffix;

                    if (progress < 1) requestAnimationFrame(tick);
                }

                requestAnimationFrame(tick);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(function (c) { observer.observe(c); });
}

document.addEventListener('DOMContentLoaded', animateCounters);


// --- Subscribe Modal (Multi-step KYC Flow) ---
function openSubscribeModal(planName) {
    // Remove existing modal
    const existing = document.getElementById('subscribeModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'subscribeModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="closeModal()">&times;</button>
      <div class="modal-progress">
        <div class="progress-step active" id="pStep1"><span>1</span> Plan</div>
        <div class="progress-line"></div>
        <div class="progress-step" id="pStep2"><span>2</span> KYC</div>
        <div class="progress-line"></div>
        <div class="progress-step" id="pStep3"><span>3</span> Confirm</div>
      </div>

      <!-- Step 1: Plan Summary -->
      <div class="modal-step" id="step1">
        <h3>Selected Plan</h3>
        <div class="modal-plan-badge">${planName}</div>
        <p class="modal-hint">Review your selection and proceed to identity verification.</p>
        <button class="btn btn-primary btn-full" onclick="goToStep(2)">Continue to KYC</button>
      </div>

      <!-- Step 2: KYC Form -->
      <div class="modal-step hidden" id="step2">
        <h3>Digital KYC</h3>
        <div class="form-stack">
          <div class="field">
            <label for="kycName">Full Name</label>
            <input type="text" id="kycName" placeholder="Rishi Kumar" />
          </div>
          <div class="field">
            <label for="kycEmail">Email Address</label>
            <input type="email" id="kycEmail" placeholder="rishi@example.com" />
          </div>
          <div class="field">
            <label for="kycPhone">Phone Number</label>
            <input type="tel" id="kycPhone" placeholder="+91 98765 43210" />
          </div>
          <div class="field">
            <label for="kycId">Aadhaar / PAN Number</label>
            <input type="text" id="kycId" placeholder="XXXX-XXXX-XXXX" />
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="goToStep(1)">Back</button>
          <button class="btn btn-primary" onclick="submitKYC()">Verify & Continue</button>
        </div>
      </div>

      <!-- Step 3: Confirmation -->
      <div class="modal-step hidden" id="step3">
        <div class="confirm-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
        </div>
        <h3>You're All Set!</h3>
        <p class="modal-hint">KYC verified. Your <strong>${planName}</strong> rig will be shipped within 48 hours with full hardware replacement coverage.</p>
        <div class="confirm-details">
          <div class="confirm-row"><span>Status</span><span class="status-badge">Processing</span></div>
          <div class="confirm-row"><span>Est. Delivery</span><span>2–3 business days</span></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="closeModal()">Done</button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function goToStep(step) {
    // Validate step 2
    if (step === 3) {
        return submitKYC();
    }

    document.querySelectorAll('.modal-step').forEach(s => s.classList.add('hidden'));
    document.getElementById('step' + step).classList.remove('hidden');

    document.querySelectorAll('.progress-step').forEach((s, i) => {
        s.classList.toggle('active', i < step);
        s.classList.toggle('completed', i < step - 1);
    });
}

function submitKYC() {
    const name = document.getElementById('kycName').value.trim();
    const email = document.getElementById('kycEmail').value.trim();
    const phone = document.getElementById('kycPhone').value.trim();

    if (!name || !email || !phone) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    // Show loading state briefly
    const btn = document.querySelector('#step2 .btn-primary');
    const original = btn.textContent;
    btn.textContent = 'Verifying...';
    btn.disabled = true;

    setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;

        document.querySelectorAll('.modal-step').forEach(s => s.classList.add('hidden'));
        document.getElementById('step3').classList.remove('hidden');

        document.querySelectorAll('.progress-step').forEach(s => {
            s.classList.add('active');
            s.classList.add('completed');
        });

        showToast('KYC verified successfully!', 'success');
    }, 1200);
}

function closeModal() {
    const modal = document.getElementById('subscribeModal');
    if (modal) {
        modal.classList.remove('modal-visible');
        setTimeout(() => modal.remove(), 300);
    }
}

// Close on overlay click
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});
