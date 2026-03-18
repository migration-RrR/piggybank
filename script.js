const goalsContainer = document.getElementById('goals-container');
const addGoalBtn = document.getElementById('add-goal-btn');
const goalNameInput = document.getElementById('goal-name');
const goalAmountInput = document.getElementById('goal-amount');
const celebrationEl = document.getElementById('celebration');
const completeText = document.getElementById('goal-complete');

let goals = [];

// Формат числа с точками
function formatAmount(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Автоформат ввода цели
goalAmountInput.addEventListener('input', e => {
  let value = e.target.value.replace(/\D/g,'');
  if (value) e.target.value = formatAmount(value);
});

function createGoalElement(goal) {
  const goalEl = document.createElement('div');
  goalEl.classList.add('goal');

  goalEl.innerHTML = `
    <h2>${goal.name}</h2>
    <div class="goal-info">
      Собрано: <span class="collected">${formatAmount(goal.amount)}</span>₸ | 
      Осталось: <span class="remaining">${formatAmount(goal.target - goal.amount)}</span>₸
    </div>
    <div class="progress-bar">
      <div class="progress-fill">0%</div>
    </div>
    <div class="goal-actions">
      <input type="number" min="1" placeholder="Сумма" class="amount-input">
      <button class="add-money-btn">Добавить</button>
    </div>
    <div class="history"></div>
  `;

  const progressFill = goalEl.querySelector('.progress-fill');
  const collectedEl = goalEl.querySelector('.collected');
  const remainingEl = goalEl.querySelector('.remaining');
  const amountInput = goalEl.querySelector('.amount-input');
  const addMoneyBtn = goalEl.querySelector('.add-money-btn');
  const historyEl = goalEl.querySelector('.history');

  // Удаление цели
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-goal-btn');
  deleteBtn.innerHTML = '🗑️';
  goalEl.appendChild(deleteBtn);

  deleteBtn.addEventListener('click', () => {
    goalEl.style.transition = 'opacity 0.4s, transform 0.4s';
    goalEl.style.opacity = '0';
    goalEl.style.transform = 'translateX(100%)';
    setTimeout(() => goalEl.remove(), 400);
    goals = goals.filter(g => g !== goal);
  });

  function updateProgress() {
    const percent = Math.min(100, Math.round((goal.amount / goal.target) * 100));
    progressFill.style.width = percent + '%';
    progressFill.textContent = percent + '%';
    collectedEl.textContent = formatAmount(goal.amount);
    remainingEl.textContent = formatAmount(Math.max(0, goal.target - goal.amount));

    if (percent >= 80 && percent < 100) {
      progressFill.classList.add('near-complete');
    } else {
      progressFill.classList.remove('near-complete');
    }

    if (percent >= 100) celebrateGoal(goalEl, progressFill);
  }

  addMoneyBtn.addEventListener('click', () => {
    let amount = parseFloat(amountInput.value.replace(/\./g,'')); 
    if (!amount || amount <= 0) return;

    const progressWidth = progressFill.parentElement.clientWidth;
    const coinsCount = Math.min(5, Math.floor(amount / 10) + 1); // меньше монет

    for (let i = 0; i < coinsCount; i++) {
      const coin = document.createElement('div');
      coin.classList.add('coin');
      const startLeft = Math.random() * (progressWidth - 14);
      coin.style.left = `${startLeft}px`;
      goalEl.appendChild(coin);
      setTimeout(() => coin.remove(), 800);

      const spark = document.createElement('div');
      spark.classList.add('spark');
      spark.style.left = `${startLeft}px`;
      spark.style.top = `0px`;
      spark.style.setProperty('--dx', `${(Math.random()-0.5)*30}px`);
      spark.style.setProperty('--dy', `${Math.random()*30}px`);
      goalEl.appendChild(spark);
      setTimeout(() => spark.remove(), 800);
    }

    goal.amount += amount;
    if (goal.amount > goal.target) goal.amount = goal.target;

    updateProgress();

    const now = new Date();
    const time = now.toLocaleTimeString();
    const entry = `${time} — +${formatAmount(amount)}₸`;
    goal.history.push(entry);
    historyEl.innerHTML = goal.history.slice(-5).join('<br>');

    amountInput.value = '';
  });

  amountInput.addEventListener('input', e => {
    let value = e.target.value.replace(/\D/g,'');
    if (value) e.target.value = formatAmount(value);
  });

  return goalEl;
}

addGoalBtn.addEventListener('click', () => {
  let name = goalNameInput.value.trim();
  let target = parseFloat(goalAmountInput.value.replace(/\./g,''));
  if (!name || !target || target <= 0) return;

  const newGoal = { name, target, amount: 0, history: [] };
  goals.push(newGoal);

  const goalEl = createGoalElement(newGoal);
  goalsContainer.appendChild(goalEl);

  goalNameInput.value = '';
  goalAmountInput.value = '';
});

// Праздничная анимация при достижении цели
function celebrateGoal(goalEl, progressFill) {
  progressFill.style.backgroundColor = '#28a745';

  completeText.classList.add('show');

  celebrationEl.classList.remove('hidden');

  for (let i = 0; i < 20; i++) { // меньше монет
    const coin = document.createElement('div');
    coin.classList.add('celebration-coin');
    coin.style.left = Math.random() * window.innerWidth + 'px';
    coin.style.top = Math.random() * window.innerHeight/2 + 'px';
    celebrationEl.appendChild(coin);
    setTimeout(() => coin.remove(), 1500);
  }

  setTimeout(() => {
    completeText.classList.remove('show');
    celebrationEl.classList.add('hidden');
  }, 2000);
}
