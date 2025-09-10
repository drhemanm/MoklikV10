
// Konami code sequence
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Math jokes and puns
const MATH_JOKES = [
  "Why was 6 afraid of 7? Because 7 8 9!",
  "What did the triangle say to the circle? You're pointless!",
  "Why do mathematicians love parks? Because of all the natural logs!",
  "What's a mathematician's favorite dessert? Pi!",
  "Why did the mathematician get upset at lunch? Because he had a negative root beer!"
];

// Hidden achievements
export const ACHIEVEMENTS = {
  KONAMI_MASTER: 'Found the Konami Code!',
  MATH_ENTHUSIAST: 'Solved 10 problems in one session',
  NIGHT_OWL: 'Studied after midnight',
  LUCKY_NUMBER: 'Found the lucky number',
  EASTER_EGG_HUNTER: 'Discovered 3 easter eggs'
};

class EasterEggManager {
  private sequence: string[] = [];
  private discoveredEggs: Set<string> = new Set();
  private callbacks: Map<string, () => void> = new Map();

  constructor() {
    this.initializeKonamiCode();
    this.initializeMathJokes();
    // Initialize click sequence after DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeClickSequence());
    } else {
      this.initializeClickSequence();
    }
  }

  private initializeKonamiCode() {
    document.addEventListener('keydown', (e) => {
      this.sequence.push(e.key);
      
      if (this.sequence.length > KONAMI_CODE.length) {
        this.sequence.shift();
      }

      if (this.checkKonamiCode()) {
        this.triggerEasterEgg('KONAMI_MASTER');
        document.body.classList.add('rainbow-mode');
        setTimeout(() => document.body.classList.remove('rainbow-mode'), 5000);
      }
    });
  }

  private initializeClickSequence() {
    let moklikClicks = 0;
    document.querySelector('img[alt="Moklik"]')?.addEventListener('click', () => {
      moklikClicks++;
      if (moklikClicks === 7) { // Lucky number 7
        const logo = document.querySelector('img[alt="Moklik"]');
        logo?.classList.add('logo-spin');
        setTimeout(() => logo?.classList.remove('logo-spin'), 500);
        this.triggerEasterEgg('LUCKY_NUMBER');
        this.showMathJoke();
        moklikClicks = 0;
      }
    });
  }

  private initializeMathJokes() {
    // Add hidden math symbols that reveal jokes when found
    document.querySelectorAll('.math-content').forEach(element => {
      const hiddenSymbol = document.createElement('span');
      hiddenSymbol.className = 'hidden-math-symbol';
      hiddenSymbol.textContent = '∑';
      hiddenSymbol.style.opacity = '0.1';
      
      hiddenSymbol.addEventListener('mouseover', () => {
        this.showMathJoke();
      });
      
      element.appendChild(hiddenSymbol);
    });
  }

  private checkKonamiCode(): boolean {
    return this.sequence.join(',') === KONAMI_CODE.join(',');
  }

  private showMathJoke() {
    const joke = MATH_JOKES[Math.floor(Math.random() * MATH_JOKES.length)];
    const jokeElement = document.createElement('div');
    jokeElement.className = 'math-joke-popup';
    jokeElement.textContent = joke;
    
    document.body.appendChild(jokeElement);
    setTimeout(() => jokeElement.remove(), 3000);
  }

  public triggerEasterEgg(id: keyof typeof ACHIEVEMENTS) {
    if (!this.discoveredEggs.has(id)) {
      this.discoveredEggs.add(id);
      
      // Show achievement notification
      const notification = document.createElement('div');
      notification.className = 'achievement-notification';
      notification.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div class="achievement-text">
          <h4>Achievement Unlocked!</h4>
          <p>${ACHIEVEMENTS[id]}</p>
        </div>
      `;
      
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 5000);

      // Check if user found 3 easter eggs
      if (this.discoveredEggs.size === 3) {
        this.triggerEasterEgg('EASTER_EGG_HUNTER');
      }

      // Call any registered callbacks
      this.callbacks.get(id)?.();
    }
  }

  public onEasterEggFound(id: keyof typeof ACHIEVEMENTS, callback: () => void) {
    this.callbacks.set(id, callback);
  }
}

export const easterEggManager = new EasterEggManager();