// B2B Fleet Calculator — Vanilla JS
(function () {
    // Tier data (will be updated by tier selector)
    let currentRetail = 95000;
    let currentMonthly = 5250;

    const slider = document.getElementById('deviceSlider');
    const label = document.getElementById('deviceLabel');
    const capex = document.getElementById('capexVal');
    const opex = document.getElementById('opexVal');

    function formatINR(num) {
        return '₹' + num.toLocaleString('en-IN');
    }

    function update() {
        const count = parseInt(slider.value, 10);
        label.textContent = count;
        capex.innerHTML = formatINR(count * currentRetail) + ' <small>upfront</small>';
        opex.innerHTML = formatINR(count * currentMonthly) + ' <small>/ month</small>';
    }

    slider.addEventListener('input', update);

    // Tier selector
    window.selectTier = function (btn) {
        // Update active state
        document.querySelectorAll('.tier-opt').forEach(function (t) {
            t.classList.remove('tier-active');
        });
        btn.classList.add('tier-active');

        // Read data attributes
        currentRetail = parseInt(btn.getAttribute('data-retail'), 10);
        currentMonthly = parseInt(btn.getAttribute('data-monthly'), 10);

        update();
    };

    // Initial render
    update();

    // Fleet request handler with toast
    window.requestFleet = function () {
        var name = document.getElementById('companyName').value.trim();
        var email = document.getElementById('contactEmail').value.trim();
        var count = slider.value;

        if (!name || !email) {
            if (typeof showToast === 'function') {
                showToast('Please fill in Company Name and Contact Email.', 'error');
            } else {
                alert('Please fill in Company Name and Contact Email.');
            }
            return;
        }

        if (typeof showToast === 'function') {
            showToast('Fleet request submitted for ' + name + ' (' + count + ' devices). We\'ll be in touch!', 'success');
        } else {
            alert('Fleet Setup Requested!\n\nCompany: ' + name + '\nEmail: ' + email + '\nDevices: ' + count);
        }
    };
})();
