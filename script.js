// ============================================
// Dark Mode & Theme Management
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    updateThemeToggleTooltip();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    updateThemeToggleTooltip();
}

function updateThemeToggleTooltip() {
    const toggle = document.getElementById('theme-toggle');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('data-tooltip', isDark ? 'Chế độ sáng (Alt+D)' : 'Chế độ tối (Alt+D)');
}


// ============================================
// Loading Animation
// ============================================

function showLoading() {
    const btn = document.getElementById('btn-calculate');
    btn.classList.add('loading');
    btn.classList.remove('success');
}

function hideLoading(showSuccess = true) {
    const btn = document.getElementById('btn-calculate');
    btn.classList.remove('loading');

    if (showSuccess) {
        btn.classList.add('success');
        setTimeout(() => {
            btn.classList.remove('success');
        }, 1500);
    }
}

// ============================================
// Initialize Event Listeners
// ============================================

function initEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            updateThemeToggleTooltip();
        }
    });
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initEventListeners();
});

// ============================================
// Constants
// ============================================

const BASE_SALARY = 2340000;

// Lương tối thiểu vùng 2025
const REGION_MIN_WAGE_2025 = {
    1: 4960000,
    2: 4410000,
    3: 3860000,
    4: 3250000
};

// Lương tối thiểu vùng 2026 (áp dụng từ 1/7/2025)
const REGION_MIN_WAGE_2026 = {
    1: 5310000,
    2: 4730000,
    3: 4140000,
    4: 3700000
};

// Hàm lấy lương tối thiểu vùng theo năm
function getRegionMinWage(year) {
    if (String(year).startsWith('2026')) {
        return REGION_MIN_WAGE_2026;
    }
    return REGION_MIN_WAGE_2025;
}

// Insurance Rates
const INSURANCE_RATES = {
    bhxh: 0.08,
    bhyt: 0.015,
    bhtn: 0.01
};

const INSURANCE_MAX_SALARY_BHXH_BHYT = 20 * BASE_SALARY; // Capped at 20 * Base Salary

// Tax Configuration
const TAX_CONFIG = {
    2025: {
        personalDeduction: 11000000,
        dependentDeduction: 4400000,
        brackets: [
            { max: 5000000, rate: 0.05, subtract: 0 },
            { max: 10000000, rate: 0.10, subtract: 250000 },
            { max: 18000000, rate: 0.15, subtract: 750000 },
            { max: 32000000, rate: 0.20, subtract: 1650000 },
            { max: 52000000, rate: 0.25, subtract: 3250000 },
            { max: 80000000, rate: 0.30, subtract: 5850000 },
            { max: Infinity, rate: 0.35, subtract: 9850000 }
        ]
    },
    // Dự thảo 2026 - Trước 1/7/2026: Chỉ tăng giảm trừ, giữ biểu thuế 7 bậc cũ
    '2026-h1': {
        personalDeduction: 15500000,
        dependentDeduction: 6200000,
        brackets: [
            { max: 5000000, rate: 0.05, subtract: 0 },
            { max: 10000000, rate: 0.10, subtract: 250000 },
            { max: 18000000, rate: 0.15, subtract: 750000 },
            { max: 32000000, rate: 0.20, subtract: 1650000 },
            { max: 52000000, rate: 0.25, subtract: 3250000 },
            { max: 80000000, rate: 0.30, subtract: 5850000 },
            { max: Infinity, rate: 0.35, subtract: 9850000 }
        ]
    },
    // Dự thảo 2026 - Từ 1/7/2026: Giảm trừ mới + biểu thuế 5 bậc mới
    '2026-h2': {
        personalDeduction: 15500000,
        dependentDeduction: 6200000,
        brackets: [
            { max: 10000000, rate: 0.05, subtract: 0 },
            { max: 30000000, rate: 0.10, subtract: 500000 },
            { max: 60000000, rate: 0.20, subtract: 3500000 },
            { max: 100000000, rate: 0.30, subtract: 9500000 },
            { max: Infinity, rate: 0.35, subtract: 14500000 }
        ]
    }
};

let currentYear = 2025;
let currentMode = 'gross-net'; // 'gross-net' or 'net-gross'
let isComparisonMode = false;

function switchYear(year) {
    isComparisonMode = false;
    currentYear = year;
    const is2026 = String(year).startsWith('2026');

    document.getElementById('btn-year-2025').classList.toggle('active', year === 2025);
    document.getElementById('btn-year-2026').classList.toggle('active', is2026);
    document.getElementById('btn-compare').classList.remove('active');

    // Show/hide period selector for 2026
    const periodContainer = document.getElementById('period-2026-container');
    if (is2026) {
        periodContainer.classList.remove('hidden');
        document.getElementById('period-2026').value = year;
    } else {
        periodContainer.classList.add('hidden');
    }

    // Show regular result, hide comparison
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('comparison-section').classList.add('hidden');

    updatePolicyNote(year);
    calculate();
}

function switchPeriod2026(period) {
    currentYear = period;
    updatePolicyNote(period);
    calculate();
}

function updatePolicyNote(year) {
    const config = TAX_CONFIG[year];
    let note = `Giảm trừ gia cảnh: Bản thân <strong>${formatCurrency(config.personalDeduction / 1000000)}tr</strong>/tháng, Phụ thuộc <strong>${formatCurrency(config.dependentDeduction / 1000000)}tr</strong>/tháng`;

    if (year === '2026-h1') {
        note += '<br><small>Áp dụng trước 1/7/2026: Giảm trừ mới, biểu thuế 7 bậc cũ</small>';
    } else if (year === '2026-h2') {
        note += '<br><small>Áp dụng từ 1/7/2026: Giảm trừ mới + biểu thuế 5 bậc mới</small>';
    }

    document.getElementById('policy-note').innerHTML = note;

    // Cập nhật tooltip vùng lương tối thiểu
    updateRegionTooltip(year);
}

function updateRegionTooltip(year) {
    const regionWage = getRegionMinWage(year);
    const tooltip = `Vùng I: ${(regionWage[1] / 1000000).toFixed(2)}tr | Vùng II: ${(regionWage[2] / 1000000).toFixed(2)}tr | Vùng III: ${(regionWage[3] / 1000000).toFixed(2)}tr | Vùng IV: ${(regionWage[4] / 1000000).toFixed(2)}tr. Ảnh hưởng đến mức đóng BHTN tối đa (20 x lương tối thiểu vùng).`;

    const tooltipEl = document.getElementById('region-tooltip');
    if (tooltipEl) {
        tooltipEl.setAttribute('data-tooltip', tooltip);
    }
}

function switchToCompare() {
    isComparisonMode = true;
    document.getElementById('btn-year-2025').classList.remove('active');
    document.getElementById('btn-year-2026').classList.remove('active');
    document.getElementById('btn-compare').classList.add('active');

    // Hide period selector
    document.getElementById('period-2026-container').classList.add('hidden');

    // Hide regular result, show comparison
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('comparison-section').classList.remove('hidden');

    document.getElementById('policy-note').innerHTML = 'So sánh 3 giai đoạn: Hiện hành (2025), Trước 1/7/2026, và Từ 1/7/2026';

    calculateComparison();
}

function switchMode(mode) {
    currentMode = mode;
    document.getElementById('btn-gross-net').classList.toggle('active', mode === 'gross-net');
    document.getElementById('btn-net-gross').classList.toggle('active', mode === 'net-gross');

    // Update label
    const incomeLabel = document.querySelector('label[for="income"]');
    if (mode === 'gross-net') {
        incomeLabel.textContent = 'Thu nhập Gross (VNĐ)';
    } else {
        incomeLabel.textContent = 'Thu nhập Net (VNĐ)';
    }

    calculate();
}

function toggleInsuranceInput() {
    const type = document.querySelector('input[name="insurance-base"]:checked').value;
    const input = document.getElementById('insurance-salary');
    if (type === 'other') {
        input.classList.remove('hidden');
    } else {
        input.classList.add('hidden');
    }
    calculate();
}

function formatCurrencyInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value) {
        value = parseInt(value, 10).toLocaleString('en-US');
        input.value = value;
    }
}

function parseCurrency(str) {
    return parseInt(str.replace(/,/g, ''), 10) || 0;
}

function formatCurrency(num) {
    return num.toLocaleString('en-US');
}

function calculatePIT(taxableIncome) {
    if (taxableIncome <= 0) return 0;

    let totalTax = 0;
    const brackets = TAX_CONFIG[currentYear].brackets;
    for (let bracket of brackets) {
        if (taxableIncome <= bracket.max) {
            totalTax = taxableIncome * bracket.rate - bracket.subtract;
            break;
        }
    }
    return totalTax;
}

function getTaxBreakdown(taxableIncome) {
    if (taxableIncome <= 0) return [];

    const breakdown = [];
    let previousMax = 0;
    const brackets = TAX_CONFIG[currentYear].brackets;

    for (let i = 0; i < brackets.length; i++) {
        const bracket = brackets[i];
        const rate = bracket.rate;
        const currentMax = bracket.max; // This is the cumulative max (e.g. 5m, 10m)

        // The range for this bracket is (previousMax, currentMax]
        // But we need to know how much of the taxableIncome falls into this range.

        // Range size:
        // Level 1: 0 - 5m
        // Level 2: 5m - 10m
        // ...

        // Actually, simpler logic:
        // Calculate tax for this specific chunk.

        let incomeInBracket = 0;

        if (taxableIncome > previousMax) {
            const maxInThisBracket = (currentMax === Infinity ? taxableIncome : currentMax) - previousMax;
            const actualInThisBracket = Math.min(taxableIncome - previousMax, maxInThisBracket);

            if (actualInThisBracket > 0) {
                const tax = actualInThisBracket * rate;
                breakdown.push({
                    level: i + 1,
                    rate: rate * 100,
                    income: actualInThisBracket,
                    tax: tax,
                    label: `Đến ${currentMax === Infinity ? '...' : formatCurrency(currentMax)}`
                });
            }
        }

        previousMax = currentMax;
        if (taxableIncome <= previousMax) break;
    }

    return breakdown;
}

function calculate() {
    const income = parseCurrency(document.getElementById('income').value);
    const dependents = parseInt(document.getElementById('dependents').value) || 0;
    const region = document.querySelector('input[name="region"]:checked').value;
    const insuranceType = document.querySelector('input[name="insurance-base"]:checked').value;
    let insuranceSalaryInput = parseCurrency(document.getElementById('insurance-salary').value);

    if (income === 0) return;

    // Show loading animation
    showLoading();

    // Use setTimeout to allow the UI to update before heavy calculation
    setTimeout(() => {
        if (isComparisonMode) {
            calculateComparison();
            hideLoading();
            return;
        }

        let gross, net;

        if (currentMode === 'gross-net') {
            gross = income;
            const result = calculateFromGross(gross, dependents, region, insuranceType, insuranceSalaryInput);
            updateUI(result);
        } else {
            net = income;
            // Net to Gross is iterative or formula inversion. Iterative is safer for complex tax.
            // Or we can use the "converted income" method.
            const result = calculateFromNet(net, dependents, region, insuranceType, insuranceSalaryInput);
            updateUI(result);
        }

        hideLoading();
    }, 300); // Small delay for visual feedback
}

function calculateComparison() {
    const income = parseCurrency(document.getElementById('income').value);
    const dependents = parseInt(document.getElementById('dependents').value) || 0;
    const region = document.querySelector('input[name="region"]:checked').value;
    const insuranceType = document.querySelector('input[name="insurance-base"]:checked').value;
    let insuranceSalaryInput = parseCurrency(document.getElementById('insurance-salary').value);

    if (income === 0) return;

    const savedYear = currentYear;

    // Calculate for 2025
    currentYear = 2025;
    let result2025;
    if (currentMode === 'gross-net') {
        result2025 = calculateFromGross(income, dependents, region, insuranceType, insuranceSalaryInput);
    } else {
        result2025 = calculateFromNet(income, dependents, region, insuranceType, insuranceSalaryInput);
    }

    // Calculate for 2026-h1 (Trước 1/7/2026 - giảm trừ mới, biểu thuế cũ)
    currentYear = '2026-h1';
    let result2026h1;
    if (currentMode === 'gross-net') {
        result2026h1 = calculateFromGross(income, dependents, region, insuranceType, insuranceSalaryInput);
    } else {
        result2026h1 = calculateFromNet(income, dependents, region, insuranceType, insuranceSalaryInput);
    }

    // Calculate for 2026-h2 (Từ 1/7/2026 - giảm trừ mới + biểu thuế mới)
    currentYear = '2026-h2';
    let result2026h2;
    if (currentMode === 'gross-net') {
        result2026h2 = calculateFromGross(income, dependents, region, insuranceType, insuranceSalaryInput);
    } else {
        result2026h2 = calculateFromNet(income, dependents, region, insuranceType, insuranceSalaryInput);
    }

    // Restore current year
    currentYear = savedYear;

    // Update comparison UI
    updateComparisonUI(result2025, result2026h1, result2026h2);
}

function updateComparisonUI(result2025, result2026h1, result2026h2) {
    // Gross
    document.getElementById('comp-gross-2025').textContent = formatCurrency(Math.round(result2025.gross));
    document.getElementById('comp-gross-2026h1').textContent = formatCurrency(Math.round(result2026h1.gross));
    document.getElementById('comp-gross-2026h2').textContent = formatCurrency(Math.round(result2026h2.gross));

    // Net
    document.getElementById('comp-net-2025').textContent = formatCurrency(Math.round(result2025.net));
    document.getElementById('comp-net-2026h1').textContent = formatCurrency(Math.round(result2026h1.net));
    document.getElementById('comp-net-2026h2').textContent = formatCurrency(Math.round(result2026h2.net));

    // Tax
    document.getElementById('comp-tax-2025').textContent = formatCurrency(Math.round(result2025.pit));
    document.getElementById('comp-tax-2026h1').textContent = formatCurrency(Math.round(result2026h1.pit));
    document.getElementById('comp-tax-2026h2').textContent = formatCurrency(Math.round(result2026h2.pit));

    // Net difference vs 2025
    const netDiffH1 = result2026h1.net - result2025.net;
    const netDiffH1El = document.getElementById('comp-net-diff-h1');
    netDiffH1El.textContent = (netDiffH1 >= 0 ? '+' : '') + formatCurrency(Math.round(netDiffH1));
    netDiffH1El.classList.toggle('positive', netDiffH1 > 0);
    netDiffH1El.classList.toggle('negative', netDiffH1 < 0);

    const netDiffH2 = result2026h2.net - result2025.net;
    const netDiffH2El = document.getElementById('comp-net-diff-h2');
    netDiffH2El.textContent = (netDiffH2 >= 0 ? '+' : '') + formatCurrency(Math.round(netDiffH2));
    netDiffH2El.classList.toggle('positive', netDiffH2 > 0);
    netDiffH2El.classList.toggle('negative', netDiffH2 < 0);
}

function calculateFromGross(gross, dependents, region, insuranceType, insuranceSalaryInput) {
    // 1. Calculate Insurance Salary Base
    let insuranceSalary = gross;
    if (insuranceType === 'other' && insuranceSalaryInput > 0) {
        insuranceSalary = insuranceSalaryInput;
    }

    // Cap BHXH/BHYT
    const cappedBhxhBhyt = Math.min(insuranceSalary, INSURANCE_MAX_SALARY_BHXH_BHYT);
    // Cap BHTN (Region based) - sử dụng lương tối thiểu vùng theo năm
    const regionMinWage = getRegionMinWage(currentYear);
    const maxBhtn = 20 * regionMinWage[region];
    const cappedBhtn = Math.min(insuranceSalary, maxBhtn);

    const bhxh = cappedBhxhBhyt * INSURANCE_RATES.bhxh;
    const bhyt = cappedBhxhBhyt * INSURANCE_RATES.bhyt;
    const bhtn = cappedBhtn * INSURANCE_RATES.bhtn;
    const totalInsurance = bhxh + bhyt + bhtn;

    // 2. Calculate Taxable Income
    const preTaxIncome = gross - totalInsurance;
    const config = TAX_CONFIG[currentYear];
    const totalDeduction = config.personalDeduction + (dependents * config.dependentDeduction);
    const taxableIncome = Math.max(0, preTaxIncome - totalDeduction);

    // 3. Calculate PIT
    const pit = calculatePIT(taxableIncome);

    // 4. Net
    const net = gross - totalInsurance - pit;

    return {
        gross,
        net,
        bhxh,
        bhyt,
        bhtn,
        preTaxIncome,
        totalDeduction,
        taxableIncome,
        pit
    };
}

function calculateFromNet(net, dependents, region, insuranceType, insuranceSalaryInput) {
    // If insurance is on "Official Salary", Gross is unknown, so Insurance is unknown.
    // This requires iteration or solving equation: Net = Gross - Ins(Gross) - Tax(Gross - Ins(Gross) - Deductions)

    // If insurance is "Other" (Fixed), it's easier:
    // Net = Gross - FixedIns - Tax(Gross - FixedIns - Deductions)
    // => Gross - Tax(...) = Net + FixedIns. Convert Net+FixedIns to Taxable, then to Gross.

    // Let's use a simple iterative approach (Binary Search) to find Gross that yields the target Net.
    // Range: [Net, Net * 2] (Roughly)

    let low = net;
    let high = net * 2; // Initial guess
    let gross = net;
    let result;

    // Expand high if needed
    while (true) {
        result = calculateFromGross(high, dependents, region, insuranceType, insuranceSalaryInput);
        if (result.net > net) break;
        low = high;
        high *= 2;
        if (high > 10000000000) break; // Safety break
    }

    // Binary search
    for (let i = 0; i < 100; i++) { // Increased iterations for better precision
        gross = (low + high) / 2;
        result = calculateFromGross(gross, dependents, region, insuranceType, insuranceSalaryInput);

        if (Math.abs(result.net - net) < 1) {
            break;
        }

        if (result.net < net) {
            low = gross;
        } else {
            high = gross;
        }
    }

    // Force Net to match input if it's very close (rounding error)
    if (Math.abs(result.net - net) < 5) {
        result.net = net;
    }

    return result;
}

function updateUI(data) {
    document.getElementById('res-gross').textContent = formatCurrency(Math.round(data.gross));
    document.getElementById('res-net').textContent = formatCurrency(Math.round(data.net));
    document.getElementById('res-pit').textContent = formatCurrency(Math.round(data.pit));

    document.getElementById('detail-gross').textContent = formatCurrency(Math.round(data.gross));
    document.getElementById('detail-bhxh').textContent = formatCurrency(Math.round(data.bhxh));
    document.getElementById('detail-bhyt').textContent = formatCurrency(Math.round(data.bhyt));
    document.getElementById('detail-bhtn').textContent = formatCurrency(Math.round(data.bhtn));
    document.getElementById('detail-pre-tax').textContent = formatCurrency(Math.round(data.preTaxIncome));
    document.getElementById('detail-personal-deduction').textContent = formatCurrency(TAX_CONFIG[currentYear].personalDeduction);
    document.getElementById('detail-dependents').textContent = formatCurrency(Math.round(data.totalDeduction - TAX_CONFIG[currentYear].personalDeduction));
    document.getElementById('detail-taxable').textContent = formatCurrency(Math.round(data.taxableIncome));
    document.getElementById('detail-pit').textContent = formatCurrency(Math.round(data.pit));
    document.getElementById('detail-net').textContent = formatCurrency(Math.round(data.net));

    // Render Tax Breakdown
    const breakdown = getTaxBreakdown(data.taxableIncome);
    const container = document.getElementById('pit-details-container');
    const tbody = document.querySelector('#pit-details-table tbody');

    if (breakdown.length > 0) {
        container.classList.remove('hidden');
        tbody.innerHTML = breakdown.map(item => `
            <tr>
                <td>Bậc ${item.level} (${item.rate}%)</td>
                <td class="text-right">${formatCurrency(Math.round(item.income))}</td>
                <td class="text-right">${formatCurrency(Math.round(item.tax))}</td>
            </tr>
        `).join('');
    } else {
        container.classList.add('hidden');
    }
}

// Initial call - DOM is ready since script is at end of body
calculate();
